import { describe, expect, it } from 'vitest'
import {
  filterTagGroupsByUsedSlugs,
  filterTaxonomyByUsedSlugs,
  parseContentTagUsageScope,
} from '../utils/cityContentTagsInUse'

describe('parseContentTagUsageScope', () => {
  it('accepts known scopes', () => {
    expect(parseContentTagUsageScope('events')).toBe('events')
    expect(parseContentTagUsageScope('EDITORIAL')).toBe('editorial')
    expect(parseContentTagUsageScope(' venues ')).toBe('venues')
    expect(parseContentTagUsageScope('all')).toBe('all')
  })

  it('rejects unknown scope', () => {
    expect(parseContentTagUsageScope('news')).toBeNull()
    expect(parseContentTagUsageScope('')).toBeNull()
  })
})

describe('filterTaxonomyByUsedSlugs', () => {
  const items = [
    { slug: 'culture', name: 'Культура' },
    { slug: 'sport', name: 'Спорт' },
    { slug: 'food', name: 'Еда' },
  ]

  it('keeps only tags present in city content', () => {
    const used = new Set(['culture', 'food'])
    expect(filterTaxonomyByUsedSlugs(items, used).map((t) => t.slug)).toEqual(['culture', 'food'])
  })

  it('returns empty list when nothing is in use', () => {
    expect(filterTaxonomyByUsedSlugs(items, new Set())).toEqual([])
  })
})

describe('filterTagGroupsByUsedSlugs', () => {
  it('drops empty groups and unused tags', () => {
    const groups = [
      {
        id: 'vibes' as const,
        label: 'Вайбы',
        items: [
          { slug: 'chill', name: 'Чилл', tagGroup: 'vibes' },
          { slug: 'drive', name: 'Драйв', tagGroup: 'vibes' },
        ],
      },
      {
        id: 'legacy' as const,
        label: 'Темы',
        items: [{ slug: 'culture', name: 'Культура', tagGroup: 'legacy' }],
      },
    ]
    const used = new Set(['chill', 'culture'])
    const filtered = filterTagGroupsByUsedSlugs(groups, used)
    expect(filtered).toHaveLength(2)
    expect(filtered[0].items.map((t) => t.slug)).toEqual(['chill'])
    expect(filtered[1].items.map((t) => t.slug)).toEqual(['culture'])
  })
})
