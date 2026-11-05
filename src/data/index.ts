import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import { CONTENT_CACHE_TAG } from '@/lib/revalidate'
import type {
  Crew as CrewDoc,
  Media,
  Partner as PartnerDoc,
  Project as ProjectDoc,
  Stream as StreamDoc,
} from '@/payload-types'
import type {
  CrewMember,
  MarkId,
  Partner,
  Photo,
  Project,
  ProjectMedia,
  SiteContent,
  Stream,
  Upcoming,
} from './types'

export type * from './types'

/*
 * THE SITE'S CONTENT, FROM PAYLOAD.
 *
 * One cached getter per collection, returning the shapes the old constants
 * had (./types.ts), so the components changed as little as possible.
 *
 * CACHING. Every getter is `unstable_cache`d under the one tag `content`.
 * Pages are statically rendered from these, at build time and again after a
 * save: every collection and the `site` global clear the tag on save
 * (src/lib/revalidate.ts, attached in payload.config.ts), so an edit in the
 * admin is on the next page load without a deploy. There is no time-based
 * expiry. A seed against a deployed database cannot reach its cache; redeploy
 * after one.
 *
 * DRAFTS are never read here: `draft: false`, and `_status: published` on
 * projects, so a draft is in the admin and nowhere else.
 *
 * ORDER everywhere is the `order` field.
 */

const payload = () => getPayload({ config })

/** A media document → the Photo every image component takes. */
function photo(media: number | Media | null | undefined, alt?: string): Photo | undefined {
  if (!media || typeof media === 'number' || !media.url) return undefined
  return {
    src: media.url,
    alt: alt ?? media.alt,
    width: media.width ?? 0,
    height: media.height ?? 0,
  }
}

/** A required photo. A missing one is a broken page, so say which. */
function must(media: number | Media | null | undefined, where: string): Photo {
  const found = photo(media)
  if (!found) throw new Error(`Content: ${where} has no image. Set it in /admin.`)
  return found
}

const texts = (rows: Array<{ text: string }> | null | undefined) =>
  (rows ?? []).map((row) => row.text)

const slugOf = (stream: number | StreamDoc | null | undefined) =>
  stream && typeof stream === 'object' ? stream.slug : ''

/*
 * ⚠ ONE CACHE PER DEPLOYMENT. `unstable_cache` keeps its entries in the Data
 * Cache (.next/cache locally), which OUTLIVES A BUILD, and nothing outside a
 * Next request can clear its tag. So a seed, or any write made from a
 * laptop, followed by a new build used to bake the PREVIOUS content into the
 * pages: the build read its own stale cache. Found by built-trim's verify.
 * The epoch in the key makes every deployment (VERCEL_DEPLOYMENT_ID) or, off
 * Vercel, every server process start with a cold cache, read from the
 * database. Inside one deployment, saves still clear the tag as before.
 *
 * `unstable_cache` serialises its result to JSON, so `undefined` keys vanish
 * and nothing here may be a class instance. Plain objects only.
 */
const CACHE_EPOCH =
  process.env.VERCEL_DEPLOYMENT_ID ?? `local-${Date.now().toString(36)}-${process.pid}`

const cached = <A extends unknown[], R>(key: string, fn: (...args: A) => Promise<R>) =>
  unstable_cache(fn, ['content', key, CACHE_EPOCH], { tags: [CONTENT_CACHE_TAG] })

/* A stream section's media: an image or an mp4 clip, by the file's type. */
type SectionMediaDoc = NonNullable<StreamDoc['sections']>[number]['media']
function sectionMedia(media: SectionMediaDoc): { media?: ProjectMedia } {
  const upload = media?.upload
  if (!upload || typeof upload === 'number' || !upload.url) return {}
  const poster = photo(media?.poster)
  const video = (upload.mimeType ?? '').startsWith('video/')
  return {
    media: {
      kind: video ? 'video' : 'image',
      src: upload.url,
      ...(poster ? { poster: poster.src } : {}),
      alt: media?.alt || upload.alt,
      width: upload.width || poster?.width || 1280,
      height: upload.height || poster?.height || 720,
    },
  }
}

function toStream(doc: StreamDoc): Stream {
  const doorPhoto = photo(doc.doorPhoto)
  const pagePhoto = photo(doc.pagePhoto)
  return {
    slug: doc.slug,
    name: doc.name,
    door: doc.door,
    ...(doorPhoto ? { doorPhoto } : {}),
    problem: doc.problem,
    instead: doc.instead,
    solution: doc.solution,
    stepPhoto: must(doc.stepPhoto, `Stream "${doc.slug}" step photo`),
    lede: doc.lede,
    caps: texts(doc.caps),
    who: doc.who,
    proof: {
      label: doc.proof.label,
      body: doc.proof.body,
      ...(doc.proof.pending ? { pending: true } : {}),
    },
    pricing: { value: doc.pricing.value, note: doc.pricing.note },
    promise: doc.promise,
    pageLede: doc.pageLede,
    ...(pagePhoto ? { pagePhoto } : {}),
    sections: (doc.sections ?? []).map((section) => ({
      slug: section.slug,
      title: section.title,
      body: texts(section.body),
      ...(section.includes?.length ? { includes: texts(section.includes) } : {}),
      ...(section.link?.href && section.link.label
        ? { link: { href: section.link.href, label: section.link.label } }
        : {}),
      ...(section.pending ? { pending: true } : {}),
      ...sectionMedia(section.media),
    })),
    href: `/${doc.slug}`,
  }
}

