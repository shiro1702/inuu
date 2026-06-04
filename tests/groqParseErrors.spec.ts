import { describe, expect, it } from 'vitest'
import { GroqParseExhaustedError, isGroqRateLimitError } from '../server/utils/ai/groqParseErrors'

describe('groqParseErrors', () => {
  it('detects HTTP 429', () => {
    expect(isGroqRateLimitError({ status: 429, message: 'Too Many Requests' })).toBe(true)
  })

  it('detects rate limit message', () => {
    expect(isGroqRateLimitError(new Error('Rate limit reached for model'))).toBe(true)
  })

  it('GroqParseExhaustedError exposes rateLimited flag', () => {
    const err = new GroqParseExhaustedError({
      message: 'limit',
      rateLimited: true,
      attempts: [{ ok: false, attempt: 1, model: 'a', error: '429' }],
      modelsTried: ['a', 'b'],
    })
    expect(err.rateLimited).toBe(true)
    expect(err.modelsTried).toEqual(['a', 'b'])
  })
})
