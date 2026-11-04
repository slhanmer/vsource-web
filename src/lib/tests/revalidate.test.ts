/*
 * Ported from the starter's src/lib/revalidate.test.ts (vitest) to jest, with
 * our tag and the global variant.
 */
import type { CollectionConfig, GlobalConfig } from 'payload'

const spy = jest.fn()
jest.mock('next/cache.js', () => ({ revalidateTag: (...args: unknown[]) => spy(...args) }))

import {
  clearContentCache,
  CONTENT_CACHE_TAG,
  withContentRevalidation,
  withGlobalRevalidation,
} from '../revalidate'

type Hook = (args: { doc: unknown }) => unknown
const hooks = (c: CollectionConfig | GlobalConfig, kind: 'afterChange' | 'afterDelete') =>
  ((c.hooks as Record<string, unknown> | undefined)?.[kind] ?? []) as unknown as Hook[]

describe('withContentRevalidation', () => {
  beforeEach(() => spy.mockReset())

  it('clears the content cache on save and on delete, with no stale window', () => {
    const projects = withContentRevalidation({ slug: 'projects', fields: [] })
    for (const kind of ['afterChange', 'afterDelete'] as const) {
      const doc = { id: 1 }
      expect(hooks(projects, kind).at(-1)!({ doc })).toBe(doc)
    }
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenCalledWith(CONTENT_CACHE_TAG, { expire: 0 })
  })

  it("keeps a collection's own hooks, and runs after them", () => {
    const own = jest.fn()
    const media = withContentRevalidation({
      slug: 'media',
      fields: [],
      hooks: { afterChange: [own] },
    })
    expect(hooks(media, 'afterChange')[0]).toBe(own)
    expect(hooks(media, 'afterChange')).toHaveLength(2)
  })

  it('leaves users alone — an account change renders nothing', () => {
    const users = { slug: 'users', fields: [] }
    expect(withContentRevalidation(users)).toBe(users)
  })

  it('swallows the throw outside a Next request, so a seed is not stopped by it', () => {
    const outsideNext = jest.fn(() => {
      throw new Error('Invariant: static generation store missing in revalidateTag content')
    })
    expect(() => clearContentCache(outsideNext)).not.toThrow()
    expect(outsideNext).toHaveBeenCalledWith(CONTENT_CACHE_TAG, { expire: 0 })
  })
})

describe('withGlobalRevalidation', () => {
  beforeEach(() => spy.mockReset())

  it('clears the content cache when the global is saved', () => {
    const site = withGlobalRevalidation({ slug: 'site', fields: [] })
    const doc = { id: 1 }
    expect(hooks(site, 'afterChange').at(-1)!({ doc })).toBe(doc)
    expect(spy).toHaveBeenCalledWith(CONTENT_CACHE_TAG, { expire: 0 })
  })
})
