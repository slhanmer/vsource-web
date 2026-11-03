'use client'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@hooks'
import { CUT_MS, DELETE_MS, HOLD_MS, SEQUENCE, TYPE_MS } from './headlineTimeline'

/**
 * The headline performs the thesis.
 *
 * "Software / Websites / Robotics — built to fit", where the leading word
 * sits in a cut slot. The slot is recut to the next word's width first, and
 * only then is the word typed into it: the opening is made to fit, rather than
 * the word being squeezed to suit the opening. That is the argument of the page
 * rendered as a piece of type.
 *
 * The typing convention is the header readout's, deliberately — same site, same
 * machine. Every character has its own span from the first frame and untyped
 * ones are `visibility: hidden`, so the word holds its full width throughout
 * and the slot never has to chase the text. The caret has zero net width for
 * the same reason.
 *
 * Three things this has to get right:
 *
 *   1. **The sentence exists in the HTML.** A crawler that does not run
 *      JavaScript — per the SEO notes, most of the AI ones — must still read
 *      "Software, websites and robotics, built to fit." That is the
 *      visually-hidden span; the animated copy is aria-hidden so a screen
 *      reader is not read three words in a row.
 *   2. **Widths are measured, not guessed**, and only once the webfont has
 *      landed. Measure against the fallback face and every width is wrong by
 *      the time the real font swaps in.
 *   3. **WCAG 2.2.2, by stopping.** It plays once — Software, Websites,
 *      Robotics, Software — and stops on Software inside five seconds, so it
 *      needs no pause control. It must STAY inside five seconds: the budget and
 *      its arithmetic are in headlineTimeline.ts, and a test fails if a fourth
 *      word or a longer hold takes it over. Under prefers-reduced-motion it does
 *      not run at all.
 */
export default function RotatingHeadline() {
  const slotRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  /** The run reads its position from a ref so advancing a word does not tear
   *  down and restart the timer chain that is advancing it. */
  const stepRef = useRef(0)

  const [step, setStep] = useState(0)
  const [shown, setShown] = useState<number>(SEQUENCE[0].length)
  const [typing, setTyping] = useState(false)

  const reduced = useReducedMotion()
  const word = reduced ? SEQUENCE[SEQUENCE.length - 1] : SEQUENCE[step]
  const caret = typing && !reduced

  /**
   * Recut the slot to the current word. Every character is in the DOM whether
   * it has been typed or not, so the inner span is always exactly the finished
   * word wide and can be measured directly. The slot's own padding is added
   * back on — miss that and the word is clipped by the padding either side.
   */
  const fit = useCallback(() => {
    const slot = slotRef.current
    const inner = innerRef.current
    if (!slot || !inner) return

    // Measured from a clone with every character inked. The untyped ones are
    // display:none in the live copy so the typed text can sit centred in the
    // opening and grow outward from the middle — which means the live element
    // is never the finished width and cannot be measured directly.
    const probe = inner.cloneNode(true) as HTMLElement
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre'
    probe.querySelectorAll('.rotator__ghost').forEach((ghost) => {
      ghost.classList.remove('rotator__ghost')
    })
    probe.querySelectorAll('.rotator__caret').forEach((caret) => caret.remove())
    slot.appendChild(probe)
    const width = probe.getBoundingClientRect().width
    slot.removeChild(probe)
    if (!width) return

    const style = getComputedStyle(slot)
    const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
    slot.style.width = `${width + padding}px`
  }, [])

  // Measure once the font is actually available, again whenever the word
  // changes, and on resize.
  useEffect(() => {
    let cancelled = false
    const ready = document.fonts?.ready ?? Promise.resolve()
    ready.then(() => {
      if (!cancelled) fit()
    })
    window.addEventListener('resize', fit)
    return () => {
      cancelled = true
      window.removeEventListener('resize', fit)
    }
  }, [fit, step])

  // The run: hold, backspace, recut, type — once through SEQUENCE, then stop.
  // Reduced motion tears the chain down; the render below then shows the last
  // word, which is the first word, so nothing visibly changes.
  useEffect(() => {
    const last = SEQUENCE.length - 1
    if (reduced || stepRef.current >= last) return

    let alive = true
    let timer = 0
    const after = (ms: number, fn: () => void) => {
      timer = window.setTimeout(() => {
        if (alive) fn()
      }, ms)
    }

    const hold = () => after(HOLD_MS, erase)

    const erase = () => {
      setTyping(true)
      let n = SEQUENCE[stepRef.current].length
      const back = () => {
        n -= 1
        setShown(Math.max(n, 0))
        if (n > 0) after(DELETE_MS, back)
        else after(CUT_MS, advance)
      }
      after(DELETE_MS, back)
    }

    // The slot is recut here — setStep re-renders the new word at full width,
    // the measuring effect above picks it up, and the width transition runs
    // while nothing is being typed.
    const advance = () => {
      stepRef.current += 1
      setStep(stepRef.current)
      after(CUT_MS, type)
    }

    const type = () => {
      let n = 0
      const forward = () => {
        n += 1
        setShown(n)
        if (n < SEQUENCE[stepRef.current].length) after(TYPE_MS, forward)
        else {
          setTyping(false)
          if (stepRef.current < last) hold()
        }
      }
      after(TYPE_MS, forward)
    }

    hold()
    return () => {
      alive = false
      window.clearTimeout(timer)
    }
  }, [reduced])

  const visible = reduced ? word.length : shown

  return (
    <div className="rotator">
      <h1 className="rotator__h1">
        <span className="visually-hidden">Software, websites and robotics, built to fit.</span>
        {/*
          The slot gets its own line. On one line with "built to fit" the whole
          line changes width every time the word does, so the tail slid left and
          right on every cut. Alone on a line it grows from its own middle and
          nothing else on the page knows.
        */}
        <span className="rotator__cutline" aria-hidden="true">
          <span ref={slotRef} className="rotator__slot">
            <span ref={innerRef} className="rotator__inner">
              {caret && visible === 0 && <span className="rotator__caret" />}
              {Array.from(word).map((char, i) => (
                <Fragment key={`${step}-${i}`}>
                  <span className={i < visible ? undefined : 'rotator__ghost'}>{char}</span>
                  {caret && i === visible - 1 && <span className="rotator__caret" />}
                </Fragment>
              ))}
            </span>
          </span>
        </span>
      </h1>

      {/*
        The second line, outside the h1 and aria-hidden. The whole sentence,
        full stop included, is in the visually-hidden span above, so the
        heading's accessible name is complete without it.
      */}
      <p className="rotator__tailline">
        <span aria-hidden="true">built to fit.</span>
      </p>
    </div>
  )
}
