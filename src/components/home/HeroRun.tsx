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
import { SEQUENCE, WORDS } from './headlineTimeline'

/**
 * The fold's one timeline, shared.
 *
 * The rotating headline owns the run (headlineTimeline.ts) and reports into
 * this as each word finishes typing; the doors read from it. So the doors have
 * no timers of their own and cannot drift from the words: a door arrives in
 * the same update as its word's last letter, and the doors are finished when
 * the headline is.
 *
 *   - At mount, Software is already on screen, so its door is in and active;
 *     Robotics and Websites wait.
 *   - When a word finishes typing, its door arrives and becomes the active
 *     one — the highlight moves from the last word's door to this one.
 *   - When the run ends, back on Software, every door is in and none is
 *     active. The fold comes to rest.
 *
 * NOTHING IS HIDDEN UNTIL THE CLIENT HAS MOUNTED (`armed`), and never under
 * prefers-reduced-motion. Before hydration, without JavaScript, or if a script
 * fails, every door is simply there — a door must never be invisible because
 * something did not run.
 */

/** waiting: hidden until its word. arriving: coming in, with the entrance.
 *  shown: in, without one (at mount, or because it was focused early). */
export type DoorState = 'waiting' | 'arriving' | 'shown'

interface HeroRunValue {
  armed: boolean
  doors: DoorState[]
  /** Index into WORDS of the highlighted door, or null when none is. */
  active: number | null
  /** Called by the headline when SEQUENCE[step] has finished typing. */
  wordTyped: (step: number) => void
  /** A door that is focused before its turn comes in immediately. */
  arriveNow: (index: number) => void
}

const HeroRunContext = createContext<HeroRunValue | null>(null)

export function useHeroRun() {
  return useContext(HeroRunContext)
}

export function HeroRunProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()
  const [armed, setArmed] = useState(false)
  const [doors, setDoors] = useState<DoorState[]>(() => WORDS.map(() => 'shown'))
  const [active, setActive] = useState<number | null>(null)

  // Arm after mount, a frame later: the same priming the rest of the home page
  // uses, and it keeps the state change out of the effect body (a cascading
  // render, per react-hooks/set-state-in-effect).
  useEffect(() => {
    if (reduced) return
    const frame = requestAnimationFrame(() => {
      setArmed(true)
      setDoors(WORDS.map((_, i) => (i === 0 ? 'shown' : 'waiting')))
      setActive(0)
    })
    return () => cancelAnimationFrame(frame)
  }, [reduced])

  const wordTyped = useCallback((step: number) => {
    if (step >= SEQUENCE.length - 1) {
      // Back on the first word: the run is over. Everything in, nothing lit.
      setDoors((current) => current.map((state) => (state === 'waiting' ? 'arriving' : state)))
      setActive(null)
      return
    }
    setDoors((current) =>
      current.map((state, i) => (i === step && state === 'waiting' ? 'arriving' : state))
    )
    setActive(step)
  }, [])

  const arriveNow = useCallback((index: number) => {
    setDoors((current) =>
      current.map((state, i) => (i === index && state === 'waiting' ? 'shown' : state))
    )
  }, [])

  const value = useMemo(
    () => ({
      armed: armed && !reduced,
      doors,
      active: reduced ? null : active,
      wordTyped,
      arriveNow,
    }),
    [armed, reduced, doors, active, wordTyped, arriveNow]
  )

  return <HeroRunContext.Provider value={value}>{children}</HeroRunContext.Provider>
}
