import { describe, expect, it } from 'vitest'
import { eventTopicTagsMatchInterest } from '../utils/cityTopicBroadcastMatch'

describe('eventTopicTagsMatchInterest', () => {
  it('matches all subscribers when interest tags are empty', () => {
    expect(eventTopicTagsMatchInterest(['culture'], [])).toBe(true)
  })

  it('matches when event has no tags (broadcast to interested subscribers)', () => {
    expect(eventTopicTagsMatchInterest([], ['culture'])).toBe(true)
  })

  it('matches on tag intersection', () => {
    expect(eventTopicTagsMatchInterest(['culture', 'food'], ['food'])).toBe(true)
    expect(eventTopicTagsMatchInterest(['culture'], ['food'])).toBe(false)
  })
})
