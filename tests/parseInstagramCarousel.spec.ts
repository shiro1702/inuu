import { describe, expect, it } from 'vitest'
import {
  buildEditorialCarouselMetadata,
  parseInstagramCarouselToSlides,
} from '~/utils/parseInstagramCarousel'

describe('parseInstagramCarouselToSlides', () => {
  it('parses numbered slides', () => {
    const raw = `1. Где пить в пятницу
2. Бар с джазом
- Винотека у реки
3. Читать обзор в INUU`

    const slides = parseInstagramCarouselToSlides(raw)
    expect(slides).toHaveLength(3)
    expect(slides[0]?.role).toBe('cover')
    expect(slides[1]?.role).toBe('body')
    expect(slides[2]?.role).toBe('outro')
    expect(slides[0]?.title).toContain('пить')
  })

  it('parses delimiter blocks', () => {
    const raw = `Hook заголовок
---
Тезис один
Тезис два
---
Сохрани в INUU`

    const slides = parseInstagramCarouselToSlides(raw)
    expect(slides.length).toBeGreaterThanOrEqual(3)
    expect(slides.at(-1)?.role).toBe('outro')
  })

  it('falls back from title and short description', () => {
    const slides = parseInstagramCarouselToSlides('', {
      title: 'Обзор бара',
      descriptionShort: 'Уютный зал. Живая музыка по пятницам.',
    })
    expect(slides.length).toBeGreaterThanOrEqual(3)
    expect(slides[0]?.role).toBe('cover')
  })
})

describe('buildEditorialCarouselMetadata', () => {
  it('attaches cover to first slide', () => {
    const meta = buildEditorialCarouselMetadata({
      instagramCarousel: '1. Cover\n2. Body line\n3. CTA save',
      coverMediaUrl: 'https://example.com/cover.jpg',
      topicTags: ['nightlife'],
    })
    expect(meta?.slides[0]?.media_url).toBe('https://example.com/cover.jpg')
    expect(meta?.template_id).toBe('minimal-ios')
  })
})
