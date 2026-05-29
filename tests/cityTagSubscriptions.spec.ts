import { describe, expect, it } from 'vitest'
import { tagsCoverSelection } from '../utils/cityTagSubscriptions'

describe('tagsCoverSelection', () => {
  it('returns true when all selected tags are subscribed', () => {
    expect(tagsCoverSelection(['food', 'culture', 'family'], ['food', 'culture'])).toBe(true)
  })

  it('returns false when a selected tag is missing', () => {
    expect(tagsCoverSelection(['food'], ['food', 'culture'])).toBe(false)
  })

  it('returns false for empty selection', () => {
    expect(tagsCoverSelection(['food'], [])).toBe(false)
  })
})
