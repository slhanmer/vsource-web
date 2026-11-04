'use client'

import { useEffect } from 'react'
import { ToastProvider } from '@components'
import { recordVisitOrigin } from '@utils'
import '@configs/fontawesome'

/** Client provider tree. Deliberately thin — nothing to fetch before paint. */
export function Providers({ children }: { children: React.ReactNode }) {
  // Wraps every page, so whichever one the visitor lands on gets recorded.
  useEffect(() => {
    recordVisitOrigin()
  }, [])

  return <ToastProvider>{children}</ToastProvider>
}
