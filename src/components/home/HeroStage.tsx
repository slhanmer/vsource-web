'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { HeroPhoto } from '@/data/types'
import { useHeroRun } from './HeroRun'
import { RIM_MS } from './headlineTimeline'

interface Props {
  /** Keyed by stream slug. A stream without photos is left out of the stage. */
  photos: Partial<Record<string, HeroPhoto>>
  /** The visible streams, in the headline's word order (hide-websites:
   *  however many there are). */
  streams: Array<{ slug: string; name: string; href: string }>
}

/* The photo box is ~30% of a stage column that is at most ~620px wide, and
   28% of the screen on a narrow one. */
const SIZES = '(max-width: 979px) 30vw, 200px'

/**
 * The fold's stage (hero-cards, 6 November): three stacked stream cards, one
 * link per stream, from the first paint. No run window, no crossfade, no
 * settle. What the server renders is what stays.
 *
 * Each card is raised. On its left, the stream's square photograph, WHOLE, in
 * a 1:1 box cut into the card: the box is the file's shape, so nothing is
 * cropped and there is no object-position. On its right, a sunken well with
 * the stream's name and "See more →".
 *
 * The only motion: as each word of the headline finishes typing
 * (HeroRun.tsx, from headlineTimeline.ts), its card's rim lights teal
 * (`is-current`), ending on Software. No timers here.
 *
 * Each card is one link, named by the stream: the photo is decoration (empty
 * alt) and "See more" is aria-hidden, so a screen reader hears
 * "Software, link". The photographs are preloaded: they are the LCP.
 */
export default function HeroStage({ photos, streams }: Props) {
  const run = useHeroRun()
  const current = run?.current ?? null
  // Only streams with photos. The headline's words and the cards are the
  // same list in the same order, so `current` indexes the streams.
  const currentSlug = current === null ? null : (streams[current]?.slug ?? null)
  const shown = streams.filter((stream) => photos[stream.slug])

  return (
    <ul
      className="home-stage"
      aria-label="What we do"
      style={
        {
          '--home-stage-rim': `${RIM_MS}ms`,
          // The photo box is capped so this many cards fit the fold (home.scss).
          '--home-stage-count': shown.length,
        } as CSSProperties
      }
    >
      {shown.map((stream) => {
        const photo = photos[stream.slug]!.photo
        return (
          <li key={stream.slug} className="home-stage__item">
            <Link
              href={stream.href}
              className={`home-card${stream.slug === currentSlug ? ' is-current' : ''}`}
            >
              <span className="home-card__photo">
                <Image
                  src={photo.src}
                  alt=""
                  width={photo.width}
                  height={photo.height}
                  sizes={SIZES}
                  preload
                  className="home-card__img"
                />
              </span>
              <span className="home-card__well">
                <span className="home-card__name">{stream.name}</span>
                <span className="home-card__more" aria-hidden="true">
                  See more <span className="home-card__arrow">→</span>
                </span>
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
