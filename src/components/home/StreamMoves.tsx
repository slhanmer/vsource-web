'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@hooks'
import { STREAMS } from '@constants'
import StreamMark from './StreamMark'

/**
 * The three streams, one at a time, arriving as you scroll.
 *
 * Each stream is two beats rather than one block. Scroll, and the situation
 * lands on the left while the mark starts drawing itself on the right. Scroll
 * further and the answer arrives under it, with the way through to that
 * stream's page. Scroll again and the next situation starts.
 *
 * Nothing leaves. An earlier version pinned the section and swapped one step
 * for the next in place, which read as a carousel: you could only ever see one,
 * and going back up meant watching things flip. Here the page simply scrolls
 * and each part appears once, in order, and stays — so the whole argument is
 * still on the page behind you.
 *
 * That is why both observers unobserve on their first hit. A reveal that undoes
 * itself when you scroll back up is the thing being avoided, not a feature.
 *
 * Three things this has to get right.
 *
 *   1. **It has to work with the reveals switched off.** Before mount, with no
 *      JavaScript, and under prefers-reduced-motion, every part of every step is
 *      rendered visible. A crawler that does not run JS (per the SEO notes, most
 *      of the AI ones) reads all three in full, and a visitor who asked for less
 *      motion gets a plain page rather than a stack of empty screens.
 *   2. **The scroll source is the page container, not the window.** global.scss
 *      sets `html { overflow: hidden }` and gives scrolling to `#main`, so the
 *      observers' root has to be that element or they never fire.
 *   3. **The two beats need different trigger points, not a timer.** Both
 *      observers watch the same element; the second one's root is shortened
 *      from the bottom so it fires further down the scroll. The gap between them
 *      is scroll distance, which means it is the reader's pace, not ours.
 */

/** The step has entered far enough to state the problem and start the mark. */
const SAY_MARGIN = '0px 0px -22% 0px'
/** Further down again, for the answer. This gap IS the second scroll. */
const REPLY_MARGIN = '0px 0px -52% 0px'

export default function StreamMoves() {
  const steps = useRef<Array<HTMLElement | null>>([])
  // Whether the observers are live. Not the same question as "should the beats
  // start hidden", which also depends on reduced motion — so `armed` is derived
  // below rather than stored. Holding both in one flag meant the effect had to
  // reset it in the reduced branch, which is a synchronous setState inside an
  // effect and a cascading render (eslint react-hooks/set-state-in-effect).
  const [observing, setObserving] = useState(false)
  const [said, setSaid] = useState<boolean[]>(() => STREAMS.map(() => false))
  const [replied, setReplied] = useState<boolean[]>(() => STREAMS.map(() => false))

  const reduced = useReducedMotion()

  // Derived, not stored. If motion is turned off mid-session this flips back to
  // false on the next render on its own, with nothing to reset.
  const armed = observing && !reduced

  useEffect(() => {
    if (reduced) return

    const scroller = document.getElementById('main')
    if (!scroller || typeof IntersectionObserver === 'undefined') return

    let sayIo: IntersectionObserver | null = null
    let replyIo: IntersectionObserver | null = null

    /*
     * ARMING IS DEFERRED BY ONE FRAME, and it has to be all of this together.
     *
     * Arming is what HIDES a step. Priming is what exempts the steps already
     * on screen, which must not animate in — that reads as a glitch rather
     * than an entrance. So the three updates have to land in the same batch,
     * and the measurement has to happen after layout.
     *
     * Doing it synchronously in the effect body is the cascading render that
     * react-hooks/set-state-in-effect names, and the rule reports only the
     * FIRST such call — so fixing them one at a time just moves the error to
     * the next line. A frame is the honest fix for all four at once.
     *
     * The frame costs nothing anyone can see. Until it lands nothing is armed,
     * so every step is shown; and the only steps that could be caught un-hidden
     * are the ones already on screen, which are exactly the ones that stay
     * shown afterwards. The rest are below the fold by definition.
     */
    const frame = requestAnimationFrame(() => {
      const onScreen = steps.current.map((node) => {
        if (!node) return false
        const box = node.getBoundingClientRect()
        return box.top < window.innerHeight && box.bottom > 0
      })

      setObserving(true)
      setSaid((current) => current.map((was, i) => was || onScreen[i]))
      setReplied((current) => current.map((was, i) => was || onScreen[i]))

      const watch = (rootMargin: string, mark: (i: number) => void) => {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return
              const index = Number((entry.target as HTMLElement).dataset.index)
              if (!Number.isNaN(index)) mark(index)
              // Once only: a reveal that undoes itself on the way back up is
              // the thing this section is meant not to do.
              io.unobserve(entry.target)
            })
          },
          { root: scroller, rootMargin }
        )
        steps.current.forEach((node, i) => {
          if (node && !onScreen[i]) io.observe(node)
        })
        return io
      }

      const flip = (setter: typeof setSaid) => (i: number) =>
        setter((current) =>
          current[i] ? current : current.map((was, n) => (n === i ? true : was))
        )

      sayIo = watch(SAY_MARGIN, flip(setSaid))
      replyIo = watch(REPLY_MARGIN, flip(setReplied))
    })

    return () => {
      // Cancel matters: without it, a component unmounted inside that one frame
      // still arms and still builds two observers on detached nodes.
      cancelAnimationFrame(frame)
      sayIo?.disconnect()
      replyIo?.disconnect()
    }
  }, [reduced])

  return (
    <section className="home-moves" aria-labelledby="moves-heading">
      <div className="home-moves__head">
        <p className="home-eyebrow">What changes</p>
        <h2 id="moves-heading" className="home-moves__title">
          <span className="home-moves__line">Where you are now,</span>{' '}
          <span className="home-moves__line">and what you have instead.</span>
        </h2>
      </div>

      {STREAMS.map((stream, i) => {
        // Unarmed means every beat is shown: no JavaScript, reduced motion, or
        // the frame before this component has mounted.
        const shown = !armed || said[i]
        const told = !armed || replied[i]

        return (
          <article
            key={stream.id}
            id={stream.id}
            data-index={i}
            ref={(node) => {
              steps.current[i] = node
            }}
            className={`home-step ${shown ? 'is-in' : 'is-out'} ${told ? 'is-told' : ''}`.trim()}
            aria-labelledby={`${stream.id}-name`}
          >
            <div className="home-step__say">
              <span className="home-step__now">Now</span>
              <p className="home-step__problem">{stream.problem}</p>
            </div>

            <div className="home-step__reply">
              <StreamMark id={stream.id} className="home-step__mark" />
              <div className="home-step__answer">
                <h3 id={`${stream.id}-name`} className="home-step__name">
                  {stream.name}
                </h3>
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
            </div>
          </article>
        )
      })}
    </section>
  )
}
