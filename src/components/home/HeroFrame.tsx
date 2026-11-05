'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Photo } from '@/data/types'
import { useHeroRun } from './HeroRun'
import { WORDS } from './headlineTimeline'

type Key = 'software' | 'robotics' | 'websites' | 'team'

interface Props {
  photos: Record<Key, Photo>
  /** The three streams, in WORDS order: the links under the frame. */
  streams: Array<{ slug: string; name: string; href: string }>
}

const SIZES = '(max-width: 979px) 100vw, 620px'

/**
 * The fold's photograph and the three stream links under it (review-2).
 *
 * The photo follows the headline: each stream's picture while its word is on
 * screen, then the team, which stays (HeroRun.tsx). All four are stacked in
 * one 3:2 frame and crossfade on opacity alone.
 *
 * The LINKS ARE THE STREAMS ABOVE THE FOLD. They are ordinary links from the
 * first paint, readable and usable whatever the run is doing; the one whose
 * word is on screen is lit in --route-active (cyan points: they navigate),
 * and at rest none is.
 *
 * Loading: the team photo is the settled LCP, and what the server renders
 * visible, so it alone has priority. The three stream photos load eagerly,
 * so each is there by the time its word lands, but without priority.
 */
export default function HeroFrame({ photos, streams }: Props) {
  const run = useHeroRun()
  const active = run?.active ?? null
  const shown: Key = active === null ? 'team' : (WORDS[active].toLowerCase() as Key)
  const order: Key[] = ['team', 'software', 'robotics', 'websites']

  return (
    <div className="home-frame">
      <figure className="home-frame__photos">
        {order.map((key) => (
          <Image
            key={key}
            src={photos[key].src}
            alt={key === shown ? photos[key].alt : ''}
            aria-hidden={key === shown ? undefined : true}
            width={photos[key].width}
            height={photos[key].height}
            sizes={SIZES}
            priority={key === 'team'}
            loading={key === 'team' ? undefined : 'eager'}
            className={`home-frame__img${key === shown ? ' is-shown' : ''}`}
          />
        ))}
        <span className="home-frame__edge" aria-hidden="true" />
      </figure>

      <ul className="home-frame__streams" aria-label="What we do">
        {streams.map((stream) => {
          const lit = active !== null && WORDS[active] === stream.name
          return (
            <li key={stream.slug}>
              <Link href={stream.href} className={`home-frame__stream${lit ? ' is-active' : ''}`}>
                {stream.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
