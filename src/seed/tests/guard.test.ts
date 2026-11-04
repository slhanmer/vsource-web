// Ported from the starter's src/seed/guard.test.ts (vitest) to jest. Unchanged otherwise.

import { conflicts, type SeedRecord } from '../guard'

const record: SeedRecord = {
  version: 1,
  slug: 'snug',
  at: '2026-10-10T10:00:00.000Z',
  docs: {
    pages: { '1': { updatedAt: '2026-10-10T10:00:00.100Z', versions: 2 } },
    media: { '7': { updatedAt: '2026-10-10T09:59:59.000Z' } },
  },
}

const page = {
  collection: 'pages',
  id: 1,
  label: '/',
  updatedAt: '2026-10-10T10:00:00.100Z',
  versions: 2,
}
const image = {
  collection: 'media',
  id: 7,
  label: 'Inside Snug',
  updatedAt: '2026-10-10T09:59:59.000Z',
}

describe('conflicts', () => {
  it('lets a seed overwrite exactly what it wrote last time', () => {
    expect(conflicts({ record, existing: [page, image], hasUsers: true })).toEqual([])
  })

  it('stops on a row whose updatedAt moved', () => {
    const edited = { ...image, updatedAt: '2026-10-11T08:00:00.000Z' }
    expect(conflicts({ record, existing: [page, edited], hasUsers: true })).toEqual([
      { ...edited, reason: 'edited' },
    ])
  })

  it('stops on a saved draft, which leaves the published row untouched', () => {
    const drafted = { ...page, versions: 3 }
    expect(conflicts({ record, existing: [drafted], hasUsers: true })[0]?.reason).toBe(
      'draft saved'
    )
  })

  it('stops on a row the last seed never wrote', () => {
    const other = { ...page, id: 2 }
    expect(conflicts({ record, existing: [other], hasUsers: true })[0]?.reason).toBe(
      'not written by the last seed'
    )
  })

  it('always lets an empty database seed', () => {
    expect(conflicts({ record: null, existing: [], hasUsers: true })).toEqual([])
    expect(conflicts({ record, existing: [], hasUsers: true })).toEqual([])
  })

  it('with no record, trusts a database nobody can have logged in to', () => {
    expect(conflicts({ record: null, existing: [page], hasUsers: false })).toEqual([])
  })

  it('with no record and user accounts, cannot know, so refuses', () => {
    expect(conflicts({ record: null, existing: [page], hasUsers: true })[0]?.reason).toBe(
      'unknown, no seed record'
    )
  })
})
