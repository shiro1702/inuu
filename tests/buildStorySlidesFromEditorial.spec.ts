import { describe, expect, it } from 'vitest'
import { buildStorySlidesFromEditorial } from '~/server/utils/buildStorySlidesFromEditorial'
import type { EditorialParseResult } from '~/server/utils/ai/editorialParseSchema'

describe('buildStorySlidesFromEditorial', () => {
  it('builds hook-story-offer from title and short', () => {
    const payload = {
      content_type: 'venue_review',
      post_type: 'review',
      title: 'Бар на набережной',
      description_short: 'Лучшие коктейли в городе.',
      description_full: 'Полный текст обзора.',
      topic_tags: ['nightlife'],
    } as EditorialParseResult

    const slides = buildStorySlidesFromEditorial(payload)
    expect(slides).toHaveLength(3)
    expect(slides[0]?.role).toBe('cover')
    expect(slides[2]?.role).toBe('outro')
  })
})
