import path from 'path'

/*
 * Which files a site's media rows need in its Blob store, and under what key.
 *
 * Copied from the starter (src/media/blob-plan.ts), unchanged but for this
 * note. Pure, so it can be tested without a database or a token. The runner in
 * ./media-blob.ts feeds it the rows and does the I/O. In this repo every row
 * has `prefix: ''` (payload.config.ts), so every key is the bare filename.
 *
 * ⚠️ THE KEY MUST BE THE ONE THE PLUGIN READS. The Blob URL is not stored in
 * the database — @payloadcms/storage-vercel-blob works it out on every read
 * from the row's `filename` (or the size's) and `prefix`. So "leaving the rows
 * pointing at it" means uploading each file under exactly that key: the
 * filename, under the prefix when the row has one. This mirrors
 * plugin-cloud-storage's getFileKey with no collection prefix and
 * useCompositePrefixes off, which is how payload.config.ts sets it up.
 */

export type MediaRow = {
  id: number | string
  filename?: string | null
  mimeType?: string | null
  prefix?: string | null
  sizes?: Record<string, { filename?: string | null; mimeType?: string | null } | null> | null
}

export type BlobFile = {
  /** The key the plugin will ask Blob for. */
  key: string
  /** Where the file is now, relative to public/media. */
  local: string
  mimeType: string | null
  /** The row it belongs to, for the report. */
  row: MediaRow['id']
}

export function blobKey(filename: string, prefix?: string | null): string {
  return prefix ? path.posix.join(prefix, filename) : filename
}

export function planBlobUpload(rows: MediaRow[]): BlobFile[] {
  const out: BlobFile[] = []
  const seen = new Set<string>()

  const add = (row: MediaRow, filename: string | null | undefined, mimeType?: string | null) => {
    if (!filename) return
    const key = blobKey(filename, row.prefix)
    // Two rows naming one file is legal (an image reused); upload it once.
    if (seen.has(key)) return
    seen.add(key)
    out.push({ key, local: filename, mimeType: mimeType ?? row.mimeType ?? null, row: row.id })
  }

  for (const row of rows) {
    add(row, row.filename)
    for (const size of Object.values(row.sizes ?? {})) add(row, size?.filename, size?.mimeType)
  }
  return out
}

/** Skip a file Blob already holds at the same size — what makes a rerun safe. */
export function needsUpload(localSize: number, remoteSize: number | null): boolean {
  return remoteSize === null || remoteSize !== localSize
}
