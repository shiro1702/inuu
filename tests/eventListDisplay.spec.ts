import { describe, expect, it } from 'vitest'
import {
  addCalendarDays,
  filterEventsByDateRange,
} from '../utils/eventDateFilters'
import {
  filterEventsByTag,
  filterEventsByTags,
  parseTagSlugsFromQuery,
  prepareEventsListForDisplay,
  sortEventsByImportance,
} from '../utils/eventListDisplay'

describe('sortEventsByImportance', () => {
  it('puts promoted events first, then by date', () => {
    const rows = [
      { id: '1', starts_at: '2026-06-01T10:00:00Z', is_promoted: false },
      { id: '2', starts_at: '2026-06-02T10:00:00Z', is_promoted: true },
      { id: '3', starts_at: '2026-05-30T10:00:00Z', is_promoted: true },
    ]
    const sorted = sortEventsByImportance(rows)
    expect(sorted.map((r) => r.id)).toEqual(['3', '2', '1'])
  })
})

describe('prepareEventsListForDisplay', () => {
  it('dedupes series and counts dates', () => {
    const rows = [
      { id: '1', series_slug: 'mk-pottery', starts_at: '2026-06-01T10:00:00Z', is_promoted: false },
      { id: '2', series_slug: 'mk-pottery', starts_at: '2026-06-08T10:00:00Z', is_promoted: false },
      { id: '3', starts_at: '2026-06-03T10:00:00Z', is_promoted: false },
    ]
    const items = prepareEventsListForDisplay(rows, 10)
    expect(items).toHaveLength(2)
    expect(items[0].series_date_count).toBe(2)
    expect(items[1].series_date_count).toBe(1)
  })
})

describe('parseTagSlugsFromQuery', () => {
  it('parses repeated tag query params', () => {
    expect(parseTagSlugsFromQuery(['food', 'culture', 'food'])).toEqual(['food', 'culture'])
    expect(parseTagSlugsFromQuery('food')).toEqual(['food'])
  })
})

describe('filterEventsByTags', () => {
  it('filters by topic_tags with OR logic', () => {
    const rows = [
      { id: '1', starts_at: '2026-06-01T10:00:00Z', source_metadata: { topic_tags: ['food'] } },
      { id: '2', starts_at: '2026-06-02T10:00:00Z', source_metadata: { topic_tags: ['culture'] } },
      { id: '3', starts_at: '2026-06-03T10:00:00Z', source_metadata: { topic_tags: ['sport'] } },
    ]
    expect(filterEventsByTags(rows, ['food', 'culture']).map((r) => r.id)).toEqual(['1', '2'])
  })

  it('keeps backward-compatible single-tag helper', () => {
    const rows = [
      { id: '1', starts_at: '2026-06-01T10:00:00Z', source_metadata: { topic_tags: ['food'] } },
      { id: '2', starts_at: '2026-06-02T10:00:00Z', source_metadata: { topic_tags: ['culture'] } },
    ]
    expect(filterEventsByTag(rows, 'food')).toHaveLength(1)
  })
})

describe('filterEventsByDateRange', () => {
  it('filters by zoned calendar day', () => {
    const rows = [
      { id: '1', starts_at: '2026-05-28T16:00:00Z' },
      { id: '2', starts_at: '2026-05-29T16:00:00Z' },
    ]
    const filtered = filterEventsByDateRange(rows, '2026-05-29', '2026-05-29', 'Asia/Irkutsk')
    expect(filtered.map((r) => r.id)).toEqual(['1'])
  })
})

describe('addCalendarDays', () => {
  it('adds days to iso date', () => {
    expect(addCalendarDays('2026-05-29', 1)).toBe('2026-05-30')
  })
})
