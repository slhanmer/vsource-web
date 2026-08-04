import type { MetadataRoute } from 'next'

const BASE = 'https://www.vsource.dev'

/**
 * Five static routes. `lastModified` is stamped at build, which is honest for a
 * site that only changes when it is redeployed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    { url: `${BASE}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${BASE}/services`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/work`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/crew`, lastModified, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${BASE}/contact`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
  ]
}
