/*
 * What the site's components take. The same shapes the old constants had
 * (src/constants/streams.ts, built.ts, crew.ts, partners.ts, photos.ts), with
 * two differences:
 *
 *   - `id` is `slug`, as it is in the database (Payload reserves `id`).
 *   - Every image is a `Photo`: the media document's url, alt and real size,
 *     where the constants had a /public path and hand-typed dimensions.
 *
 * src/data/index.ts maps Payload documents onto these, so a component never
 * sees a Payload type.
 */

/** The stream marks are drawn in code (StreamMark), so their ids are a closed
 *  set even though streams themselves are data. */
export type MarkId = 'software' | 'robotics' | 'websites'

export interface Photo {
  src: string
  alt: string
  width: number
  height: number
}

export interface StreamSection {
  slug: string
  title: string
  body: string[]
  includes?: string[]
  link?: { href: string; label: string }
  /** Invented or unverified copy. Renders a visible marker. */
  pending?: boolean
  /** A photograph or clip beside the section; the section goes two-column. */
  media?: ProjectMedia
}

export interface Stream {
  slug: string
  name: string
  /** Unused since hero-rebuild: the fold's doors are gone. */
  door: string
  /** Unused since hero-rebuild, and empty on Software. */
  doorPhoto?: Photo
  problem: string
  instead: string
  solution: string
  stepPhoto: Photo
  lede: string
  caps: string[]
  who: string
  proof: { label: string; body: string; pending?: boolean }
  pricing: { value: string; note: string }
  promise: string
  pageLede: string
  /** The photograph in the stream page's head. */
  pagePhoto?: Photo
  sections: StreamSection[]
  /** `/${slug}`. Derived, not stored. */
  href: string
}

/** `logo`: a client's logo on a light plate, for work under NDA. `mark`: a
 *  stream mark; unused since built-trim, kept working. */
export type MediaKind = 'video' | 'image' | 'logo' | 'mark'

export interface ProjectMedia {
  kind: MediaKind
  /** Images only: crop to fill the frame (default), or show the whole image. */
  fit?: 'cover' | 'contain'
  src?: string
  poster?: string
  markId?: MarkId
  alt: string
  width: number
  height: number
  long?: { href: string; label: string }
}

export type ProjectStatus = 'live' | 'building' | 'starting'

export interface Project {
  slug: string
  title: string
  client: string
  /** The stream's slug. */
  stream: string
  year: string
  line: string
  lede: string
  body: string[]
  facts: Array<{ label: string; value: string }>
  status: ProjectStatus
  url?: string
  media: ProjectMedia
  featured?: boolean
  placeholder?: boolean
  /** Several live sites under one project, each a linked card on its page. */
  sites?: ProjectSite[]
}

export interface ProjectSite {
  name: string
  url: string
  where: string
  screenshot: Photo
}

export interface CrewMember {
  slug: string
  name: string
  role: string
  summary: string
  bio: string[]
  /** Absent: the terminal tile. */
  portrait?: Photo
  pending?: boolean
}

export interface Partner {
  slug: string
  name: string
  kind: string
  logo: Photo
  body: string
  pending?: boolean
}

export interface Upcoming {
  name: string
  /** The stream's slug. */
  stream: string
}

export interface SiteContent {
  /** The home page fold's photographs, one per stream and the team (the LCP). */
  heroPhotos: { software: Photo; robotics: Photo; websites: Photo; team: Photo }
  workingPhoto: Photo
  groupPhoto?: Photo
  comingSoon: Upcoming[]
}
