import type { EventParseResult } from '~/server/utils/ai/eventParseSchema'

const SHORT_MAX = 280

export function coerceEventParsePayload(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object') return raw
  const o = raw as Record<string, unknown>
  const full = String(o.description_full || o.description || '').trim()
  let short = String(o.description_short || '').trim()
  if (!short && full) {
    short = full.length <= SHORT_MAX ? full : `${full.slice(0, SHORT_MAX - 1).trim()}…`
  }
  const cover = typeof o.cover_media_url === 'string' && o.cover_media_url.trim()
    ? o.cover_media_url.trim()
    : null

  return {
    ...o,
    description_full: full,
    description_short: short,
    description: full,
    cover_media_url: cover,
  }
}

export function normalizeEventParseDescriptions(result: EventParseResult): EventParseResult {
  const full = String(result.description_full || result.description || '').trim()
  let short = String(result.description_short || '').trim()
  if (!short && full) {
    short = full.length <= SHORT_MAX ? full : `${full.slice(0, SHORT_MAX - 1).trim()}…`
  }
  return {
    ...result,
    description_full: full,
    description_short: short,
    description: full,
    cover_media_url: result.cover_media_url || null,
  }
}

export function resolveSubmissionDescriptions(payload: Record<string, unknown>): {
  descriptionShort: string
  descriptionFull: string
} {
  const full = String(payload.description_full || payload.description || '').trim()
  let short = String(payload.description_short || '').trim()
  if (!short && full) {
    short = full.length <= SHORT_MAX ? full : `${full.slice(0, SHORT_MAX - 1).trim()}…`
  }
  return { descriptionShort: short, descriptionFull: full }
}

export function formatDescriptionsForModeration(payload: Record<string, unknown>): string[] {
  const { descriptionShort, descriptionFull } = resolveSubmissionDescriptions(payload)
  const lines = [
    `📝 Кратко (карточка):\n${descriptionShort || '—'}`,
    `📄 Полностью (страница):\n${descriptionFull || '—'}`,
  ]
  const cover = typeof payload.cover_media_url === 'string' ? payload.cover_media_url.trim() : ''
  if (cover) lines.push(`🖼 Обложка: ${cover}`)
  else lines.push('🖼 Обложка: не загружена')
  return lines
}
