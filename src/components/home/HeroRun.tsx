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
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { sequenceOf } from './headlineTimeline'

/**
 * The fold's one timeline, shared (review-2, then hero-stage; hero-cards, 6
 * November).
 *
 * The rotating headline owns the run (headlineTimeline.ts) and reports in as
 * each word FINISHES typing; the stream cards beside it (HeroStage.tsx) read
 * from here. So nothing in the fold has a timer of its own, and a card's rim
 * cannot drift from its word.
 *
 *   - At the server, without JavaScript, and under reduced motion: no card is
 *     current (`current` null). The cards stand as they are; nothing moves.
 *   - At mount, Software is already on screen, so its card.
 *   - Each later word, as its last letter lands: its card.
 *   - Back on Software, the end of the run: Software's card, and it stays.
 *
 * The run is under 4.5 s (headlineTimeline.ts and its test), so the fold
 * moves for less than five seconds and stops: WCAG 2.2.2 needs no control.
 */

interface HeroRunValue {
  /** The visible streams' names, in order: the headline's words and the
   *  stage's cards (hide-websites). */
  words: string[]
  /** The words as played: all of them, then the first again. */
  sequence: string[]
  /** Index into `words` of the last word typed, which is the current card;
   *  null when nothing runs (server, no JS, reduced motion). */
  current: number | null
  /** Called by the headline when sequence[step] has finished typing. */
  wordTyped: (step: number) => void
}

const HeroRunContext = createContext<HeroRunValue | null>(null)

export function useHeroRun() {
  return useContext(HeroRunContext)
}

export function HeroRunProvider({ words, children }: { words: string[]; children: ReactNode }) {
  const reduced = useReducedMotion()
  const [current, setCurrent] = useState<number | null>(null)
  const sequence = useMemo(() => sequenceOf(words), [words])
  // One stream is nothing to run through: the fold just shows it settled.
  const runs = words.length > 1

  // Start on the first word a frame after mount — the same priming the rest
  // of the home page uses, and it keeps the state change out of the effect body.
  useEffect(() => {
    if (reduced || !runs) return
    const frame = requestAnimationFrame(() => setCurrent(0))
    return () => cancelAnimationFrame(frame)
  }, [reduced, runs])

  const last = sequence.length - 1
  const wordTyped = useCallback(
    (step: number) => {
      // Back on the first word: the run is over, and Software stays current.
      setCurrent(step >= last ? 0 : step)
    },
    [last]
  )

  const value = useMemo(
    () => ({ words, sequence, current: reduced || !runs ? null : current, wordTyped }),
    [words, sequence, reduced, runs, current, wordTyped]
  )

  return <HeroRunContext.Provider value={value}>{children}</HeroRunContext.Provider>
}
