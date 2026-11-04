import { stat } from 'fs/promises'
import path from 'path'
import { type CollectionSlug, getPayload, type Payload } from 'payload'

import { loadConfig } from '../db/load-config'
import content from './content'
import { conflicts, describe, type Existing, type SeedRecord } from './guard'
import { crewData, differs, partnerData, projectData, streamData } from './shape'

/*
 * pnpm seed [--force]
 *
 * Loads src/seed/content.ts into the database DATABASE_URL names, uploading
 * every file it references into `media`. Adapted from the starter's
 * src/seed/run.ts: the same guard and the same seed record, with collections
 * in place of the starter's pages, blocks and menus.
 *
 * IDEMPOTENT, AND QUIET ABOUT IT. Every row is found by `slug` (media by
 * filename) and written only if what the seed has differs from what is there,
 * so a second run writes nothing and says so. That matters beyond tidiness:
 * a write moves `updatedAt`, and the guard below compares `updatedAt`.
 *
 * ⚠ AFTER THE ADMIN HAS BEEN USED, THE DATABASE IS THE SOURCE OF TRUTH. The
 * seed refuses to overwrite any row edited since it last wrote it, lists
 * them, and writes nothing (src/seed/guard.ts). --force overrides that.
 *
 * Rows are only removed if content.ts names them in `retired`. Something an
 * admin added is never deleted by omission.
 */
const MEDIA = 'media' as CollectionSlug
const ASSETS = path.resolve(process.cwd(), 'src/seed/assets')
const RECORD_KEY = 'seed:vsource'

type Row = { id: number; updatedAt: string; filesize?: number | null; alt?: string }
type Tally = { created: string[]; updated: string[]; unchanged: number; removed: string[] }
const tally: Tally = { created: [], updated: [], unchanged: 0, removed: [] }

async function bySlug(payload: Payload, collection: CollectionSlug, slug: string) {
  const { docs } = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    draft: false,
  })
  return (docs[0] as unknown as Row | undefined) ?? null
}

async function byFilename(payload: Payload, file: string) {
  const { docs } = await payload.find({
    collection: MEDIA,
    where: { filename: { equals: path.basename(file) } },
    limit: 1,
    depth: 0,
  })
  return (docs[0] as unknown as Row | undefined) ?? null
}

async function versionCount(payload: Payload, collection: CollectionSlug, id: number) {
  const { totalDocs } = await payload.findVersions({
    collection: collection as never,
    where: { parent: { equals: id } },
    limit: 1,
    depth: 0,
  })
  return totalDocs
}

/* Every existing row this run would CHANGE, found with the same lookups the
   upserts use. A row it would create, or leave as it is, is not a conflict. */
async function overwrites(payload: Payload, media: Map<string, number>): Promise<Existing[]> {
  const out: Existing[] = []

  for (const [key, asset] of Object.entries(content.assets)) {
    const row = await byFilename(payload, asset.file)
    if (!row) continue
    const onDisk = (await stat(path.join(ASSETS, asset.file))).size
    if (row.filesize === onDisk && row.alt === asset.alt) continue
    out.push({ collection: 'media', id: row.id, label: key, updatedAt: row.updatedAt })
  }

  /* Media that does not exist yet resolves to -1 here: a reference to it is a
     change either way, which is all this needs to know. */
  const img = (key: string) => media.get(key) ?? -1
  const streamIds = new Map<string, number>()
  for (const s of content.streams) {
    const row = await bySlug(payload, 'streams', s.slug)
    if (row) streamIds.set(s.slug, row.id)
  }
  const stream = (slug: string) => streamIds.get(slug) ?? -1

  const check = async (
    collection: CollectionSlug,
    slug: string,
    want: unknown,
    versioned = false
  ) => {
    const row = await bySlug(payload, collection, slug)
    if (!row || !differs(row, want)) return
    out.push({
      collection,
      id: row.id,
      label: slug,
      updatedAt: row.updatedAt,
      ...(versioned ? { versions: await versionCount(payload, collection, row.id) } : {}),
    })
  }
  for (const s of content.streams) await check('streams', s.slug, streamData(s, img))
  for (const p of content.projects)
    await check('projects', p.slug, projectData(p, img, stream), true)
  for (const c of content.crew) await check('crew', c.slug, crewData(c, img))
  for (const p of content.partners) await check('partners', p.slug, partnerData(p, img))
  for (const [collection, slugs] of Object.entries(content.retired ?? {})) {
    for (const slug of slugs ?? []) {
      const row = await bySlug(payload, collection as CollectionSlug, slug)
      if (row)
        out.push({ collection, id: row.id, label: `${slug} (retire)`, updatedAt: row.updatedAt })
    }
  }
  return out
}

async function upsertMedia(payload: Payload, key: string): Promise<number> {
  const asset = content.assets[key]
  const filePath = path.join(ASSETS, asset.file)
  const existing = await byFilename(payload, asset.file)
  if (!existing) {
    const created = (await payload.create({
      collection: MEDIA,
      data: { alt: asset.alt } as never,
      filePath,
    })) as unknown as Row
    tally.created.push(`media ${key}`)
    return created.id
  }
  const onDisk = (await stat(filePath)).size
  if (existing.filesize !== onDisk) {
    await payload.update({
      collection: MEDIA,
      id: existing.id,
      data: { alt: asset.alt } as never,
      filePath,
    })
    tally.updated.push(`media ${key} (file ${existing.filesize} -> ${onDisk} bytes)`)
  } else if (existing.alt !== asset.alt) {
    await payload.update({ collection: MEDIA, id: existing.id, data: { alt: asset.alt } as never })
    tally.updated.push(`media ${key} (alt)`)
  } else {
    tally.unchanged++
  }
  return existing.id
}

