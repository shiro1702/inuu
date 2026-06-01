import { describe, expect, it } from 'vitest'
import type { EventParseResult } from '../server/utils/ai/eventParseSchema'
import { filterUpcomingEvents, isEventEntirelyInPast } from '../server/utils/eventStartsAt'

function eventWithDates(dates: string[]): EventParseResult {
  return {
    title: 'Тест',
    description_short: 'Краткое описание события для теста',
    description_full: 'Полное описание события для теста фильтра дат',
    description: 'Полное описание события для теста фильтра дат',
    cover_media_url: null,
    city_slug: 'ulan-ude',
    event_kind: 'event',
    category_slug: null,
    venue: { name: null, address: null },
    organization: { name: null },
    source: { kind: 'web_cron', url: null, external_id: null },
    is_free: true,
    price_from: null,
    capacity: null,
    registration_url: null,
    topic_tags: ['culture'],
    recurrence: { rule: 'none', dates },
    confidence: 0.9,
    missing_fields: [],
  }
}

describe('isEventEntirelyInPast', () => {
  it('returns true when all dates are in the past', () => {
    const ev = eventWithDates(['2020-01-15'])
    expect(isEventEntirelyInPast(ev, 'Asia/Irkutsk')).toBe(true)
  })

  it('returns false when at least one date is upcoming', () => {
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const ev = eventWithDates(['2020-01-15', future.toISOString()])
    expect(isEventEntirelyInPast(ev, 'Asia/Irkutsk')).toBe(false)
  })

  it('returns false when dates are missing', () => {
    const ev = eventWithDates([])
    expect(isEventEntirelyInPast(ev, 'Asia/Irkutsk')).toBe(false)
  })

  it('filterUpcomingEvents keeps future-only items', () => {
    const future = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const items = filterUpcomingEvents([
      eventWithDates(['2020-05-01']),
      eventWithDates([future.toISOString().slice(0, 10)]),
    ])
    expect(items).toHaveLength(1)
  })
})
