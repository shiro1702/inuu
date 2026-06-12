import { describe, expect, it } from 'vitest'
import {
  buildEditorialCarouselMetadata,
  parseInstagramCarouselToSlides,
  resolveCarouselFromEditorialPost,
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

  it('ignores leading delimiter and parses digest example', () => {
    const raw = `---\nПятничный дайджест\n---\nКонцерт в «Городе»\n19:00, от 500₽\n---\nВыставка в музее\nдо воскресенья\n---\nЧитать в INUU`
    const slides = parseInstagramCarouselToSlides(raw)

    expect(slides).toHaveLength(4)
    expect(slides[0]?.role).toBe('cover')
    expect(slides[0]?.title).toBe('Пятничный дайджест')
    expect(slides[1]?.title).toContain('Концерт')
    expect(slides.at(-1)?.role).toBe('outro')
    expect(slides.at(-1)?.cta_text).toContain('INUU')
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

describe('resolveCarouselFromEditorialPost', () => {
  it('prefers saved metadata.carousel', () => {
    const saved = {
      template_id: 'minimal-ios' as const,
      aspect: '4:5' as const,
      slides: [
        { role: 'cover' as const, title: 'Saved cover' },
        { role: 'outro' as const, cta_text: 'CTA' },
      ],
    }
    const meta = resolveCarouselFromEditorialPost({
      title: 'Ignored title',
      metadata: { carousel: saved },
    })
    expect(meta?.slides[0]?.title).toBe('Saved cover')
  })

  it('builds slides from journal fields when carousel is missing', () => {
    const meta = resolveCarouselFromEditorialPost({
      title: 'Гид по кофейням',
      excerpt: 'Три места с альтернативным обжаром. Уютные залы и десерты.',
      cover_media_url: 'https://example.com/cover.jpg',
      topic_tags: ['coffee'],
    })
    expect(meta?.slides[0]?.title).toBe('Гид по кофейням')
    expect(meta?.slides[0]?.media_url).toBe('https://example.com/cover.jpg')
    expect(meta?.slides.some((s) => s.role === 'body')).toBe(true)
    expect(meta?.slides.at(-1)?.role).toBe('outro')
  })

  it('adds linked venue slides from journal post', () => {
    const meta = resolveCarouselFromEditorialPost({
      title: 'Барный кроул: 4 места в центре',
      excerpt: 'Четыре остановки для тёплого вечера в Улан-Удэ.',
      cover_media_url: 'https://example.com/cover.jpg',
      topic_tags: ['nightlife'],
      linked_venues: [
        {
          slug: 'art-kvartal',
          title: 'Арт-квартал',
          address: 'ул. Ленина, 24',
          editorial_quote: 'Уютное место для вечера',
        },
      ],
    })
    expect(meta?.slides[0]?.title).toBe('Барный кроул: 4 места в центре')
    expect(meta?.slides.some((s) => s.title === 'Арт-квартал')).toBe(true)
    expect(meta?.slides.some((s) => s.title === 'О маршруте')).toBe(true)
    expect(meta?.slides.at(-1)?.cta_text).toBe('Читать в INUU')
  })
})
