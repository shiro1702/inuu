import { describe, expect, it } from 'vitest'
import { resolveMaterialCoverUrl } from '~/utils/resolveMaterialCoverUrl'

describe('resolveMaterialCoverUrl', () => {
  it('uses cover_media_url column first', () => {
    expect(
      resolveMaterialCoverUrl({
        cover_media_url: 'https://cdn.example.com/a.jpg',
      }),
    ).toBe('https://cdn.example.com/a.jpg')
  })

  it('falls back to poster in source_metadata', () => {
    expect(
      resolveMaterialCoverUrl({
        cover_media_url: null,
        source_metadata: {
          poster_url: 'https://cdn.example.com/poster.jpg',
        },
      }),
    ).toBe('https://cdn.example.com/poster.jpg')
  })
})
