'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@hooks'
import Image from 'next/image'
import type { ProjectMedia as Spec } from '@constants'
import StreamMark from '@/components/home/StreamMark'

/**
 * One piece of showpiece media: a clip, a still, or a stream mark where the
 * work cannot be shown at all.
 *
 * The clip is the interesting case, and the rules it follows are the ones that
 * keep a media-led page from being a liability:
 *
 *   - **Muted, looping, short, and self-hosted.** Nothing long-form plays here;
 *     `spec.long` sends that off-site behind a click so no third-party script
 *     and no cookie-consent surface loads on our page unless somebody asks.
 *   - **Nothing is fetched until it is on screen.** `preload="none"` plus a
 *     poster means the still is all that loads for a card nobody scrolls to,
 *     and an observer starts it when it arrives and pauses it when it leaves.
 *     A page of autoplaying video that all starts at once is how a showpiece
 *     becomes the slowest page on the site.
 *   - **It stops.** Auto-starting motion that loops for more than five seconds
 *     needs a pause control (WCAG 2.2.2), so there is one, and it also pauses
 *     on hover and focus.
 *   - **Under prefers-reduced-motion nothing plays at all** — the poster is
 *     shown, and the control becomes the way to start it rather than stop it.
 *
 * `playsInline` is load-bearing on iOS: without it Safari takes any video that
 * plays over the whole screen, which turns a decorative clip into a takeover.
 */

interface Props {
  spec: Spec
  /** Index media is smaller and lazier than the one on a project's own page. */
  priority?: boolean
  className?: string
  /** The width this media renders at, for the optimiser. Required, because the
   *  same component sits in three layouts of very different widths. */
  sizes: string
}

export default function ProjectMedia({ spec, priority = false, className = '', sizes }: Props) {
  const video = useRef<HTMLVideoElement>(null)
  // Two different pauses, kept apart on purpose. `stopped` is the viewer's
  // choice, made with the button, and it holds until they choose again.
  // `hovering` is the courtesy pause while the pointer is over the clip. They
  // were one flag, so the hover set it, the click flipped it back, and leaving
  // the clip reset it: a mouse user could never make the pause stick, which
  // fails WCAG 2.2.2 for a clip that loops past five seconds.
  const [stopped, setStopped] = useState(false)
  const [hovering, setHovering] = useState(false)
  const wanted = !stopped && !hovering

  const reduced = useReducedMotion()

  useEffect(() => {
    const node = video.current
    if (!node) return

    if (reduced || !wanted) {
      node.pause()
      return
    }

    if (typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // A rejected play() is normal — a browser can refuse, and the
            // control is the answer to that rather than a retry loop.
            node.play().catch(() => {})
          } else {
            node.pause()
          }
        })
      },
      { root: document.getElementById('main'), rootMargin: '10% 0px' }
    )

    io.observe(node)
    return () => io.disconnect()
  }, [reduced, wanted])

  if (spec.kind === 'mark') {
    return (
      <div className={`built-media built-media--mark ${className}`.trim()}>
        {spec.markId && <StreamMark id={spec.markId} className="built-media__mark" />}
        <p className="built-media__note">{spec.alt}</p>
      </div>
    )
  }

  if (spec.kind === 'image') {
    return (
      <div className={`built-media ${className}`.trim()}>
        <Image
          src={spec.src ?? ''}
          alt={spec.alt}
          width={spec.width}
          height={spec.height}
          sizes={sizes}
          priority={priority}
          className="built-media__img"
        />
      </div>
    )
  }

  return (
    <div
      className={`built-media ${className}`.trim()}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <video
        ref={video}
        className="built-media__video"
        poster={spec.poster}
        width={spec.width}
        height={spec.height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={spec.alt}
      >
        <source src={spec.src} type="video/mp4" />
      </video>

      <button
        type="button"
        className="built-media__toggle"
        // The button reports the viewer's own choice, not the hover pause, so
        // its label does not flip just because the pointer is over the clip.
        // Under reduced motion nothing plays, so it reads as stopped there.
        aria-pressed={stopped || reduced}
        aria-label={stopped || reduced ? 'Play this clip' : 'Pause this clip'}
        // On /built the whole card is a link, so without this a click on the
        // button bubbled to it and navigated to the project page instead of
        // pausing. Next's <Link> skips navigation for a default-prevented click.
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setStopped((value) => !value)
        }}
      >
        <span
          className={`built-media__glyph ${stopped || reduced ? 'is-play' : ''}`}
          aria-hidden="true"
        />
      </button>

      {spec.long && (
        <a
          className="built-media__long"
          href={spec.long.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {spec.long.label}
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      )}
    </div>
  )
}
