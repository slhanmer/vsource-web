'use client'

import type { CSSProperties } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { HeroPhoto } from '@/data/types'
import { useHeroRun } from './HeroRun'
import { SETTLE_MS, WORDS } from './headlineTimeline'

type Key = 'software' | 'robotics' | 'websites'

interface Props {
  photos: Record<Key, HeroPhoto>
  /** The three streams, in WORDS order: the bands. */
  streams: Array<{ slug: string; name: string; href: string }>
}

/*
 * One URL per photograph, shared by the big photo and its band, so the
 * browser fetches each file once. Sized for the bigger of the two: on a wide
 * screen the big photo covers the full fold height (the viewport less the
 * 96px header), and these are 3:2, so `cover` renders them 1.5× that wide.
 * A band is never wider than the stage, which that already covers.
 */
const SIZES = '(max-width: 979px) 100vw, calc((100vh - 96px) * 1.5)'

/**
 * The fold's stage (hero-stage, 5 November): the right side of the plate,
 * the full fold height, bleeding off the right edge and fading into the plate
 * on its left.
 *
 *   - WHILE THE HEADLINE RUNS, one big photograph per word, crossfading in as
 *     the word finishes typing (HeroRun.tsx carries the timing from
 *     headlineTimeline.ts; nothing here has a timer).
 *   - WHEN IT LANDS BACK ON SOFTWARE, the stage settles (SETTLE_MS) into three
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
 * Each photo's `focus` (the admin's object-position) is the point both crops
 * keep: the stage is tall, a band is wide.
 */
export default function HeroStage({ photos, streams }: Props) {
  const run = useHeroRun()
  const active = run?.active ?? null
  const shown: Key | null = active === null ? null : (WORDS[active].toLowerCase() as Key)
  const order: Key[] = ['software', 'robotics', 'websites']

  return (
    <div
      className={`home-stage${shown ? ' is-running' : ''}`}
      style={{ '--home-stage-settle': `${SETTLE_MS}ms` } as CSSProperties}
    >
      {/* The slideshow. Decorative while it runs, except for the photo on
          screen, which carries its alt text. */}
      <div className="home-stage__solo">
        {order.map((key) => (
          <Image
            key={key}
            src={photos[key].photo.src}
            alt={key === shown ? photos[key].photo.alt : ''}
            aria-hidden={key === shown ? undefined : true}
            width={photos[key].photo.width}
            height={photos[key].photo.height}
            sizes={SIZES}
            loading="eager"
            style={{ objectPosition: photos[key].focus }}
            className={`home-stage__solo-img${key === shown ? ' is-shown' : ''}`}
          />
        ))}
      </div>

      {/* The three ways in. Each band is one link, named by the stream; the
          photo in it is decoration, so its alt is empty and a screen reader
          hears "Software, link", not the photo's description first. */}
      <ul className="home-stage__bands" aria-label="What we do">
        {streams.map((stream) => {
          const key = stream.slug as Key
          const hero = photos[key]
          if (!hero) return null
          return (
            <li key={stream.slug} className="home-stage__band">
              <Link href={stream.href} className="home-stage__link">
                <span className="home-stage__photo">
                  <Image
                    src={hero.photo.src}
                    alt=""
                    width={hero.photo.width}
                    height={hero.photo.height}
                    sizes={SIZES}
                    preload
                    style={{ objectPosition: hero.focus }}
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
