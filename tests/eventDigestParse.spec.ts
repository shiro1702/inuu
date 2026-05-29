import { describe, expect, it } from 'vitest'
import { detectPreferDigest } from '../server/utils/ai/eventParseSchema'
import { extractUrls } from '../server/utils/contentUrlEnricher'

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

describe('extractUrls', () => {
  it('extracts http urls from text', () => {
    const urls = extractUrls('Смотри https://example.com/afisha и http://test.org')
    expect(urls).toEqual(['https://example.com/afisha', 'http://test.org'])
  })
})
