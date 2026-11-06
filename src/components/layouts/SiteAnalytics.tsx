import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

/**
 * Same rule as the starter: only the live site is measured. VERCEL_ENV is
 * `production` on production deployments only — not previews, dev or CI —
 * so no script loads anywhere else.
 */
export default function SiteAnalytics() {
  if (process.env.VERCEL_ENV !== 'production') return null
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
