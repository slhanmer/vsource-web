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
 * The fold's one timeline, shared.
 *
 * The rotating headline owns the run (headlineTimeline.ts) and reports into
 * this as each word finishes typing; the doors read from it. So the highlight
 * has no timers of its own and cannot drift from the words.
 *
 *   - At mount, Software is on screen, so its door is the active one.
 *   - When a word finishes typing, its door becomes the active one — the teal
 *     edge moves from the last word's door to this one.
 *   - When the run ends, back on Software, no door is active. The fold comes
 *     to rest.
 *
 * THE DOORS NEVER MOVE. They are all there from the first paint and never
 * fade or rise in (hero-polish, 5 November: the entrance with the words did
 * not work). Only the highlight follows the word: it ties word to card
 * without moving anything. Never under prefers-reduced-motion, and nothing
 * happens before the client has mounted.
 */

interface HeroRunValue {
  /** Index into WORDS of the highlighted door, or null when none is. */
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

  // Light the first door a frame after mount: the same priming the rest of the
  // home page uses, and it keeps the state change out of the effect body (a
  // cascading render, per react-hooks/set-state-in-effect).
  useEffect(() => {
    if (reduced) return
    const frame = requestAnimationFrame(() => setActive(0))
    return () => cancelAnimationFrame(frame)
  }, [reduced])

  const wordTyped = useCallback((step: number) => {
    // Back on the first word: the run is over, and nothing is lit.
    setActive(step >= SEQUENCE.length - 1 ? null : step)
  }, [])

  const value = useMemo(
    () => ({ active: reduced ? null : active, wordTyped }),
    [reduced, active, wordTyped]
  )

  return <HeroRunContext.Provider value={value}>{children}</HeroRunContext.Provider>
}
