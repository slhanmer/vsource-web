'use client'

import type { Stream } from '@/data/types'
import CutPhoto from '@/components/photos/CutPhoto'
import { useHeroRun } from './HeroRun'

/**
 * The three doors in the fold, in page order — the same order as the
 * headline's WORDS. All three are there from the first paint and never move.
 * The one whose word is on screen carries the teal edge (see HeroRun.tsx).
 */
export default function HeroDoors({ streams }: { streams: Stream[] }) {
  const run = useHeroRun()

  return (
    <div className="home-doors">
      {streams.map((stream, i) => (
        <a
          key={stream.slug}
          className={`home-door home-door--${stream.slug}${run?.active === i ? ' is-active' : ''}`}
          href={stream.href}
        >
          <div className="home-door__cut">
            <CutPhoto
              photo={stream.doorPhoto}
              sizes="(max-width: 480px) 64px, (max-width: 979px) 36vw, (max-width: 1440px) 17vw, 232px"
              className="home-door__photo"
            />
            <div className="home-door__body">
              <span className="home-door__name">{stream.name}</span>
              <span className="home-door__lede">{stream.door}</span>
              <span className="home-door__go">Learn more</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
