import { describe, expect, it } from 'vitest'
import { parsedSourceKeyFromUrl } from '../server/utils/ingestSourceDisplayName'

describe('parsedSourceKeyFromUrl', () => {
  it('maps telegram channel urls to t.me/key', () => {
    expect(parsedSourceKeyFromUrl('https://t.me/s/standuuup2u')).toBe('t.me/standuuup2u')
    expect(parsedSourceKeyFromUrl('https://t.me/standuuup2u/123')).toBe('t.me/standuuup2u')
  })

  it('maps website hostnames', () => {
    expect(parsedSourceKeyFromUrl('https://www.example.com/events')).toBe('example.com')
  })
})
