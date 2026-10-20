import type { MetadataRoute } from 'next'
import { BUILT, STREAMS } from '@constants'

const BASE = 'https://www.vsource.dev'

/**
 * Generated from the same data the pages are, so adding a stream or a project
 * puts it in the sitemap without anyone remembering to. A hand-maintained list
 * of ten routes is a hand-maintained list that is wrong within a month.
 *
 * `lastModified` is stamped at build, which is honest for a site that only
 * changes when it is redeployed.
 *
 * Renamed routes are deliberately absent. /services, /crew and /work all 301
 * now (see next.config.ts), and a sitemap that advertises a redirect is telling
 * a crawler to take the long way round on purpose.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    { url: `${BASE}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    ...STREAMS.map((stream) => ({
      url: `${BASE}${stream.href}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    { url: `${BASE}/built`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    ...BUILT.map((project) => ({
      url: `${BASE}/built/${project.slug}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    { url: `${BASE}/team`, lastModified, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
  ]
}
