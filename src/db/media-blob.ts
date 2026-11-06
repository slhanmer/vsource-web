import { BlobNotFoundError, head, put } from '@vercel/blob'
import { readdir, readFile, stat } from 'fs/promises'
import path from 'path'
import { getPayload } from 'payload'
import sharp from 'sharp'

import { type MediaRow, needsUpload, planBlobUpload } from './blob-plan'
import { loadConfig } from './load-config'

/*
 * pnpm media:blob [--run]  — put this site's public/media into a Blob store.
 *
 * Copied from the starter (src/media/to-blob.ts). The only changes: it loads
 * the config through ./load-config (this repo is CommonJS; see that file),
 * and it lives in src/db, which is already an ESM folder.
 *
 * Run with DATABASE_URL pointing at the database whose rows you are moving
 * (by default .env.local's: the preview Neon branch, which local dev and
 * preview deployments share) and BLOB_READ_WRITE_TOKEN for the store the
 * deployments reading that database use. Without --run it reports what it
 * would do and writes nothing.
 *
 * ⚠️ NO DATABASE WRITES. The plugin builds every media URL from the row's
 * filename on read, so once a file is in Blob under that key the row already
 * points at it. Uploading is the whole move.
 *
 * ⚠️ UPLOAD BEFORE THE DEPLOYMENT HAS THE TOKEN. The moment a deployment has
 * BLOB_READ_WRITE_TOKEN, every image URL it renders is a Blob URL; anything
 * not uploaded yet is a broken image on the live page. So: this, then the env
 * var, then redeploy. See docs/media-blob.md.
 *
 * Safe to rerun: a file Blob already holds at the same size is skipped, so an
 * interrupted run is finished by running it again.
 */

const RUN = process.env.MEDIA_BLOB_RUN === '1'
const token = process.env.BLOB_READ_WRITE_TOKEN
const mediaDir = path.resolve(process.cwd(), 'public', 'media')

/*
 * Fallback for rows created by a seed run straight into Blob (production,
 * 6 Nov): the row's filename can carry a `-N` suffix the upload never got, and
 * the file was never in public/media. Rebuild it from the seed asset of the
 * same base name, resized for a generated size, and upload it under the key
 * the row expects. Still no database writes.
 */
const seedDir = path.resolve(process.cwd(), 'src', 'seed', 'assets')
let seedIndex: Map<string, string> | null = null

async function indexSeedAssets(dir: string, into: Map<string, string>) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) await indexSeedAssets(full, into)
    else into.set(entry.name.toLowerCase(), full)
  }
}

async function fromSeedAsset(name: string): Promise<Buffer | null> {
  if (!seedIndex) {
    seedIndex = new Map()
    await indexSeedAssets(seedDir, seedIndex)
  }
  const m = /^(.*?)(?:-\d+)?(?:-(\d+)x(\d+))?\.([a-z0-9]+)$/i.exec(name)
  if (!m) return null
  const [, base, w, h, ext] = m
  const source = seedIndex.get(`${base}.${ext}`.toLowerCase())
  if (!source) return null
  if (!w || !h) return readFile(source)
  return sharp(source).resize(Number(w), Number(h), { fit: 'cover' }).toBuffer()
}

async function remoteSize(key: string): Promise<number | null> {
  try {
    return (await head(key, { token })).size
  } catch (error) {
    if (error instanceof BlobNotFoundError) return null
    throw error
  }
}

async function main() {
  if (!token) {
    console.error('media:blob: BLOB_READ_WRITE_TOKEN is not set. Nothing to upload to.')
    process.exit(1)
  }

  // Not `import config from '@payload-config'`: see ./load-config.ts.
  const payload = await getPayload({ config: await loadConfig() })
  const { docs } = await payload.find({ collection: 'media', pagination: false, depth: 0 })
  const plan = planBlobUpload(docs as unknown as MediaRow[])

  let uploaded = 0
  let skipped = 0
  const missing: string[] = []

  for (const file of plan) {
    const localPath = path.join(mediaDir, file.local)
    const local = await stat(localPath).catch(() => null)
    const remote = await remoteSize(file.key)

    let body: Buffer | null = null
    if (local) {
      if (!needsUpload(local.size, remote)) {
        skipped++
        continue
      }
    } else {
      if (remote !== null) {
        skipped++
        continue
      }
      body = await fromSeedAsset(path.basename(file.local))
      if (!body) {
        missing.push(`${file.local} (media ${file.row})`)
        continue
      }
    }
    const size = local ? local.size : body!.length

    if (RUN) {
      await put(file.key, body ?? (await readFile(localPath)), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        // The plugin's own default, so a moved file is cached like an uploaded one.
        cacheControlMaxAge: 60 * 60 * 24 * 365,
        contentType: file.mimeType ?? undefined,
        token,
      })
    }
    uploaded++
    console.log(
      `${RUN ? 'uploaded' : 'would upload'}  ${file.key}  (${size} bytes${local ? '' : ', from seed asset'})`
    )
  }

  console.log('')
  console.log(
    `${docs.length} media rows, ${plan.length} files: ` +
      `${uploaded} ${RUN ? 'uploaded' : 'to upload'}, ${skipped} already in Blob, ${missing.length} missing locally.`
  )
  for (const m of missing) console.error(`  MISSING public/media/${m}`)
  if (!RUN && uploaded > 0) console.log('Dry run. Run again with --run to upload.')

  /*
   * Missing files are a fail, not a warning: each one is an image that will be
   * broken the moment the deployment switches to Blob.
   */
  process.exit(missing.length ? 1 : 0)
}

try {
  await main()
} catch (error) {
  // A wrong or revoked token surfaces here as BlobStoreNotFoundError or BlobAccessError.
  const message = error instanceof Error ? error.message : String(error)
  console.error(`media:blob: ${message}`)
  // Drizzle's message is the failed SQL; Postgres's reason is on `cause`.
  const cause = error instanceof Error && error.cause instanceof Error ? error.cause.message : ''
  if (/"prefix"/.test(message) && /does not exist/.test(cause)) {
    console.error(
      'media:blob: this database has no media.prefix column. Run `pnpm payload migrate` first.'
    )
  }
  process.exit(1)
}
