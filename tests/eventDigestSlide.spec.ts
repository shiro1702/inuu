import { describe, expect, it } from 'vitest'
import {
  eventDigestCityHandle,
  eventDigestDescription,
  eventDigestHeadline,
  eventDigestMetaBadges,
  eventDigestTheses,
  eventDigestTitleLines,
  isEventDigestMetaLine,
} from '~/utils/eventDigestSlide'

describe('eventDigestSlide', () => {
  it('builds city handle from link', () => {
    expect(eventDigestCityHandle('/ulan-ude/events')).toBe('in.ulanude')
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
    expect(eventDigestMetaBadges([thesis])).toEqual([])
    expect(eventDigestTheses([thesis])).toEqual([thesis])
  })

  it('maps event bullets to meta badges and description', () => {
    const bullets = [
      '7 июня с 11:00',
      'Кафе Эфир',
      '500 ₽',
      'Бранч с музыкой и десертами.',
    ]
    expect(eventDigestMetaBadges(bullets)).toEqual(['7 июня с 11:00', 'Кафе Эфир'])
    expect(eventDigestTheses(bullets)).toEqual(['Бранч с музыкой и десертами.'])
    expect(eventDigestDescription(bullets)).toBe('Бранч с музыкой и десертами.')
  })
})
