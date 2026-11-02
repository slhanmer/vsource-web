import Image from 'next/image'
import type { Photo } from '@constants'
import './styles/tonedPhoto.scss'

/**
 * A photograph from the shoot, with the site's treatment: greyscale source,
 * duotone as a CSS layer, cut into the page rather than floated on it.
 *
 * The edge is its own layer ABOVE the image. An inset box-shadow on the frame
 * paints under its content, so on a frame the photograph fills it would be
 * hidden the moment the photograph loaded.
 *
 * Optimised by the host (Vercel), so `sizes` decides which width is fetched —
 * pass the width the photo actually renders at. The width and height reserve
 * the box before the file arrives.
 */
export default function TonedPhoto({
  photo,
  sizes,
  className = '',
}: {
  photo: Photo
  sizes: string
  className?: string
}) {
  return (
    <figure className={`toned-photo ${className}`.trim()}>
      <Image
        src={photo.src}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes}
        className="toned-photo__img"
      />
      <span className="toned-photo__tone" aria-hidden="true" />
      <span className="toned-photo__edge" aria-hidden="true" />
    </figure>
  )
}
