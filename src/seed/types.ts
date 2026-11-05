/*
 * The shape of src/seed/content.ts. Media fields hold an ASSET KEY (a path
 * under src/seed/assets/ without its extension); stream fields hold a stream
 * SLUG. run.ts resolves both to ids.
 */
type Key = string
type Lines = string[]
type Link = { href: string | null; label: string | null }

export interface SeedAsset {
  /** Path under src/seed/assets/. */
  file: string
  alt: string
  /** Where a stock photograph came from, so it can be found and swapped. Not
   *  stored; kept for us. */
  credit?: { name: string; url: string }
}

export interface SeedStream {
  slug: string
  name: string
  order: number
  door: string
  doorPhoto: Key | null
  problem: string
  instead: string
  solution: string
  stepPhoto: Key
  promise: string
  pageLede: string
  pagePhoto: Key | null
  sections: Array<{
    slug: string
    title: string
    body: Lines
    includes: Lines
    link: Link
    pending: boolean
    /** An image or clip beside the section; null for none. */
    media: { upload: Key; poster: Key | null; alt: string } | null
  }>
  lede: string
  caps: Lines
  who: string
  proof: { label: string; body: string; pending: boolean }
  pricing: { value: string; note: string }
}

export interface SeedProject {
  slug: string
  title: string
  order: number
  featured: boolean
  placeholder: boolean
  client: string
  stream: string
  year: string
  status: 'live' | 'building' | 'starting'
  line: string
  lede: string
  body: Lines
  facts: Array<{ label: string; value: string }>
  url: string | null
  media: {
    kind: 'image' | 'video' | 'logo' | 'mark'
    upload: Key | null
    poster: Key | null
    markId: 'software' | 'robotics' | 'websites' | null
    alt: string
    long: Link
  }
  /** Several live sites under one project. `screenshot` is an asset key. */
  sites: Array<{ name: string; url: string; where: string; screenshot: Key }>
  /** Seeded as a draft: in the admin, not on the site. */
  draft: boolean
}

export interface SeedCrew {
  slug: string
  name: string
  order: number
  pending: boolean
  role: string
  summary: string
  bio: Lines
  portrait: Key | null
}

export interface SeedPartner {
  slug: string
  name: string
  order: number
  pending: boolean
  kind: string
  logo: Key
  body: string
}

export interface SeedContent {
  assets: Record<Key, SeedAsset>
  streams: SeedStream[]
  projects: SeedProject[]
  crew: SeedCrew[]
  partners: SeedPartner[]
  site: {
    heroPhotos: { software: Key; robotics: Key; websites: Key; team: Key }
    workingPhoto: Key
    groupPhoto: Key | null
    comingSoon: Array<{ name: string; stream: string }>
  }
  /** Rows to delete, by slug. Removal is explicit: a row missing from this
   *  file is left alone, because an admin may have added it. */
  retired?: Partial<Record<'streams' | 'projects' | 'crew' | 'partners', string[]>> & {
    /** Media rows to delete, by filename, once nothing the seed writes uses them. */
    media?: string[]
  }
}
