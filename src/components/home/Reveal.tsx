'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Marks a section as "on screen" once, so the CSS can bring its contents in.
 *
 * The children stay server components — they are passed through as a prop, not
 * rendered by this file — so this costs one small client boundary per section
 * and nothing else ships to the browser.
 *
 * Two things worth keeping:
 *
 *   1. It renders revealed and only hides itself after mount. Without that, a
 *      visitor with JavaScript off — or a crawler that does not run it, which
 *      per the SEO notes is most of the AI ones — gets a page of invisible
 *      text. That is the classic way a reveal effect quietly destroys a site's
 *      content, and it is invisible in testing because your browser runs JS.
 *   2. It unobserves after the first hit. These are one-way reveals; leaving
 *      the observer attached keeps firing on every scroll past.
 *
 * prefers-reduced-motion is handled in CSS, because the transition is the thing
 * being suppressed, not the class.
 */
interface Props {
  children: ReactNode
  className?: string
  id?: string
  as?: 'section' | 'div'
  /** Fires the reveal a little before the section reaches the fold. */
  rootMargin?: string
  'aria-labelledby'?: string
}

export default function Reveal({
  children,
  className = '',
  id,
  as = 'section',
  rootMargin = '0px 0px -12% 0px',
  ...rest
}: Props) {
  const node = useRef<HTMLElement | null>(null)
  // A callback ref rather than useRef in the ref slot: it is assignable to both
  // the section and the div element types without a cast, and it fires on mount
  // so there is no window where the effect runs against a null.
  const setNode = useCallback((element: HTMLElement | null) => {
    node.current = element
  }, [])

  const [armed, setArmed] = useState(false)
  const [seen, setSeen] = useState(true)

  useEffect(() => {
    const element = node.current
    if (!element || typeof IntersectionObserver === 'undefined') return

    setArmed(true)

    // Anything already on screen at mount should never fade in — that reads as
    // a glitch rather than an entrance.
    const box = element.getBoundingClientRect()
    if (box.top < window.innerHeight && box.bottom > 0) {
      setSeen(true)
      return
    }

    setSeen(false)

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          setSeen(true)
          io.unobserve(entry.target)
        })
      },
      { rootMargin }
    )

    io.observe(element)
    return () => io.disconnect()
  }, [rootMargin])

  const state = !armed || seen ? 'is-in' : 'is-out'
  const props = {
    id,
    ref: setNode,
    className: `${className} ${state}`.trim(),
    ...rest,
  }

  return as === 'div' ? <div {...props}>{children}</div> : <section {...props}>{children}</section>
}
