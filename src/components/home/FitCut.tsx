'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'

/**
 * The argument, acted out.
 *
 * A shape — your business, as it actually is — sits alone. A plate slides over
 * it carrying a generic rectangular opening; most of the shape disappears
 * behind the plate, a dashed outline shows what was lost, and the corners of
 * the opening you do not fill are hatched, because that is platform you pay for
 * and never touch. Then the opening is recut to the shape's exact profile and
 * the whole thing is visible, flush, with light in the kerf.
 *
 * It is a plate with a cut-out, which is the deboss language the rest of the
 * site already speaks. The first version of this was a stick figure ducking
 * under a slab and it looked like clip art.
 *
 * Four things that matter:
 *
 *   1. **It plays once and rests on the final frame.** An earlier version
 *      looped, which meant most visitors arrived mid-story and saw a shape
 *      being covered up with no idea why.
 *   2. **The morph is CSS `d`.** The two paths carry exactly twelve points in
 *      the same winding order, so the browser interpolates between them cleanly
 *      — mismatched command counts and it hard-swaps instead. The static `d`
 *      attribute is the finished state, so a browser without CSS `d` support
 *      shows the outcome rather than nothing.
 *   3. **Ids are scoped with useId.** Gradients, masks and patterns live in a
 *      document-wide namespace; a second instance sharing ids would resolve its
 *      `url(#…)` into the first one's defs.
 *   4. **Colour lives in CSS classes, never in attributes**, so it follows the
 *      theme.
 */

/** Your business. Twelve points. Must stay in sync with the SCSS keyframes. */
const SHAPE =
  'M170 140 L250 140 L250 110 L330 110 L330 175 L390 175 L390 250 L340 250 L340 290 L230 290 L230 245 L170 245 Z'

export default function FitCut() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const ref = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)

  // Play once, on entry. No loop, and no replay unless the visitor asks.
  useEffect(() => {
    const node = ref.current
    if (!node || typeof IntersectionObserver === 'undefined') return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          setPlaying(true)
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.35 }
    )

    io.observe(node)
    return () => io.disconnect()
  }, [])

  // Restart by dropping the class, forcing a reflow, then putting it back —
  // without the reflow the browser coalesces both changes and nothing replays.
  const replay = useCallback(() => {
    const node = ref.current
    if (!node) return
    node.classList.remove('is-playing')
    void node.offsetWidth
    node.classList.add('is-playing')
  }, [])

  const gradForm = `fc-form-${uid}`
  const gradPlate = `fc-plate-${uid}`
  const hatch = `fc-hatch-${uid}`
  const maskHole = `fc-hole-${uid}`
  const maskNotForm = `fc-notform-${uid}`
  const glow = `fc-glow-${uid}`

  return (
    <div ref={ref} className={`fitcut ${playing ? 'is-playing' : ''}`.trim()}>
      <svg
        className="fitcut__svg"
        viewBox="20 42 520 316"
        role="img"
        aria-label="A shape representing a business. A plate with a generic rectangular opening slides over it and hides most of it. The opening is then recut to the shape's exact outline, and the whole shape is visible."
      >
        <defs>
          <linearGradient id={gradForm} x1="0" y1="0" x2="1" y2="1">
            <stop className="fitcut__form-a" offset="0" />
            <stop className="fitcut__form-b" offset="1" />
          </linearGradient>
          <linearGradient id={gradPlate} x1="0" y1="0" x2="0" y2="1">
            <stop className="fitcut__plate-a" offset="0" />
            <stop className="fitcut__plate-b" offset="1" />
          </linearGradient>
          <filter id={glow} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" result="blurred" />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <pattern
            id={hatch}
            width="9"
            height="9"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <rect className="fitcut__hatch-bg" width="9" height="9" />
            <line className="fitcut__hatch-line" x1="0" y1="0" x2="0" y2="9" strokeWidth="2.5" />
          </pattern>
          {/* The hatch belongs only where the opening is NOT your business. */}
          <mask id={maskNotForm}>
            <rect x="0" y="0" width="560" height="400" fill="#fff" />
            <path d={SHAPE} fill="#000" />
          </mask>
          <mask id={maskHole}>
            <rect x="0" y="0" width="560" height="400" fill="#fff" />
            <path className="fitcut__slot" d={SHAPE} fill="#000" />
          </mask>
        </defs>

        {/* The opening is a recess, not a hole: it needs a floor. */}
        <path
          className="fitcut__well fitcut__slot"
          d={SHAPE}
          fill={`url(#${hatch})`}
          mask={`url(#${maskNotForm})`}
        />

        {/* Your business, whole, underneath everything. */}
        <g className="fitcut__form">
          <path className="fitcut__form-fill" d={SHAPE} fill={`url(#${gradForm})`} />
          <path
            className="fitcut__form-edge"
            d={SHAPE}
            fill="none"
            stroke={`url(#${gradForm})`}
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>

        <g className="fitcut__plate">
          <g mask={`url(#${maskHole})`}>
            <rect
              className="fitcut__plate-face"
              x="40"
              y="62"
              width="480"
              height="276"
              rx="3"
              fill={`url(#${gradPlate})`}
            />
            <rect
              className="fitcut__plate-edge"
              x="40"
              y="62"
              width="480"
              height="276"
              rx="3"
              fill="none"
            />
            <line
              className="fitcut__plate-lip"
              x1="41"
              y1="63.5"
              x2="519"
              y2="63.5"
              strokeWidth="1.5"
            />
            <text className="fitcut__label fitcut__label--a" x="62" y="92">
              OFF THE SHELF
            </text>
            <text className="fitcut__label fitcut__label--b" x="62" y="92">
              BUILT TO FIT
            </text>
          </g>

          {/* What the generic opening leaves out. */}
          <path
            className="fitcut__ghost"
            d={SHAPE}
            fill="none"
            strokeWidth="1.4"
            strokeDasharray="5 5"
            strokeLinejoin="round"
          />
          {/* The cut edge, lit, once the opening has been recut. */}
          <path
            className="fitcut__kerf fitcut__slot"
            d={SHAPE}
            fill="none"
            strokeWidth="2.2"
            strokeLinejoin="round"
            filter={`url(#${glow})`}
          />
          <path
            className="fitcut__slotline fitcut__slot"
            d={SHAPE}
            fill="none"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </g>
      </svg>

      <div className="fitcut__captions">
        <p className="fitcut__caption fitcut__caption--1">Your business, as it actually works.</p>
        <p className="fitcut__caption fitcut__caption--2">
          Off-the-shelf covers most of it. The dashed line is everything it does not.
        </p>
        <p className="fitcut__caption fitcut__caption--3">
          We cut the opening <em>to fit</em>.
        </p>
        <button type="button" className="fitcut__replay" onClick={replay}>
          Replay
        </button>
      </div>
    </div>
  )
}
