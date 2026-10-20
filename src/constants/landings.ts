import type { Stream, StreamSection } from './streams'

/**
 * The search landing pages — /regulated and /accessibility.
 *
 * Each of these used to be one section inside a stream page, which is exactly
 * why neither ranked for anything: a bullet list on /software does not compete
 * for "IEC 62304". They are now pages of their own, and the stream sections
 * they grew out of are cut down to a summary and a link, so the two do not
 * compete with each other for the same result.
 *
 * One template (components/landing/Landing.tsx) renders all of them, the same
 * way app/[stream]/ renders the three streams. Adding a third landing page is a
 * data change here plus a two-line route file, not a new page.
 */
export interface Landing {
  /** Route slug, without the leading slash. */
  slug: string
  /** The h1. A claim, not a label. */
  title: string
  /** Browser/SERP title. */
  metaTitle: string
  metaDescription: string
  /** The paragraph under the h1. */
  lede: string
  sections: StreamSection[]
  /** Which stream page this belongs under, for the back-link and the CTA. */
  stream: Stream['id']
  /** Unverified copy. Renders a visible marker, same as everywhere else. */
  pending?: boolean
}

export const LANDINGS: Landing[] = []
