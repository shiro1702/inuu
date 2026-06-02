import { describe, expect, it } from 'vitest'
import { buildEventMediaGallery } from '../server/utils/eventPublicDetail'

describe('eventPublicDetail media gallery', () => {
  it('uses media_urls when array is present', () => {
    const urls = buildEventMediaGallery({
      cover_media_url: null,
      source_metadata: {
        media_urls: ['https://cdn.example.com/one.jpg', 'https://cdn.example.com/two.jpg'],
      },
    })
    expect(urls).toEqual(['https://cdn.example.com/one.jpg', 'https://cdn.example.com/two.jpg'])
  })

  it('supports stringified media_urls array fallback', () => {
    const urls = buildEventMediaGallery({
      source_metadata: {
        media_urls: '["https://cdn.example.com/poster.jpg"]',
      },
    })
    expect(urls).toEqual(['https://cdn.example.com/poster.jpg'])
  })

  it('supports legacy single-url fields and dedupes', () => {
    const urls = buildEventMediaGallery({
      cover_media_url: 'https://cdn.example.com/poster.jpg',
      source_metadata: {
        poster_url: 'https://cdn.example.com/poster.jpg',
        image_url: 'https://cdn.example.com/extra.jpg',
      },
    })
    expect(urls).toEqual(['https://cdn.example.com/poster.jpg', 'https://cdn.example.com/extra.jpg'])
  })
})
