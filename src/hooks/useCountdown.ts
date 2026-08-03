import { useEffect, useState, useRef } from 'react'

/**
 * A countdown timer that ticks down from a given number of seconds to zero.
 * Does not start automatically — call `startCountdown()` to begin.
 *
 * @param initialSeconds - Default starting value used by `resetCountdown()`
 * @returns `{ countdown, isCountdownExpired, startCountdown, resetCountdown }`
 *   - `countdown` — current seconds remaining
 *   - `isCountdownExpired` — `true` when `countdown === 0`
 *   - `startCountdown(n?)` — start the timer from `n` seconds (or `initialSeconds` if omitted)
 *   - `resetCountdown()` — restart from `initialSeconds`
 *
 * @example
 * const { countdown, isCountdownExpired, startCountdown } = useCountdown(30)
 * // Start when a modal opens:
 * useEffect(() => { startCountdown() }, [isModalOpen])
 */
export function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (seconds <= 0 && timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [seconds])

  const start = (newSeconds: number = initialSeconds) => {
    if (timerRef.current) clearInterval(timerRef.current)
    setSeconds(newSeconds)

    timerRef.current = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
  }

  const reset = () => start(initialSeconds)

  return {
    countdown: seconds,
    isCountdownExpired: seconds === 0,
    startCountdown: start,
    resetCountdown: reset,
  }
}
