import { portraitSectionMedia } from '../checks'
import type { SeedContent } from '../types'

const sizes: Record<string, { width: number; height: number }> = {
  'a/wide': { width: 1600, height: 1000 },
  'a/tall': { width: 738, height: 848 },
  'a/square': { width: 900, height: 900 },
  'a/poster': { width: 1280, height: 720 },
}
const sizeOf = async (key: string) => sizes[key] ?? null

function content(sections: Array<{ upload: string; poster?: string | null }>): SeedContent {
  return {
    assets: {
      'a/wide': { file: 'a/wide.jpg', alt: '' },
      'a/tall': { file: 'a/tall.jpg', alt: '' },
      'a/square': { file: 'a/square.jpg', alt: '' },
      'a/clip': { file: 'a/clip.mp4', alt: '' },
      'a/poster': { file: 'a/poster.jpg', alt: '' },
    },
    streams: [
      {
        slug: 'websites',
        sections: sections.map((m, i) => ({
          slug: `s${i}`,
          media: { upload: m.upload, poster: m.poster ?? null, alt: '' },
        })),
      },
    ],
  } as unknown as SeedContent
}

describe('portraitSectionMedia', () => {
  it('passes landscape and square section images', async () => {
    expect(
      await portraitSectionMedia(content([{ upload: 'a/wide' }, { upload: 'a/square' }]), sizeOf)
    ).toEqual([])
  })

  it('names a portrait section image', async () => {
    expect(await portraitSectionMedia(content([{ upload: 'a/tall' }]), sizeOf)).toEqual([
      'websites → s0: a/tall is 738×848',
    ])
  })

  it('checks a clip by its poster', async () => {
    expect(
      await portraitSectionMedia(content([{ upload: 'a/clip', poster: 'a/poster' }]), sizeOf)
    ).toEqual([])
  })
})
