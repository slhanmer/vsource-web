'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@hooks'
import { PHOTOS, STREAMS } from '@constants'
import CutPhoto from '@/components/photos/CutPhoto'

/**
 * "What changes": the three streams, one row each, as a before and an after.
 *
 * The section heading promises exactly that ("Where you are now, and what you
 * have instead"), so each row is built to show the change rather than describe
 * it, in the site's own material:
 *
 *   1. The stream's name, cut into the plate the way the hero's word is. It is
 *      the row's label and its <h3>.
 *   2. "Now": the situation someone is in today, in a recessed plate, at
 *      body-large size in the secondary colour. The past is cut in: darker
 *      and quieter, but not hidden.
 *   3. "Instead": the `instead` line on the surface, the largest text in the
 *      row and the line the eye should land on. What they get is raised to
 *      meet the light.
 *   4. The `solution`, as body copy in a readable colour: the why behind it.
 *   5. The way through to the stream's page.
 *
 * The photograph is on the right, from the top of the cut box to the bottom of
 * the text, on the right in all three rows. Narrow screens stack it between
 * the "Now" plate and "Instead", so the picture sits at the turn.
 *
 * Only the photograph moves. The text is on the page from the first paint and
 * never animates. The hero already types, and a page where every paragraph
 * waits its turn is slower to read than one where the words are simply there.
 * Each photograph fades in once, with a 12px rise, as it scrolls into view.
 *
 * Three things the fade has to get right.
 *
 *   1. **It has to work with the reveal switched off.** Before mount, with no
 *      JavaScript, and under prefers-reduced-motion, every photograph is
 *      rendered visible. Nothing is hidden until the observer is live.
 *   2. **The scroll source is the page container, not the window.** global.scss
 *      sets `html { overflow: hidden }` and gives scrolling to `#main`, so the
 *      observer's root has to be that element or it never fires.
 *   3. **A photograph already on screen at load does not animate.** One that
 *      fades in while you are looking straight at it reads as a glitch rather
 *      than an entrance. Those are exempted before anything is hidden.
 */

/** The photograph has come far enough up the screen to be worth arriving. */
const PHOTO_MARGIN = '0px 0px -12% 0px'

type Reveal = 'shown' | 'waiting' | 'revealed'

export default function StreamMoves() {
  const photos = useRef<Array<HTMLElement | null>>([])
  // 'shown' is the resting state: visible, with no transition. Only a photo
  // below the fold at mount goes to 'waiting' (hidden), and then 'revealed'
  // (visible, transitioning) when it scrolls in.
  const [reveal, setReveal] = useState<Reveal[]>(() => STREAMS.map(() => 'shown'))

  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return

    const scroller = document.getElementById('main')
    if (!scroller || typeof IntersectionObserver === 'undefined') return

    let io: IntersectionObserver | null = null

    /*
     * ARMING IS DEFERRED BY ONE FRAME. Arming is what hides a photograph, and
     * priming is what exempts the ones already on screen, so the two have to
     * land in one update, measured after layout. Doing it synchronously in the
     * effect body is the cascading render react-hooks/set-state-in-effect
     * reports. Until the frame lands nothing is hidden, so the frame costs
     * nothing anyone can see.
     */
    const frame = requestAnimationFrame(() => {
      const onScreen = photos.current.map((node) => {
        if (!node) return true
        const box = node.getBoundingClientRect()
        return box.top < window.innerHeight && box.bottom > 0
      })

      setReveal((current) =>
        current.map((was, i) => (was === 'shown' && !onScreen[i] ? 'waiting' : was))
      )

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const index = Number((entry.target as HTMLElement).dataset.index)
            if (!Number.isNaN(index)) {
              setReveal((current) =>
                current[index] === 'waiting'
                  ? current.map((was, n) => (n === index ? 'revealed' : was))
                  : current
              )
            }
            // Once only. A photograph that hides again on the way back up is
            // the thing this is meant not to do.
            io?.unobserve(entry.target)
          })
        },
        { root: scroller, rootMargin: PHOTO_MARGIN }
      )
      photos.current.forEach((node, i) => {
        if (node && !onScreen[i]) io?.observe(node)
      })
    })

    return () => {
      // Without the cancel, a component unmounted inside that one frame would
      // still hide its photos and build an observer on detached nodes.
      cancelAnimationFrame(frame)
      io?.disconnect()
    }
  }, [reduced])

  return (
    <section id="what-changes" className="home-moves" aria-labelledby="moves-heading">
      <div className="home-moves__head">
        <p className="home-eyebrow">What changes</p>
        <h2 id="moves-heading" className="home-moves__title">
          <span className="home-moves__line">Where you are now,</span>{' '}
          <span className="home-moves__line">and what you have instead.</span>
        </h2>
      </div>

      {STREAMS.map((stream, i) => {
        // Reduced motion overrides whatever state the observer left behind.
        const state = reduced ? 'shown' : reveal[i]

        return (
          <article
            key={stream.id}
            id={stream.id}
            className="home-step"
            aria-labelledby={`${stream.id}-name`}
          >
            {/* The box is styling on the heading, not a wrapper round it. */}
            <h3 id={`${stream.id}-name`} className="home-step__name cut-slot">
              {stream.name}
            </h3>

            <div className="home-step__past">
              <span className="home-step__eyebrow">Now</span>
              <p className="home-step__problem">{stream.problem}</p>
            </div>

            <div
              ref={(node) => {
                photos.current[i] = node
              }}
              data-index={i}
              className={`home-step__media${state === 'shown' ? '' : ` is-${state}`}`}
            >
              <CutPhoto
                photo={PHOTOS.streams[stream.id].step}
                sizes="(max-width: 979px) 92vw, (max-width: 1440px) 44vw, 600px"
                className="home-step__photo"
              />
            </div>

            <div className="home-step__answer">
              <span className="home-step__eyebrow">Instead</span>
              <p className="home-step__instead">{stream.instead}</p>
              <p className="home-step__solution">{stream.solution}</p>
              <p className="home-step__go">
                <span className="home-step__ask">Sounds familiar?</span>
                <span className="home-step__dot" aria-hidden="true">
                  &middot;
                </span>
                <a className="home-step__link" href={stream.href}>
                  See how it works
                </a>
              </p>
            </div>
          </article>
        )
      })}
    </section>
  )
}
