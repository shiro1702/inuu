import type { ParseAttempt } from '~/server/utils/ai/groqEventParserTypes'

export type { ParseAttempt }

export function isGroqRateLimitError(err: unknown): boolean {
  const e = err as { status?: number; statusCode?: number; message?: string }
  const status = e?.status ?? e?.statusCode
  if (status === 429) return true
  const msg = String(e?.message || '').toLowerCase()
  return msg.includes('429') || msg.includes('rate limit') || msg.includes('rate_limit')
}

export function isGroqForbiddenError(err: unknown): boolean {
  const e = err as { status?: number; statusCode?: number; message?: string }
  const status = e?.status ?? e?.statusCode
  if (status === 401 || status === 403) return true
  const msg = String(e?.message || '').toLowerCase()
  return msg.includes('forbidden') || msg.includes('invalid api key') || msg.includes('unauthorized')
}

export function groqErrorHint(err: unknown): string {
  if (isGroqForbiddenError(err)) {
    return 'Groq отклонил запрос (403): проверьте NUXT_GROQ_API_KEY в .env и лимиты на console.groq.com'
  }
  if (isGroqRateLimitError(err)) {
    return 'Groq rate limit — повторите через минуту или используйте режим «Разбить текст»'
  }
  return err instanceof Error ? err.message : 'Groq request failed'
}

export class GroqParseExhaustedError extends Error {
  readonly rateLimited: boolean
  readonly attempts: ParseAttempt[]
  readonly modelsTried: string[]

  constructor(args: {
    message: string
    rateLimited: boolean
    attempts: ParseAttempt[]
    modelsTried: string[]
  }) {
    super(args.message)
    this.name = 'GroqParseExhaustedError'
    this.rateLimited = args.rateLimited
    this.attempts = args.attempts
    this.modelsTried = args.modelsTried
  }
}