/** The mark media has no file; this is the box it draws in. */
const MARK_BOX = { width: 260, height: 180 }

function toProject(doc: ProjectDoc): Project {
  const m = doc.media
  const upload = photo(m.upload)
  const poster = photo(m.poster)
  // A video document has no intrinsic size; its poster does.
  const size =
    m.kind === 'mark'
      ? MARK_BOX
      : {
          width: upload?.width || poster?.width || 1280,
          height: upload?.height || poster?.height || 720,
        }

  return {
    slug: doc.slug,
    title: doc.title,
    client: doc.client,
    stream: slugOf(doc.stream),
    year: doc.year,
    line: doc.line,
    lede: doc.lede,
    body: texts(doc.body),
    facts: (doc.facts ?? []).map((fact) => ({ label: fact.label, value: fact.value })),
    status: doc.status,
    ...(doc.url ? { url: doc.url } : {}),
    media: {
      kind: m.kind,
      ...(m.fit === 'contain' ? { fit: 'contain' as const } : {}),
      ...(upload ? { src: upload.src } : {}),
      ...(poster ? { poster: poster.src } : {}),
      ...(m.markId ? { markId: m.markId as MarkId } : {}),
      alt: m.alt,
      ...size,
      ...(m.long?.href && m.long.label ? { long: { href: m.long.href, label: m.long.label } } : {}),
    },
    ...(doc.featured ? { featured: true } : {}),
    ...(doc.placeholder ? { placeholder: true } : {}),
    ...(doc.sites?.length
      ? {
          sites: doc.sites.map((site) => ({
            name: site.name,
            url: site.url,
            where: site.where,
            screenshot: must(site.screenshot, `Project "${doc.slug}" site "${site.name}"`),
          })),
        }
      : {}),
  }
}

function toCrew(doc: CrewDoc): CrewMember {
  const portrait = photo(doc.portrait)
  return {
    slug: doc.slug,
    name: doc.name,
    role: doc.role,
    summary: doc.summary,
    bio: texts(doc.bio),
    ...(portrait ? { portrait } : {}),
    ...(doc.pending ? { pending: true } : {}),
  }
}

function toPartner(doc: PartnerDoc): Partner {
  return {
    slug: doc.slug,
    name: doc.name,
    kind: doc.kind,
    logo: must(doc.logo, `Partner "${doc.slug}" logo`),
    body: doc.body,
    ...(doc.pending ? { pending: true } : {}),
  }
}

export const getStreams = cached('streams', async (): Promise<Stream[]> => {
  const { docs } = await (
    await payload()
  ).find({ collection: 'streams', sort: 'order', depth: 1, limit: 100, draft: false })
  return docs.map(toStream)
})

export const getProjects = cached('projects', async (): Promise<Project[]> => {
  const { docs } = await (
    await payload()
  ).find({
    collection: 'projects',
    where: { _status: { equals: 'published' } },
    sort: 'order',
    depth: 1,
    limit: 200,
    draft: false,
  })
  return docs.map(toProject)
})

export const getCrew = cached('crew', async (): Promise<CrewMember[]> => {
  const { docs } = await (
    await payload()
  ).find({ collection: 'crew', sort: 'order', depth: 1, limit: 100 })
  return docs.map(toCrew)
})

export const getPartners = cached('partners', async (): Promise<Partner[]> => {
  const { docs } = await (
    await payload()
  ).find({ collection: 'partners', sort: 'order', depth: 1, limit: 100 })
  return docs.map(toPartner)
})

export const getSite = cached('site', async (): Promise<SiteContent> => {
  const site = await (await payload()).findGlobal({ slug: 'site', depth: 1 })
  const groupPhoto = photo(site.groupPhoto)
  const comingSoon: Upcoming[] = (site.comingSoon ?? []).map((item) => ({
    name: item.name,
    stream: slugOf(item.stream),
  }))
  return {
    heroPhotos: {
      software: must(site.heroPhotos?.software, 'The hero photo for Software'),
      robotics: must(site.heroPhotos?.robotics, 'The hero photo for Robotics'),
      websites: must(site.heroPhotos?.websites, 'The hero photo for Websites'),
      team: must(site.heroPhotos?.team, 'The hero photo for the team'),
    },
    workingPhoto: must(site.workingPhoto, 'The site working photo'),
    ...(groupPhoto ? { groupPhoto } : {}),
    comingSoon,
  }
})

/* Lookups by slug. Built on the cached lists rather than cached separately:
   the lists are small, and one tag clears everything either way. */
export async function getStream(slug: string): Promise<Stream | undefined> {
  return (await getStreams()).find((stream) => stream.slug === slug)
}

export async function getProject(slug: string): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.slug === slug)
}
