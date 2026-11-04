import type { Metadata } from 'next'
import SiteDocument, { SITE_URL } from '@components/layouts/SiteDocument'
import NotFound from './(site)/not-found'

/*
 * A URL that matches no route at all.
 *
 * The app has two root layouts, (site) and (payload), so there is no layout
 * above both for a not-found.tsx to sit under, and Next's default page was what
 * those URLs got: unstyled, no header, no way home. This file is rendered with
 * NO layout (next.config.ts `experimental.globalNotFound`), which is why it
 * brings its own document — the same SiteDocument the site's layout renders,
 * so this is our 404, with the same chrome, not a second design of it.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Page not found · V Source',
  robots: { index: false, follow: false },
}

export default function GlobalNotFound() {
  return (
    <SiteDocument>
      <NotFound />
    </SiteDocument>
  )
}
