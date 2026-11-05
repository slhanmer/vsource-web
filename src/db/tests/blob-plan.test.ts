import { blobKey, needsUpload, planBlobUpload } from '../blob-plan'

describe('planBlobUpload', () => {
  it('lists the original and every generated size, keyed by filename', () => {
    const plan = planBlobUpload([
      {
        id: 1,
        filename: 'room.jpg',
        mimeType: 'image/jpeg',
        sizes: {
          thumb: { filename: 'room-400x284.jpg', mimeType: 'image/jpeg' },
          card: { filename: 'room-900x639.jpg', mimeType: 'image/jpeg' },
          wide: { filename: null },
        },
      },
    ])
    expect(plan.map((f) => f.key)).toEqual(['room.jpg', 'room-400x284.jpg', 'room-900x639.jpg'])
    expect(plan.every((f) => f.local === f.key)).toBe(true)
  })

  it('puts a row with a prefix under it, and reads the local file by filename', () => {
    const [file] = planBlobUpload([{ id: 2, filename: 'a.webp', prefix: 'snug' }])
    expect(file).toMatchObject({ key: 'snug/a.webp', local: 'a.webp' })
  })

  it('uploads a file two rows share once', () => {
    const plan = planBlobUpload([
      { id: 1, filename: 'logo.png' },
      { id: 2, filename: 'logo.png' },
    ])
    expect(plan).toHaveLength(1)
  })

  it('skips a row with no file', () => {
    expect(planBlobUpload([{ id: 3, filename: null }])).toEqual([])
  })
})

describe('blobKey', () => {
  it('is the bare filename with no prefix', () => {
    expect(blobKey('x.jpg')).toBe('x.jpg')
    expect(blobKey('x.jpg', '')).toBe('x.jpg')
  })
})

describe('needsUpload', () => {
  it('uploads what is missing or a different size, and skips an exact match', () => {
    expect(needsUpload(10, null)).toBe(true)
    expect(needsUpload(10, 9)).toBe(true)
    expect(needsUpload(10, 10)).toBe(false)
  })
})
