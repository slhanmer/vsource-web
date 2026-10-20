'use client'

import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

/**
 * The headline performs the thesis.
 *
 * "Software / Websites / Engineering — built to fit", where the leading word
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
 *      "Software, websites and engineering, built to fit." That is the
 *      visually-hidden span; the animated copy is aria-hidden so a screen
 *      reader is not read three words on a loop.
 *   2. **Widths are measured, not guessed**, and only once the webfont has
 *      landed. Measure against the fallback face and every width is wrong by
 *      the time the real font swaps in.
 *   3. **WCAG 2.2.2.** This auto-starts and loops for longer than five seconds,
 *      so it needs a real pause control. It also pauses on hover and focus, and
 *      does not run at all under prefers-reduced-motion. The control is a knob
 *      at the end of the headline with no visible label — the name is on
 *      aria-label, which is what gets announced either way. It cannot simply be
 *      dropped: without it the animation fails 2.2.2 outright.
 */

const WORDS = ['Software', 'Websites', 'Engineering'] as const

/** Milliseconds per character typed. Slower than the readout's 16ms — at
 *  headline size, readout speed reads as a flicker rather than as typing. */
const TYPE_MS = 58
/** Backspacing is quicker than typing, as it is on a real keyboard. */
const DELETE_MS = 26
/** The beat where the slot is being recut and nothing is being written. */
const CUT_MS = 260
/** How long a finished word stays up. */
const HOLD_MS = 2600

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)'

let mql: MediaQueryList | null = null
const media = () => (mql ??= window.matchMedia(REDUCED_QUERY))
const subscribeReduced = (onChange: () => void) => {
  const query = media()
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
const readReduced = () => media().matches
const readReducedServer = () => false

export default function RotatingHeadline() {
  const slotRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  /** The cycle reads the index from a ref so advancing a word does not tear
   *  down and restart the timer chain that is advancing it. */
  const indexRef = useRef(0)

  const [index, setIndex] = useState(0)
  const [shown, setShown] = useState(WORDS[0].length)
  const [typing, setTyping] = useState(false)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)

  const reduced = useSyncExternalStore(subscribeReduced, readReduced, readReducedServer)
  const word = WORDS[index]

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
  }, [fit, index])

  // The cycle: hold, backspace, recut, type, repeat. Any of paused, hovered or
  // reduced tears the chain down rather than letting it run and discarding
  // ticks — a timer that fires into a paused component is how these drift.
  useEffect(() => {
    if (reduced) {
      setShown(WORDS[indexRef.current].length)
      setTyping(false)
      return
    }
    if (paused || hovered) return

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
      let n = WORDS[indexRef.current].length
      const back = () => {
        n -= 1
        setShown(Math.max(n, 0))
        if (n > 0) after(DELETE_MS, back)
        else after(CUT_MS, advance)
      }
      after(DELETE_MS, back)
    }

    // The slot is recut here — setIndex re-renders the new word at full width,
    // the measuring effect above picks it up, and the width transition runs
    // while nothing is being typed.
    const advance = () => {
      indexRef.current = (indexRef.current + 1) % WORDS.length
      setIndex(indexRef.current)
      after(CUT_MS, type)
    }

    const type = () => {
      let n = 0
      const forward = () => {
        n += 1
        setShown(n)
        if (n < WORDS[indexRef.current].length) after(TYPE_MS, forward)
        else {
          setTyping(false)
          hold()
        }
      }
      after(TYPE_MS, forward)
    }

    hold()
    return () => {
      alive = false
      window.clearTimeout(timer)
    }
  }, [reduced, paused, hovered])

  const visible = reduced ? word.length : shown

  return (
    <div
      className="rotator"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <h1 className="rotator__h1">
        <span className="visually-hidden">Software, websites and engineering, built to fit.</span>
        {/*
          The slot gets its own line. On one line with "built to fit" the whole
          line changes width every time the word does, so the tail slid left and
          right on every cut. Alone on a line it grows from its own middle and
          nothing else on the page knows.
        */}
        <span className="rotator__cutline" aria-hidden="true">
          <span ref={slotRef} className="rotator__slot">
            <span ref={innerRef} className="rotator__inner">
              {typing && visible === 0 && <span className="rotator__caret" />}
              {Array.from(word).map((char, i) => (
                <Fragment key={`${word}-${i}`}>
                  <span className={i < visible ? undefined : 'rotator__ghost'}>{char}</span>
                  {typing && i === visible - 1 && <span className="rotator__caret" />}
                </Fragment>
              ))}
            </span>
          </span>
        </span>
      </h1>

      {/*
        The second line, outside the h1 on purpose. The pause control sits in it
        where the full stop would be, and a <button> inside an <h1> would put
        its label into the heading's accessible name. The whole sentence is in
        the visually-hidden span above, so the heading still reads correctly.

        Under reduced motion nothing animates, so there is no control — and the
        sentence takes its full stop back rather than ending on a bare "fit".
      */}
      <p className="rotator__tailline">
        <span aria-hidden="true">built to fit{reduced ? '.' : ''}</span>
        {!reduced && (
          <button
            type="button"
            className="rotator__pause"
            aria-pressed={paused}
            aria-label={paused ? 'Resume the rotating words' : 'Pause the rotating words'}
            onClick={() => setPaused((value) => !value)}
          >
            <span className="rotator__icon" aria-hidden="true" />
          </button>
        )}
      </p>
    </div>
  )
}
