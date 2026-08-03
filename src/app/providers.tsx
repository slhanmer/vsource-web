'use client'

import { ToastProvider } from '@components'

/**
 * Client-side provider tree for the marketing site.
 *
 * Deliberately thin. The portal wraps its tree in TenantProvider (runtime
 * per-tenant theming) and TicketProvider (support widget); neither applies to a
 * single-brand marketing site, so the palette comes straight from the `:root`
 * block in `global.scss` and there is nothing to fetch before first paint.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>
}
