import type { MetadataRoute } from 'next'
import { LANDINGS } from '@constants'
import { getProjects, getStreams } from '@/data'

const BASE = 'https://www.vsource.dev'

/**
 * Generated from the same data the pages are, so adding a stream, a landing
 * page or a project puts it in the sitemap without anyone remembering to. A
 * hand-maintained list of ten routes is a hand-maintained list that is wrong
 * within a month.
 *
 * Streams and projects come from Payload through the same cached getters the
 * pages use, so publishing a project in the admin puts it here too (the save
 * clears the `content` tag this is rendered under). `lastModified` is stamped
 * when it is rendered.
 *
 * Renamed routes are deliberately absent. /services, /crew and /work all 301
 * now (see next.config.ts), and a sitemap that advertises a redirect is telling
 * a crawler to take the long way round on purpose.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()
  const [streams, projects] = await Promise.all([getStreams(), getProjects()])

  return [
    { url: `${BASE}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    ...streams.map((stream) => ({
      url: `${BASE}${stream.href}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    ...LANDINGS.map((landing) => ({
      url: `${BASE}/${landing.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    })),
    { url: `${BASE}/built`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    ...projects.map((project) => ({
      url: `${BASE}/built/${project.slug}`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
    { url: `${BASE}/team`, lastModified, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
  ]
}
