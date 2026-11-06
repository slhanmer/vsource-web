import type { Metadata, ResolvingMetadata } from 'next'

/**
 * Keeps the share card (opengraph-image.tsx) on a page that sets its own
 * `openGraph` (perf-og, 6 November).
 *
 * Next merges metadata one key deep: a page's `openGraph` replaces the
 * layout's whole object, image included, so every page with its own og:title
 * shared with no picture at all (it did before this brief too, when the image
 * was /og.png). This copies the image the layout resolved, file-convention
 * URL and all, into the page's own openGraph. `twitter` is not set by pages,
 * so it inherits the layout's twitter-image untouched.
 */
export async function withShareCard(
  metadata: Metadata,
  parent: ResolvingMetadata
): Promise<Metadata> {
  if (!metadata.openGraph) return metadata
  const images = (await parent).openGraph?.images
  return images ? { ...metadata, openGraph: { ...metadata.openGraph, images } } : metadata
}
