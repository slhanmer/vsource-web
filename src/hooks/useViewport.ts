import { useState, useEffect } from 'react'
import { debounceViewport, getCssVarPx } from '@utils'

const desktopBP = getCssVarPx('--breakpoint-desktop')

/**
 * Returns whether the current viewport is "mobile" — either narrower than `breakpoint`
 * or a touch-capable device. Updates on window resize with debouncing.
 *
 * Returns `null` on the server and before the first measurement, so consumers should
 * guard against `null` before conditionally rendering layout.
 *
 * @param breakpoint - Pixel width below which the viewport is mobile.
 *   Defaults to the `--breakpoint-desktop` CSS variable.
 * @param debounceDelay - Resize event debounce delay in ms (default: 20)
 * @returns `true` = mobile/touch, `false` = desktop, `null` = not yet measured
 *
 * @example
 * const isMobile = useViewport()
 * if (isMobile) return <MobileLayout />
 */
export const useViewport = (breakpoint = desktopBP, debounceDelay = 20) => {
  const [isMobile, setIsMobile] = useState<boolean | null>(() => {
    if (typeof window === 'undefined') return null
    return window.innerWidth < breakpoint || 'ontouchstart' in window
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const checkViewport = () => {
      setIsMobile(window.innerWidth < breakpoint || 'ontouchstart' in window)
    }
    const handleResize = debounceViewport(checkViewport, debounceDelay)
    checkViewport()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [breakpoint, debounceDelay])

  return isMobile
}
