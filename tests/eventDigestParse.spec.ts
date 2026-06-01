import { describe, expect, it } from 'vitest'
import { detectPreferDigest, eventParseResultSchema } from '../server/utils/ai/eventParseSchema'
import { extractUrls } from '../server/utils/contentUrlEnricher'
import { coerceEventParsePayload } from '../server/utils/eventParseDescriptions'

describe('detectPreferDigest', () => {
  it('detects weekly afisha keywords', () => {
    expect(detectPreferDigest('Афиша на неделю: концерт и выставка')).toBe(true)
  })

  it('detects numbered lists with dates', () => {
    const text = [
      '1. Концерт — 15.06 19:00',
      '2. Спектакль — 16.06 11:00',
      '3. Ярмарка — 17.06 12:00',
    ].join('\n')
    expect(detectPreferDigest(text)).toBe(true)
  })

  it('returns false for single event', () => {
    expect(detectPreferDigest('15 июня гончарный мастер-класс в 11:00')).toBe(false)
  })
})

describe('coerceEventParsePayload', () => {
  it('fills null title and is_free from LLM output', () => {
    const coerced = coerceEventParsePayload({
      title: null,
      description_full: 'Открытый микрофон 28 апреля в 19:30, вход 250₽',
      is_free: null,
      source: { kind: 'web_cron' },
    })
    const parsed = eventParseResultSchema.parse({
      ...coerced,
      event_kind: 'event',
      source: {
        kind: 'web_cron',
        url: 'https://t.me/standuuup2u/1',
        external_id: 'tgweb:standuuup2u:1',
      },
      topic_tags: ['culture'],
      missing_fields: [],
    })
    expect(parsed.title.length).toBeGreaterThanOrEqual(3)
    expect(typeof parsed.is_free).toBe('boolean')
  })
})

describe('extractUrls', () => {
  it('extracts http urls from text', () => {
    const urls = extractUrls('Смотри https://example.com/afisha и http://test.org')
    expect(urls).toEqual(['https://example.com/afisha', 'http://test.org'])
  })
})
