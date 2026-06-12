import { describe, expect, it } from 'vitest'
import { formatDigestWeekRange } from '~/utils/eventDigestWeek'

describe('formatDigestWeekRange', () => {
  it('formats same-month week range', () => {
    const label = formatDigestWeekRange(new Date('2026-06-05T12:00:00Z'), 'Asia/Irkutsk')
    expect(label).toMatch(/июн/)
    expect(label).toContain('–')
  })
})
