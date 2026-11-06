'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@hooks'
import { useHeroRun } from './HeroRun'
import { DELETE_MS, HOLD_MS, TYPE_MS, sentenceOf } from './headlineTimeline'

/**
 * The headline performs the thesis.
 *
 * "Software / Robotics / Websites — built to fit", where the leading word
 * (the words are the visible streams, from HeroRun: hide-websites)
 * sits in a cut slot. The slot is cut once, to the width of the widest word,
 * and never changes after that: each word is typed into the same opening,
 * left-aligned on the same baseline, and the shorter ones leave a little of it
 * open on the right. One fixed opening that every word fits is steadier to read
 * than a slot that moves between words, and nothing beside it has to move.
 *
 * The typing convention is the header readout's, deliberately — same site, same
 * machine. Every character has its own span from the first frame and untyped
 * ones are `display: none`, so the typed text grows rightward from the slot's
 * left edge. The caret has zero net width, so it never pushes the text.
 *
 * Three things this has to get right:
 *
 *   1. **The sentence exists in the HTML.** A crawler that does not run
 *      JavaScript — per the SEO notes, most of the AI ones — must still read
 *      "Software, robotics and websites, built to fit." That is the
 *      visually-hidden span; the animated copy is aria-hidden so a screen
 *      reader is not read three words in a row.
 *   2. **The width is measured, not guessed**, once, and only after the webfont
 *      has landed. Measure against the fallback face and the width is wrong by
 *      the time the real font swaps in. It is stored in em, so it follows the
 *      headline's clamp()ed size across viewports without measuring again.
 *   3. **WCAG 2.2.2, by stopping.** It plays once — Software, Robotics,
 *      Websites, Software — and stops on Software inside five seconds, so it
 *      needs no pause control. It must STAY inside five seconds: the budget and
 *      its arithmetic are in headlineTimeline.ts, and a test fails if a fourth
 *      word or a longer hold takes it over. Under prefers-reduced-motion it does
 *      not run at all.
 */
/** Outside the fold's provider there is no stream list; never the case on
 *  the home page, but it keeps the component total. */
const FALLBACK = ['Software']

export default function RotatingHeadline() {
  const slotRef = useRef<HTMLSpanElement>(null)
  const innerRef = useRef<HTMLSpanElement>(null)
  /** The run reads its position from a ref so advancing a word does not tear
   *  down and restart the timer chain that is advancing it. */
  const stepRef = useRef(0)

  const run = useHeroRun()
  const words = run?.words ?? FALLBACK
  const sequence = run?.sequence ?? FALLBACK

  const [step, setStep] = useState(0)
  const [shown, setShown] = useState<number>(sequence[0].length)
  const [typing, setTyping] = useState(false)

  const reduced = useReducedMotion()
  /** The fold's stream cards run off this same timeline
   *  (HeroRun.tsx): each is told the moment its word finishes typing. Stable
   *  identity, so the run below is not restarted by it. Null outside the fold. */
  const wordTyped = run?.wordTyped
  const word = reduced ? sequence[sequence.length - 1] : sequence[step]
  const caret = typing && !reduced

  /**
   * Cut the slot to the widest word, once. Each word is measured from a clone
   * of the inner span, so it is set in the same weight and size as the live
   * text, and the slot's own padding is added back on — miss that and the
   * widest word is clipped by the padding either side. The result is stored in
   * em against the slot's font size, so it scales with the headline across
   * breakpoints and nothing ever has to measure it again.
   */
  useEffect(() => {
    let cancelled = false
    const ready = document.fonts?.ready ?? Promise.resolve()
    ready.then(() => {
      const slot = slotRef.current
      const inner = innerRef.current
      if (cancelled || !slot || !inner) return

      const widest = Math.max(
        ...words.map((candidate) => {
          const probe = inner.cloneNode(false) as HTMLElement
          probe.textContent = candidate
          probe.style.cssText = 'position:absolute;visibility:hidden;white-space:pre'
          slot.appendChild(probe)
          const width = probe.getBoundingClientRect().width
          slot.removeChild(probe)
          return width
        })
      )
      if (!widest) return

      const style = getComputedStyle(slot)
      const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
      const em = parseFloat(style.fontSize)
      slot.style.width = `${(widest + padding) / em}em`
    })
    return () => {
      cancelled = true
    }
  }, [words])

  // The run: hold, backspace, type — once through sequence, then stop.
  // Reduced motion tears the chain down; the render below then shows the last
  // word, which is the first word, so nothing visibly changes.
  useEffect(() => {
    const last = sequence.length - 1
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
      let n = sequence[stepRef.current].length
      const back = () => {
        n -= 1
        setShown(Math.max(n, 0))
        if (n > 0) after(DELETE_MS, back)
        else advance()
      }
      after(DELETE_MS, back)
    }

    // The slot is already the right width for every word, so the next one is
    // set and typed straight away.
    const advance = () => {
      stepRef.current += 1
      setStep(stepRef.current)
      type()
    }

    const type = () => {
      let n = 0
      const forward = () => {
        n += 1
        setShown(n)
        if (n < sequence[stepRef.current].length) after(TYPE_MS, forward)
        else {
          setTyping(false)
          // In the same update as the last letter, so a photo and its word
          // cannot land in different frames.
          wordTyped?.(stepRef.current)
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
  }, [reduced, wordTyped, sequence])

  const visible = reduced ? word.length : shown

  return (
    <div className="rotator">
      <h1 className="rotator__h1">
        <span className="visually-hidden">{sentenceOf(words)}</span>
        {/*
          The slot, then "built to fit." beside it on the same baseline, or
          under it where the column is too narrow (hero-insets; home.scss).
        */}
        <span className="rotator__cutline" aria-hidden="true">
          <span ref={slotRef} className="cut-slot rotator__slot">
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
        The tail, outside the h1 and aria-hidden. The whole sentence,
        full stop included, is in the visually-hidden span above, so the
        heading's accessible name is complete without it.
      */}
      <p className="rotator__tailline">
        <span aria-hidden="true">built to fit.</span>
      </p>
    </div>
  )
}
