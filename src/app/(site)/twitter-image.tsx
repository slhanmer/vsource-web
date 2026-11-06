import Card from './opengraph-image'

/* The same card for X/Twitter's `twitter:image` (perf-og). X falls back to
   og:image without it. The drawing is opengraph-image's; the config is
   repeated because Next reads these exports statically. */
export const alt =
  'V Source Development, Brisbane: "Software built to fit." Craig and Simon at a desk.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return Card()
}
