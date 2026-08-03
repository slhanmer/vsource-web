import { useEffect } from 'react'

/**
 * Locks the page scroll when `preventScroll` is `true` and restores it when `false`.
 * Uses the `position: fixed` technique to prevent the page from jumping to the top
 * while the body is locked — the current scroll position is saved and restored.
 *
 * Use this in modal/drawer components to prevent background scroll.
 *
 * @param preventScroll - When `true`, locks the page scroll; when `false`, restores it.
 *
 * @example
 * usePreventScroll(isModalOpen)
 */
export const usePreventScroll = (preventScroll: boolean) => {
  useEffect(() => {
    if (preventScroll) {
      // Save the current scroll position
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      const scrollY = document.body.style.top
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      // Restore scroll position
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [preventScroll])
}
