import { describe, expect, it } from 'vitest'
import {
  parseEditorialBodyFallback,
  parseEditorialTelegramGalleryComment,
  stripEditorialTelegramGalleryComment,
} from '../utils/editorialTelegramGallery'

const SAMPLE_BODY = `Подпись к альбому

<!-- inuu-telegram-gallery
{"telegram_message_id": "message949", "gallery": [{"type": "photo", "url": "/a.jpg", "sort_order": 1}, {"type": "video", "url": "/b.mov", "sort_order": 0}]}
-->`

describe('editorialTelegramGallery', () => {
  it('strips gallery HTML comment from body', () => {
    expect(stripEditorialTelegramGalleryComment(SAMPLE_BODY)).toBe('Подпись к альбому')
  })

  it('parses gallery items sorted by sort_order', () => {
    const items = parseEditorialTelegramGalleryComment(SAMPLE_BODY)
    expect(items).toEqual([
      { type: 'video', url: '/b.mov', sort_order: 0 },
      { type: 'photo', url: '/a.jpg', sort_order: 1 },
    ])
  })

  it('parseEditorialBodyFallback returns text and gallery', () => {
    const { text, gallery } = parseEditorialBodyFallback(SAMPLE_BODY)
    expect(text).toBe('Подпись к альбому')
    expect(gallery).toHaveLength(2)
  })

  it('returns empty gallery when comment is absent', () => {
    const { text, gallery } = parseEditorialBodyFallback('Только текст')
    expect(text).toBe('Только текст')
    expect(gallery).toEqual([])
  })
})
