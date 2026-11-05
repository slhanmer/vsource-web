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
import { sequenceOf } from './headlineTimeline'

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
  /** The visible streams' names, in order: the headline's words and the
   *  stage's photos (hide-websites). */
  words: string[]
  /** The words as played: all of them, then the first again. */
  sequence: string[]
  /** Index into `words` of the word on screen while the run plays; null at rest. */
  active: number | null
  /** Called by the headline when sequence[step] has finished typing. */
  wordTyped: (step: number) => void
}

const HeroRunContext = createContext<HeroRunValue | null>(null)

export function useHeroRun() {
  return useContext(HeroRunContext)
}

export function HeroRunProvider({ words, children }: { words: string[]; children: ReactNode }) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)
  const sequence = useMemo(() => sequenceOf(words), [words])
  // One stream is nothing to run through: the fold just shows it settled.
  const runs = words.length > 1

  // Start on the first word a frame after mount — the same priming the rest
  // of the home page uses, and it keeps the state change out of the effect body.
  useEffect(() => {
    if (reduced || !runs) return
    const frame = requestAnimationFrame(() => setActive(0))
    return () => cancelAnimationFrame(frame)
  }, [reduced, runs])

  const last = sequence.length - 1
  const wordTyped = useCallback(
    (step: number) => {
      // Back on the first word: the run is over, and the fold settles.
      setActive(step >= last ? null : step)
    },
    [last]
  )

  const value = useMemo(
    () => ({ words, sequence, active: reduced || !runs ? null : active, wordTyped }),
    [words, sequence, reduced, runs, active, wordTyped]
  )

  return <HeroRunContext.Provider value={value}>{children}</HeroRunContext.Provider>
}