async function upsert(
  payload: Payload,
  collection: CollectionSlug,
  slug: string,
  data: Record<string, unknown>,
  opts: { draft?: boolean } = {}
): Promise<number> {
  const existing = await bySlug(payload, collection, slug)
  const draft = opts.draft ?? false
  if (!existing) {
    const created = (await payload.create({
      collection,
      data: data as never,
      draft,
    })) as unknown as Row
    tally.created.push(`${collection} ${slug}`)
    return created.id
  }
  if (!differs(existing, data)) {
    tally.unchanged++
    return existing.id
  }
  await payload.update({ collection, id: existing.id, data: data as never, draft })
  tally.updated.push(`${collection} ${slug}`)
  return existing.id
}

async function record(
  payload: Payload,
  written: [CollectionSlug, number[], boolean][]
): Promise<SeedRecord> {
  const docs: SeedRecord['docs'] = {}
  for (const [collection, ids, versioned] of written) {
    const into: SeedRecord['docs'][string] = (docs[collection] ??= {})
    for (const id of ids) {
      const row = (await payload.findByID({
        collection,
        id,
        depth: 0,
        draft: false,
      })) as unknown as Row
      into[String(id)] = {
        updatedAt: row.updatedAt,
        ...(versioned ? { versions: await versionCount(payload, collection, id) } : {}),
      }
    }
  }
  return { version: 1, slug: 'vsource', at: new Date().toISOString(), docs }
}

async function main() {
  const payload = await getPayload({ config: await loadConfig() })
  const force = process.env.SEED_FORCE === '1'

  const known = new Map<string, number>()
  for (const [key, asset] of Object.entries(content.assets)) {
    const row = await byFilename(payload, asset.file)
    if (row) known.set(key, row.id)
  }

  const found = conflicts({
    record: await payload.kv.get<SeedRecord>(RECORD_KEY),
    existing: await overwrites(payload, known),
    hasUsers: (await payload.count({ collection: 'users' as CollectionSlug })).totalDocs > 0,
  })
  if (found.length > 0 && !force) {
    console.error(
      `Seed: REFUSED. Seeding would overwrite ${found.length} row(s) that may have been\n` +
        `edited in the admin since a seed last wrote them:\n\n${describe(found)}\n\n` +
        `The database is the source of truth once the site has been edited in the admin.\n` +
        `Nothing was written. If you are sure, rerun with --force.`
    )
    process.exit(1)
  }
  if (found.length > 0) {
    payload.logger.warn(`Seed: --force, overwriting ${found.length} row(s):\n${describe(found)}`)
  }

  const media = new Map<string, number>()
  for (const key of Object.keys(content.assets)) media.set(key, await upsertMedia(payload, key))
  const img = (key: string) => {
    const id = media.get(key)
    if (id === undefined) throw new Error(`Seed: no asset "${key}" in content.assets.`)
    return id
  }

  const streams = new Map<string, number>()
  for (const s of content.streams) {
    streams.set(s.slug, await upsert(payload, 'streams', s.slug, streamData(s, img)))
  }
  const stream = (slug: string) => {
    const id = streams.get(slug)
    if (id === undefined) throw new Error(`Seed: no stream "${slug}".`)
    return id
  }

  const projectIds: number[] = []
  for (const p of content.projects) {
    projectIds.push(
      await upsert(payload, 'projects', p.slug, projectData(p, img, stream), { draft: p.draft })
    )
  }
  const crewIds: number[] = []
  for (const c of content.crew)
    crewIds.push(await upsert(payload, 'crew', c.slug, crewData(c, img)))
  const partnerIds: number[] = []
  for (const p of content.partners) {
    partnerIds.push(await upsert(payload, 'partners', p.slug, partnerData(p, img)))
  }

  for (const [collection, slugs] of Object.entries(content.retired ?? {})) {
    for (const slug of slugs ?? []) {
      const row = await bySlug(payload, collection as CollectionSlug, slug)
      if (!row) continue
      await payload.delete({ collection: collection as CollectionSlug, id: row.id })
      tally.removed.push(`${collection} ${slug}`)
    }
  }

  const site = {
    workingPhoto: img(content.site.workingPhoto),
    groupPhoto: content.site.groupPhoto ? img(content.site.groupPhoto) : null,
    comingSoon: content.site.comingSoon.map((c) => ({ name: c.name, stream: stream(c.stream) })),
  }
  const current = await payload.findGlobal({ slug: 'site', depth: 0 })
  if (differs(current, site)) {
    await payload.updateGlobal({ slug: 'site', data: site as never })
    tally.updated.push('global site')
  } else {
    tally.unchanged++
  }

  await payload.kv.set(
    RECORD_KEY,
    await record(payload, [
      [MEDIA, [...media.values()], false],
      ['streams', [...streams.values()], false],
      ['projects', projectIds, true],
      ['crew', crewIds, false],
      ['partners', partnerIds, false],
    ])
  )

  const list = (label: string, items: string[]) =>
    items.length ? `\n  ${label}:\n    ${items.join('\n    ')}` : ''
  payload.logger.info(
    `Seed: done. ${tally.created.length} created, ${tally.updated.length} updated, ` +
      `${tally.removed.length} removed, ${tally.unchanged} unchanged.` +
      list('created', tally.created) +
      list('updated', tally.updated) +
      list('removed', tally.removed)
  )
}

await main()
process.exit(0)
