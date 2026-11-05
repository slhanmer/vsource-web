import type { SeedCrew, SeedPartner, SeedProject, SeedStream } from './types'

/*
 * Pure helpers for run.ts: seed content → Payload document data, and the
 * comparison that makes a second seed run write nothing.
 *
 * Kept apart from run.ts so they are testable without a database.
 */

export type Resolve = (key: string) => number

const rows = (lines: string[]) => lines.map((text) => ({ text }))

export function streamData(s: SeedStream, media: Resolve) {
  return {
    slug: s.slug,
    name: s.name,
    order: s.order,
    problem: s.problem,
    instead: s.instead,
    solution: s.solution,
    stepPhoto: media(s.stepPhoto),
    promise: s.promise,
    pageLede: s.pageLede,
    pagePhoto: s.pagePhoto ? media(s.pagePhoto) : null,
    sections: s.sections.map((sec) => ({
      slug: sec.slug,
      title: sec.title,
      body: rows(sec.body),
      includes: rows(sec.includes),
      link: sec.link,
      pending: sec.pending,
      media: sec.media
        ? {
            upload: media(sec.media.upload),
            poster: sec.media.poster ? media(sec.media.poster) : null,
            alt: sec.media.alt,
          }
        : { upload: null, poster: null, alt: null },
    })),
    lede: s.lede,
    caps: rows(s.caps),
    who: s.who,
    proof: s.proof,
    pricing: s.pricing,
  }
}

export function projectData(p: SeedProject, media: Resolve, stream: Resolve) {
  return {
    slug: p.slug,
    title: p.title,
    order: p.order,
    featured: p.featured,
    placeholder: p.placeholder,
    client: p.client,
    stream: stream(p.stream),
    year: p.year,
    status: p.status,
    line: p.line,
    lede: p.lede,
    body: rows(p.body),
    facts: p.facts,
    url: p.url,
    media: {
      kind: p.media.kind,
      fit: p.media.fit,
      upload: p.media.upload ? media(p.media.upload) : null,
      poster: p.media.poster ? media(p.media.poster) : null,
      markId: p.media.markId,
      alt: p.media.alt,
      long: p.media.long,
    },
    sites: p.sites.map((site) => ({
      name: site.name,
      url: site.url,
      where: site.where,
      screenshot: media(site.screenshot),
    })),
    _status: p.draft ? 'draft' : 'published',
  }
}

export function crewData(c: SeedCrew, media: Resolve) {
  return {
    slug: c.slug,
    name: c.name,
    order: c.order,
    pending: c.pending,
    role: c.role,
    summary: c.summary,
    bio: rows(c.bio),
    portrait: c.portrait ? media(c.portrait) : null,
  }
}

export function partnerData(p: SeedPartner, media: Resolve) {
  return {
    slug: p.slug,
    name: p.name,
    order: p.order,
    pending: p.pending,
    kind: p.kind,
    logo: media(p.logo),
    body: p.body,
  }
}

/*
 * Does writing `want` over `have` change anything?
 *
 * Only the keys `want` names are compared: the stored row also has `id`,
 * timestamps, and an `id` on every array row, none of which the seed sets.
 * `null` and `undefined` are the same thing here — an empty optional field
 * comes back as either, depending on the field type.
 */
export function differs(have: unknown, want: unknown): boolean {
  if (want === null || want === undefined) return !(have === null || have === undefined)
  if (Array.isArray(want)) {
    if (!Array.isArray(have) || have.length !== want.length) return true
    return want.some((item, i) => differs(have[i], item))
  }
  if (typeof want === 'object') {
    if (!have || typeof have !== 'object') return true
    return Object.entries(want as Record<string, unknown>).some(([key, value]) =>
      differs((have as Record<string, unknown>)[key], value)
    )
  }
  // A relationship read at depth 0 is the id; at depth > 0 it is the doc.
  if (typeof want === 'number' && have && typeof have === 'object' && 'id' in have) {
    return (have as { id: unknown }).id !== want
  }
  return have !== want
}
