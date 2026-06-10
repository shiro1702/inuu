import { describe, expect, it } from 'vitest'
import { resolveSlideEventMeta } from '~/utils/carouselSlideEventMeta'
import { mapGroqPayloadToCarouselSlide } from '~/utils/groqCarouselSlideMap'

describe('carouselSlideEventMeta', () => {
  it('uses structured fields when present', () => {
    const meta = resolveSlideEventMeta({
      role: 'body',
      title: 'Концерт',
      event_datetime: '7 июня, 19:00',
      event_venue: 'Клуб «Город»',
      event_price: 'от 500₽',
      bullets: ['Живой звук и атмосфера.'],
    })
    expect(meta).toEqual({
      datetime: '7 июня, 19:00',
      venue: 'Клуб «Город»',
      price: 'от 500₽',
      theses: ['Живой звук и атмосфера.'],
    })
  })

  it('falls back to bullet parsing for legacy slides', () => {
    const meta = resolveSlideEventMeta({
      role: 'body',
      title: 'Бранч',
      bullets: ['7 июня с 11:00', 'Кафе Эфир', '500 ₽', 'Бранч с музыкой.'],
    })
    expect(meta.datetime).toBe('7 июня с 11:00')
    expect(meta.venue).toBe('Кафе Эфир')
    expect(meta.price).toBe('500 ₽')
    expect(meta.theses).toEqual(['Бранч с музыкой.'])
  })
})

describe('groqCarouselSlideMap', () => {
  it('maps groq middle slide into event fields + thesis', () => {
    const slide = mapGroqPayloadToCarouselSlide(
      {
        type: 'middle',
        title: '🎤 Антоха МС',
        event_datetime: 'Пятница, 19:00',
        event_venue: 'Клуб Город',
        event_price: 'от 500₽',
        text: 'Живой концерт в центре.',
      },
      'body',
    )
    expect(slide.event_datetime).toBe('Пятница, 19:00')
    expect(slide.event_venue).toBe('Клуб Город')
    expect(slide.event_price).toBe('от 500₽')
    expect(slide.bullets).toEqual(['Живой концерт в центре.'])
  })
})
