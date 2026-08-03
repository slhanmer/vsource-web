'use client'

import { useCallback, useEffect, useState, type RefObject } from 'react'

type ScrollAffordanceOptions = {
  /** Px tolerance before an edge counts as reached. Default: 1. */
  threshold?: number
  /** Skip all measurement (e.g. consumer opted out). Default: true. */
  enabled?: boolean
}

export type ScrollAffordance = {
  fadeTop: boolean
  fadeBottom: boolean
  /** Force a re-measure after an imperative content change. */
  recalculate: () => void
}

/**
 * Reports whether a scroll container should fade its top/bottom edges.
 *
 * Only reports true when the platform draws NO scrollbar gutter — overlay
 * scrollbars (mobile, and desktop trackpad-only setups) stay hidden until
 * touched, so nothing signals that content continues past the fold. Where a
 * classic scrollbar occupies layout space, it is already doing that job and a
 * fade would be redundant.
 */
export function useScrollAffordance(
  ref: RefObject<HTMLElement | null>,
  { threshold = 1, enabled = true }: ScrollAffordanceOptions = {}
): ScrollAffordance {
  const [fadeTop, setFadeTop] = useState(false)
  const [fadeBottom, setFadeBottom] = useState(false)

  const measure = useCallback(() => {
    const el = ref.current

    if (!el || !enabled) {
      setFadeTop(false)
      setFadeBottom(false)
      return
    }

    const { scrollTop, scrollHeight, clientHeight, offsetWidth, clientWidth } = el

    // 1. No overflow → nothing to afford, and no scrollbar either way.
    if (scrollHeight - clientHeight <= threshold) {
      setFadeTop(false)
      setFadeBottom(false)
      return
    }

    // 2. A gutter means a classic scrollbar is already showing the overflow.
    //    Only meaningful once we know the element overflows (step 1).
    const hasScrollbarGutter = offsetWidth - clientWidth > 0
    if (hasScrollbarGutter) {
      setFadeTop(false)
      setFadeBottom(false)
      return
    }

    // 3. Overlay scrollbars: fade whichever end has content beyond it.
    setFadeTop(scrollTop > threshold)
    setFadeBottom(scrollTop + clientHeight < scrollHeight - threshold)
  }, [ref, threshold, enabled])

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) {
      setFadeTop(false)
      setFadeBottom(false)
      return
    }

    measure()

    el.addEventListener('scroll', measure, { passive: true })

    // Observes the scroller (viewport height, and gutter appearing/vanishing)
    // and its children (content height) — covers rows added, removed, or resized.
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    for (const child of Array.from(el.children)) {
      observer.observe(child)
    }

    return () => {
      el.removeEventListener('scroll', measure)
      observer.disconnect()
    }
  }, [ref, measure, enabled])

  return { fadeTop, fadeBottom, recalculate: measure }
}
