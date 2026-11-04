import { crewData, differs, projectData } from '../shape'
import type { SeedCrew, SeedProject } from '../types'

describe('differs', () => {
  it('ignores what the seed does not set: ids, timestamps, array row ids', () => {
    const stored = {
      id: 4,
      updatedAt: '2026-11-05T00:00:00.000Z',
      title: 'SAUCE',
      body: [{ id: 'abc', text: 'One.' }],
    }
    expect(differs(stored, { title: 'SAUCE', body: [{ text: 'One.' }] })).toBe(false)
  })

  it('treats null and undefined as the same empty field', () => {
    expect(differs({ url: undefined }, { url: null })).toBe(false)
    expect(differs({ url: 'https://x.test' }, { url: null })).toBe(true)
  })

  it('sees a changed word, a reordered list and a removed row', () => {
    expect(differs({ line: 'a' }, { line: 'b' })).toBe(true)
    expect(
      differs({ caps: [{ text: 'a' }, { text: 'b' }] }, { caps: [{ text: 'b' }, { text: 'a' }] })
    ).toBe(true)
    expect(differs({ caps: [{ text: 'a' }, { text: 'b' }] }, { caps: [{ text: 'a' }] })).toBe(true)
  })

  it('compares a relationship by id at any depth', () => {
    expect(differs({ stream: 2 }, { stream: 2 })).toBe(false)
    expect(differs({ stream: { id: 2, slug: 'software' } }, { stream: 2 })).toBe(false)
    expect(differs({ stream: { id: 3 } }, { stream: 2 })).toBe(true)
  })
})

describe('document data', () => {
  const ids = (key: string) => key.length

  it('turns lists of strings into { text } rows, and keys into ids', () => {
    const member: SeedCrew = {
      slug: 'tom-lee',
      name: 'Tom Lee',
      order: 50,
      pending: false,
      role: 'Backend & Platform Developer',
      summary: 'Backend.',
      bio: ['One.', 'Two.'],
      portrait: null,
    }
    expect(crewData(member, ids)).toMatchObject({
      bio: [{ text: 'One.' }, { text: 'Two.' }],
      portrait: null,
    })
  })

  it('turns a project’s sites into rows with the screenshot resolved', () => {
    const project = {
      slug: 'v',
      stream: 'websites',
      body: [],
      facts: [],
      media: { kind: 'image', upload: 'built/v', poster: null, markId: null, alt: 'a', long: {} },
      sites: [
        {
          name: 'Snug',
          url: 'https://goodsnug.com/',
          where: 'Coorparoo',
          screenshot: 'built/snug',
        },
      ],
      draft: false,
    } as unknown as SeedProject
    expect(projectData(project, ids, ids).sites).toEqual([
      { name: 'Snug', url: 'https://goodsnug.com/', where: 'Coorparoo', screenshot: 10 },
    ])
  })

  it('publishes a project unless the seed marks it a draft', () => {
    const project = {
      slug: 'x',
      stream: 'software',
      body: [],
      facts: [],
      media: { kind: 'mark', upload: null, poster: null, markId: 'software', alt: 'a', long: {} },
      sites: [],
      draft: false,
    } as unknown as SeedProject
    expect(projectData(project, ids, ids)._status).toBe('published')
    expect(projectData({ ...project, draft: true }, ids, ids)._status).toBe('draft')
  })
})
