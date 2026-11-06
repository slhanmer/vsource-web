'use client'

import { useEffect } from 'react'
import { ToastProvider } from '@/components/ui-kit/Toast'
import { recordVisitOrigin } from '@/utils/visitOrigin'
import '@configs/fontawesome'

/** Client provider tree. Deliberately thin — nothing to fetch before paint. */
export function Providers({ children }: { children: React.ReactNode }) {
  // Wraps every page, so whichever one the visitor lands on gets recorded.
  useEffect(() => {
    recordVisitOrigin()
  }, [])

  // The header sits outside #main, the only scroller, so a wheel over it
  // scrolled nothing and the page felt stuck. Hand those wheels to #main.
  useEffect(() => {
    const header = document.querySelector<HTMLElement>('.site-header')
    const main = document.getElementById('main')
    if (!header || !main) return

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return
      // Firefox reports lines, not pixels.
      const step = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? main.clientHeight : 1
      main.scrollBy({ top: event.deltaY * step, left: 0, behavior: 'instant' })
    }

    header.addEventListener('wheel', onWheel, { passive: true })
    return () => header.removeEventListener('wheel', onWheel)
  }, [])

  return <ToastProvider>{children}</ToastProvider>
}
