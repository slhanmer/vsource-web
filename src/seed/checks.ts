import type { SeedContent } from './types'

/*
 * Checks the seed runs before it writes anything (home-tweaks §4).
 *
 * A stream section's media sits in a column beside its text. A portrait image
 * there stands far taller than the text (the old Nug row, 738×848, did), so
 * every section image must be landscape: wider than it is tall. Clips are
 * exempt; their poster is checked as an image would be.
 *
 * Pure: the caller passes the image sizes in, so this is testable without the
 * files.
 */
export type SizeOf = (key: string) => Promise<{ width: number; height: number } | null>

const VIDEO = /\.(mp4|webm|mov)$/i

export async function portraitSectionMedia(content: SeedContent, sizeOf: SizeOf) {
  const out: string[] = []
  for (const stream of content.streams) {
    for (const section of stream.sections) {
      const media = section.media
      if (!media?.upload) continue
      const asset = content.assets[media.upload]
      const key = asset && VIDEO.test(asset.file) ? media.poster : media.upload
      if (!key) continue
      const size = await sizeOf(key)
      if (size && size.height > size.width) {
        out.push(`${stream.slug} → ${section.slug}: ${key} is ${size.width}×${size.height}`)
      }
    }
  }
  return out
}
