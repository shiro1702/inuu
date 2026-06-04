import { describe, expect, it } from 'vitest'
import { buildCarouselFromEvents } from '~/utils/buildCarouselFromEvents'

describe('buildCarouselFromEvents', () => {
  it('builds cover, one body per event, and outro', () => {
    const carousel = buildCarouselFromEvents({
      citySlug: 'ulan-ude',
      cityName: 'Улан-Удэ',
      timezone: 'Asia/Irkutsk',
      coverTitle: 'На выходные',
      events: [
        {
          title: 'Концерт',
          slug: 'kontsert',
          startsAt: '2026-06-10T12:00:00.000Z',
          venueTitle: 'Клуб',
          price: 500,
          currency: 'RUB',
        },
        {
          title: 'Выставка',
          slug: 'vystavka',
          startsAt: '2026-06-11T08:00:00.000Z',
          excerpt: 'Современное искусство',
        },
      ],
    })

    expect(carousel.slides[0]?.role).toBe('cover')
    expect(carousel.slides[0]?.title).toBe('На выходные')
    expect(carousel.slides.filter((s) => s.role === 'body')).toHaveLength(2)
    expect(carousel.slides.at(-1)?.role).toBe('outro')
    expect(carousel.slides[1]?.bullets?.length).toBeGreaterThan(0)
  })
})
