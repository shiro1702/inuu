import { describe, expect, it } from 'vitest'
import {
  ingestPostTypeLabel,
  moderationStatusForPostType,
  normalizeIngestPostType,
  shouldSkipPersistForPostType,
} from '../server/utils/eventIngestPostType'
import { eventDigestParseResultSchema } from '../server/utils/ai/eventParseSchema'

describe('eventIngestPostType', () => {
  it('normalizes aliases', () => {
    expect(normalizeIngestPostType('cancel')).toBe('cancellation')
    expect(normalizeIngestPostType('sold-out')).toBe('update')
    expect(normalizeIngestPostType('not_event')).toBe('trash')
  })

  it('skips persist only for trash', () => {
    expect(shouldSkipPersistForPostType('trash')).toBe(true)
    expect(shouldSkipPersistForPostType('new_event')).toBe(false)
  })

  it('forces needs_revision for cancellation/update', () => {
    expect(moderationStatusForPostType('cancellation', 'pending')).toBe('needs_revision')
    expect(moderationStatusForPostType('update', 'pending')).toBe('needs_revision')
    expect(moderationStatusForPostType('new_event', 'pending')).toBe('pending')
  })

  it('labels cancellation for moderation cards', () => {
    expect(ingestPostTypeLabel('cancellation')).toBe('Отмена / закрытие')
  })
})

describe('eventDigestParseResultSchema', () => {
  it('accepts trash with empty events', () => {
    const parsed = eventDigestParseResultSchema.parse({
      parse_kind: 'single',
      post_type: 'trash',
      publication_date: null,
      digest: null,
      events: [],
    })
    expect(parsed.post_type).toBe('trash')
    expect(parsed.events).toHaveLength(0)
  })
})
