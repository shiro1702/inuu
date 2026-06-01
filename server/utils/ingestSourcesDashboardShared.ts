import { createError } from 'h3'
import { resolveTelegramWebPreviewUrl } from '~/server/utils/telegramWebPreview'

export const INGEST_CONTEXT_TYPES = [
  'club',
  'theater',
  'standup',
  'library',
  'museum',
  'cinema',
  'general',
] as const

export type IngestContextType = (typeof INGEST_CONTEXT_TYPES)[number]

export function normalizeWebSourceUrl(input: string): string {
  const trimmed = input.trim()
  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid URL' })
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw createError({ statusCode: 400, statusMessage: 'URL must be http or https' })
  }
  parsed.hash = ''
  const telegramPreview = resolveTelegramWebPreviewUrl(parsed.toString())
  if (telegramPreview) return telegramPreview
  return parsed.toString().replace(/\/$/, '')
}

export function normalizeTelegramSourceKey(input: string): string {
  const key = input.trim().replace(/^@+/, '').toLowerCase()
  if (!/^[a-z0-9_]{3,64}$/.test(key)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Telegram source key' })
  }
  return key
}

export function normalizeContextTypeForSource(value: unknown): IngestContextType {
  const raw = String(value || 'general').trim().toLowerCase()
  if ((INGEST_CONTEXT_TYPES as readonly string[]).includes(raw)) {
    return raw as IngestContextType
  }
  return 'general'
}
