'use client'

import type { Stream } from '@/data/types'
import CutPhoto from '@/components/photos/CutPhoto'
import { useHeroRun } from './HeroRun'

/**
 * The three doors in the fold, in page order — the same order as the
 * headline's WORDS — arriving as their words are typed (see HeroRun.tsx).
 *
 * Every door is a working link from the first paint. One that is still
 * waiting, or mid-entrance, can be clicked and focused like any other; one
 * that is focused before its turn comes in at once rather than leaving focus
 * on something invisible.
 */
export default function HeroDoors({ streams }: { streams: Stream[] }) {
  const run = useHeroRun()

  return (
    <div className={`home-doors${run?.armed ? ' is-armed' : ''}`}>
      {streams.map((stream, i) => {
        const state = run?.armed ? run.doors[i] : 'shown'
        const lit = run?.armed && run.active === i

        return (
          <a
            key={stream.slug}
            className={`home-door is-${state}${lit ? ' is-active' : ''}`}
            href={stream.href}
            onFocus={() => run?.arriveNow(i)}
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
        )
      })}
    </div>
  )
}
