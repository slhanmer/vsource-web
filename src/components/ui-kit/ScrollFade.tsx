'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type UIEvent,
} from 'react'

import './styles/scrollFade.scss'

export type ScrollFadeProps = {
  children: ReactNode
  /** Which edges may fade. Default: both. */
  edges?: 'top' | 'bottom' | 'both'
  /** Fade depth in px. Default: 32. */
  size?: number
  /** Px tolerance before an edge counts as reached. Default: 1. */
  threshold?: number
  className?: string
  onScroll?: (e: UIEvent<HTMLDivElement>) => void
}

export type ScrollFadeHandle = {
  /** The underlying scroll container. */
  getScrollElement: () => HTMLDivElement | null
  /** Force a re-measure (e.g. after an imperative content swap). */
  recalculate: () => void
}

export const ScrollFade = forwardRef<ScrollFadeHandle, ScrollFadeProps>(function ScrollFade(
  { children, edges = 'both', size = 32, threshold = 1, className = '', onScroll },
  ref
) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const [fadeTop, setFadeTop] = useState(false)
  const [fadeBottom, setFadeBottom] = useState(false)

  const measure = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const { scrollTop, scrollHeight, clientHeight } = el
    const overflows = scrollHeight - clientHeight > threshold

    if (!overflows) {
      setFadeTop(false)
      setFadeBottom(false)
      return
    }

    const atTop = scrollTop <= threshold
    const atBottom = scrollTop + clientHeight >= scrollHeight - threshold

    setFadeTop(edges !== 'bottom' && !atTop)
    setFadeBottom(edges !== 'top' && !atBottom)
  }, [edges, threshold])

  useImperativeHandle(
    ref,
    () => ({
      getScrollElement: () => scrollRef.current,
      recalculate: measure,
    }),
    [measure]
  )

  // Measure on mount, and whenever the container or its content resizes.
  useEffect(() => {
    const scrollEl = scrollRef.current
    const contentEl = contentRef.current
    if (!scrollEl || !contentEl) return

    measure()

    const observer = new ResizeObserver(measure)
    observer.observe(scrollEl)
    observer.observe(contentEl)

    return () => observer.disconnect()
  }, [measure])

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    measure()
    onScroll?.(e)
  }

  const classes = [
    'scroll-fade',
    fadeTop ? 'fade-top' : '',
    fadeBottom ? 'fade-bottom' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      ref={scrollRef}
      className={classes}
      onScroll={handleScroll}
      style={{ '--scroll-fade-size': `${size}px` } as React.CSSProperties}
    >
      <div ref={contentRef} className="scroll-fade__content">
        {children}
      </div>
    </div>
  )
})
