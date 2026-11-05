'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { HeroPhoto } from '@/data/types'
import { useHeroRun } from './HeroRun'
import { SETTLE_MS } from './headlineTimeline'

interface Props {
  /** Keyed by stream slug. A stream without photos is left out of the stage. */
  photos: Partial<Record<string, HeroPhoto>>
  /** The visible streams, in the headline's word order: the bands
   *  (hide-websites: however many there are). */
  streams: Array<{ slug: string; name: string; href: string }>
}

/*
 * Two files per stream, each cut for its shape (hero-insets-2): the square
 * `photo` for the run window and the 3:1 `band`. Both render about as wide
 * as the stage column, at most ~620px on a wide screen. Each is shown
 * centred: no object-position anywhere. If a crop is wrong, the fix is a new
 * file.
 */
const SIZES = '(max-width: 979px) 100vw, 620px'

/**
 * The fold's stage (hero-stage, then hero-insets, 5 November): windows cut
 * into the plate beside the copy, with the site's recessed edge. 1.4× the
 * copy's height and inside the content column (home.scss).
 *
 *   - WHILE THE HEADLINE RUNS, one big photograph per word, crossfading in as
 *     the word finishes typing (HeroRun.tsx carries the timing from
 *     headlineTimeline.ts; nothing here has a timer).
 *   - WHEN IT LANDS BACK ON SOFTWARE, the stage settles (SETTLE_MS) into its
 *     bands, one per stream, each a link to its stream page. That is the
 *     permanent state, and it is also what the server renders, what shows
 *     without JavaScript and under reduced motion, and on narrow screens,
 *     where there is no slideshow at all (CSS). So the bands are the LCP, and
 *     they are the ones preloaded.
 *
 * During the run the bands are transparent and take no pointer, so a click
 * on the big Robotics photo cannot land on whichever band is under it. A
 * keyboard user who tabs in during the run still sees the band they are on:
 * focus inside the bands shows them (home.scss).
 *
 * The bands are preloaded: they are the LCP. The square run-window files load
 * eagerly but are not preloaded.
 */
export default function HeroStage({ photos, streams }: Props) {
  const run = useHeroRun()
  const active = run?.active ?? null
  // Only streams with photos: the headline's words and the bands are the
  // same list, in the same order, so `active` indexes both.
  const shown = active === null ? null : (streams[active]?.slug ?? null)
  const order = streams.flatMap((stream) => {
    const hero = photos[stream.slug]
    return hero ? [{ key: stream.slug, hero }] : []
  })

  return (
    <div
      className={`home-stage${shown ? ' is-running' : ''}`}
      style={
        {
          '--home-stage-settle': `${SETTLE_MS}ms`,
          // The stage's height is this many 3:1 bands (home.scss).
          '--home-stage-count': order.length,
        } as CSSProperties
      }
    >
      {/* The slideshow. Decorative while it runs, except for the photo on
          screen, which carries its alt text. */}
      <div className="home-stage__solo">
        {order.map(({ key, hero }) => (
          <Image
            key={key}
            src={hero.photo.src}
            alt={key === shown ? hero.photo.alt : ''}
            aria-hidden={key === shown ? undefined : true}
            width={hero.photo.width}
            height={hero.photo.height}
            sizes={SIZES}
            loading="eager"
            className={`home-stage__solo-img${key === shown ? ' is-shown' : ''}`}
          />
        ))}
        <span className="home-stage__edge" aria-hidden="true" />
      </div>

      {/* The ways in, one per visible stream. Each band is one link, named by the stream; the
          photo in it is decoration, so its alt is empty and a screen reader
          hears "Software, link", not the photo's description first. */}
      <ul className="home-stage__bands" aria-label="What we do">
        {streams.map((stream) => {
          const hero = photos[stream.slug]
          if (!hero) return null
          const band = hero.band
          return (
            <li key={stream.slug} className="home-stage__band">
              <Link href={stream.href} className="home-stage__link">
                <span className="home-stage__photo">
                  <Image
                    src={band.src}
                    alt=""
                    width={band.width}
                    height={band.height}
                    sizes={SIZES}
                    preload
                    className="home-stage__band-img"
                  />
                </span>
                <span className="home-stage__name">{stream.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
