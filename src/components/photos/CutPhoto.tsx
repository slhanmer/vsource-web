import Image from 'next/image'
import type { Photo } from '@/data/types'
import './styles/cutPhoto.scss'

/**
 * A photograph cut into the page rather than floated on it. In colour, as
 * shot: there is no tone layer and no filter. Depth comes from the recessed
 * edge.
 *
 * The edge is its own layer ABOVE the image. An inset box-shadow on the frame
 * paints under its content, so on a frame the photograph fills it would be
 * hidden the moment the photograph loaded.
 *
 * Optimised by the host (Vercel), so `sizes` decides which width is fetched —
 * pass the width the photo actually renders at. The width and height reserve
 * the box before the file arrives.
 *
 * `preload` is for the one photograph that is a page's LCP element: it is
 * preloaded from the head at high fetch priority. Nowhere else (perf-og).
 */
export default function CutPhoto({
  photo,
  sizes,
  preload = false,
  className = '',
}: {
  photo: Photo
  sizes: string
  preload?: boolean
  className?: string
}) {
  return (
    <figure className={`cut-photo ${className}`.trim()}>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        {...(preload ? { preload: true, fetchPriority: 'high' as const } : {})}
        className="cut-photo__img"
      />
      <span className="cut-photo__edge" aria-hidden="true" />
    </figure>
  )
}
