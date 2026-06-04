import { describe, expect, it } from 'vitest'
import {
  eventStatusFromIngest,
  normalizeUpdateKind,
} from '../server/utils/eventLifecycleStatus'

describe('eventLifecycleStatus', () => {
  it('maps cancellation to cancelled', () => {
    expect(eventStatusFromIngest('cancellation', null)).toBe('cancelled')
  })

  it('maps update + sold_out', () => {
    expect(eventStatusFromIngest('update', 'sold_out')).toBe('sold_out')
  })

  it('maps update + reschedule to postponed', () => {
    expect(eventStatusFromIngest('update', 'reschedule')).toBe('postponed')
  })

  it('normalizes update_kind aliases', () => {
    expect(normalizeUpdateKind('sold-out')).toBe('sold_out')
    expect(normalizeUpdateKind('postpone')).toBe('reschedule')
  })
})
