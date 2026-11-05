'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useReducedMotion } from '@hooks'
import { SEQUENCE } from './headlineTimeline'

/**
 * The fold's one timeline, shared (review-2, 5 November).
 *
 * The rotating headline owns the run (headlineTimeline.ts) and reports in as
 * each word FINISHES typing; the photo frame and the stream links beside it
 * read from here. So nothing in the fold has a timer of its own, and the
 * photograph cannot drift from the word.
 *
 *   - At the server, without JavaScript, and under reduced motion: `settled`,
 *     which is the team photograph and no link lit. That is what the fold
 *     looks like at rest, so it is also what it looks like when nothing runs.
 *   - At mount, Software is already on screen, so its photo and its link.
 *   - Each later word, as its last letter lands: its photo and its link.
 *   - Back on Software, the end of the run: `settled` again, for good.
 *
 * The run is under 4.5 s (headlineTimeline.ts and its test), so the photos
 * change for less than five seconds and stop: WCAG 2.2.2 needs no control.
 */

interface HeroRunValue {
  /** Index into WORDS of the word on screen while the run plays; null at rest. */
  active: number | null
  /** Called by the headline when SEQUENCE[step] has finished typing. */
  wordTyped: (step: number) => void
}

const HeroRunContext = createContext<HeroRunValue | null>(null)

export function useHeroRun() {
  return useContext(HeroRunContext)
}

export function HeroRunProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)

  // Start on Software a frame after mount — the same priming the rest of the
  // home page uses, and it keeps the state change out of the effect body.
  useEffect(() => {
    if (reduced) return
    const frame = requestAnimationFrame(() => setActive(0))
    return () => cancelAnimationFrame(frame)
  }, [reduced])

  const wordTyped = useCallback((step: number) => {
    // Back on the first word: the run is over, and the fold settles.
    setActive(step >= SEQUENCE.length - 1 ? null : step)
  }, [])

  const value = useMemo(
    () => ({ active: reduced ? null : active, wordTyped }),
    [reduced, active, wordTyped]
  )

  return <HeroRunContext.Provider value={value}>{children}</HeroRunContext.Provider>
}
