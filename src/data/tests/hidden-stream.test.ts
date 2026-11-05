/**
 * A hidden stream is absent from the nav, the hero's words and the sitemap
 * (hide-websites). All three read getStreams(), which runs the documents
 * through visibleOnly(); this checks each surface end to end from that list.
 */
import { visibleOnly } from '../visible'
import { siteNav } from '@/components/layouts/siteNav'
import { sentenceOf, sequenceOf } from '@/components/home/headlineTimeline'

const DOCS = [
  { slug: 'software', name: 'Software', href: '/software', hidden: false },
  { slug: 'robotics', name: 'Robotics', href: '/robotics', hidden: null },
  { slug: 'websites', name: 'Websites', href: '/websites', hidden: true },
]

const mockVisible = visibleOnly(DOCS)
const visible = mockVisible

// The sitemap's import of the data layer (src/data/index.ts), answered from
// the visible list: the real module needs Payload and a database.
jest.mock('../index', () => ({
  getStreams: async () => mockVisible,
  getProjects: async () => [],
}))

describe('a hidden stream', () => {
  it('is dropped from the visible list, and only it', () => {
    expect(visible.map((stream) => stream.slug)).toEqual(['software', 'robotics'])
  })

  it('is not in the nav', () => {
    const nav = siteNav(visible)
    expect(nav.map((item) => item.href)).toEqual(['/software', '/robotics', '/built', '/contact'])
    expect(nav.some((item) => item.href === '/websites')).toBe(false)
  })

  it('is not one of the hero words, which still land on Software', () => {
    const words = visible.map((stream) => stream.name)
    const sequence = sequenceOf(words)
    expect(sequence).toEqual(['Software', 'Robotics', 'Software'])
    expect(sentenceOf(words)).toBe('Software and robotics, built to fit.')
  })

  it('is not in the sitemap', async () => {
    const { default: sitemap } = await import('../../app/sitemap')
    const urls = (await sitemap()).map((entry) => entry.url)
    expect(urls).toContain('https://www.vsource.dev/software')
    expect(urls).toContain('https://www.vsource.dev/robotics')
    expect(urls.some((url) => url.endsWith('/websites'))).toBe(false)
  })

  it('comes back, untouched, when the box is unticked', () => {
    const back = visibleOnly(DOCS.map((doc) => ({ ...doc, hidden: false })))
    expect(siteNav(back).map((item) => item.label)).toEqual([
      'Software',
      'Robotics',
      'Websites',
      'Built',
      'Contact',
    ])
    expect(sentenceOf(back.map((stream) => stream.name))).toBe(
      'Software, robotics and websites, built to fit.'
    )
  })
})
