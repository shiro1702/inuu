import { describe, expect, it } from 'vitest'
import {
  eventDigestBodyCtaLabel,
  eventDigestCityHandle,
  eventDigestCtaLabelFromVenue,
  eventDigestDateTimeBadges,
  eventDigestDescription,
  eventDigestHeadline,
  eventDigestMetaBadges,
  eventDigestPriceBadges,
  eventDigestTheses,
  eventDigestTitleLines,
  eventDigestVenueBadges,
  isEventDigestMetaLine,
} from '~/utils/eventDigestSlide'

describe('eventDigestSlide', () => {
  it('builds city handle from link', () => {
    expect(eventDigestCityHandle('/ulan-ude/events')).toBe('in.ulanude')
  })

  it('builds city handle from slug or transliterated name', () => {
    expect(eventDigestCityHandle(undefined, undefined, 'ulan-ude')).toBe('in.ulanude')
    expect(eventDigestCityHandle(undefined, 'Улан-Удэ')).toBe('in.ulanude')
  })

  it('prefixes headline with «На»', () => {
    expect(eventDigestHeadline('🍳 Летний бранч в кафе Эфир')).toBe(
      'На летний бранч в кафе Эфир',
    )
  })

  it('splits long cover title into two lines', () => {
    const lines = eventDigestTitleLines('Куда сходить на этой неделе')
    expect(lines.length).toBe(2)
  })

  it('treats thesis lines as text, not meta badges', () => {
    const thesis = 'Четыре остановки для тёплого вечера в Улан-Удэ.'
    expect(isEventDigestMetaLine(thesis)).toBe(false)
    expect(eventDigestTheses([thesis])).toEqual([thesis])
    expect(eventDigestDateTimeBadges([thesis])).toEqual([])
    expect(eventDigestVenueBadges([thesis])).toEqual([])
  })

  it('maps event bullets to datetime, venue, price and thesis', () => {
    const bullets = [
      '7 июня с 11:00',
      'Кафе Эфир',
      '500 ₽',
      'Бранч с музыкой и десертами.',
    ]
    expect(eventDigestDateTimeBadges(bullets)).toEqual(['7 июня с 11:00'])
    expect(eventDigestVenueBadges(bullets)).toEqual(['Кафе Эфир'])
    expect(eventDigestPriceBadges(bullets)).toEqual(['500 ₽'])
    expect(eventDigestTheses(bullets)).toEqual(['Бранч с музыкой и десертами.'])
    expect(eventDigestMetaBadges(bullets)).toEqual([
      '7 июня с 11:00',
      'Кафе Эфир',
      '500 ₽',
    ])
    expect(eventDigestDescription(bullets)).toBe('Бранч с музыкой и десертами.')
  })

  it('splits combined time+price line into separate groups', () => {
    const line = '19:00, от 500₽'
    expect(eventDigestDateTimeBadges([line])).toEqual(['19:00'])
    expect(eventDigestPriceBadges([line])).toEqual(['от 500₽'])
    expect(eventDigestVenueBadges([line])).toEqual([])
    expect(eventDigestTheses([line])).toEqual([])
  })

  it('classifies weekday range and booking line', () => {
    const bullets = ['Дегустационный сет из 5 блюд', 'Бронь по телефону', 'Пятница–воскресенье']
    expect(eventDigestDateTimeBadges(bullets)).toEqual(['Пятница–воскресенье'])
    expect(eventDigestVenueBadges(bullets)).toEqual([])
    expect(eventDigestTheses(bullets)).toEqual(['Дегустационный сет из 5 блюд'])
  })

  it('uses explicit cta on body slide', () => {
    expect(
      eventDigestBodyCtaLabel({
        role: 'body',
        cta_text: 'Бронь по телефону',
      }),
    ).toBe('Бронь по телефону')
    expect(eventDigestCtaLabelFromVenue('Кафе Эфир')).toBe('Подробнее')
    expect(eventDigestCtaLabelFromVenue('Бронь по телефону')).toBe('Бронь по телефону')
  })
})
