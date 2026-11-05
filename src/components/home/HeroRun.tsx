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
 * The fold's one timeline, shared (review-2, then hero-stage, 5 November).
 *
 * The rotating headline owns the run (headlineTimeline.ts) and reports in as
 * each word FINISHES typing; the stage beside it (HeroStage.tsx) reads from
 * here. So nothing in the fold has a timer of its own, and the photograph
 * cannot drift from the word.
 *
 *   - At the server, without JavaScript, and under reduced motion: settled
 *     (`active` null), which is the three stream bands. That is what the fold
 *     looks like at rest, so it is also what it looks like when nothing runs.
 *   - At mount, Software is already on screen, so its big photo.
 *   - Each later word, as its last letter lands: its big photo.
 *   - Back on Software, the end of the run: settled again, for good.
 *
 * The run and the settle are under 4.5 s (headlineTimeline.ts and its test),
 * so the stage moves for less than five seconds and stops: WCAG 2.2.2 needs
 * no control.
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
