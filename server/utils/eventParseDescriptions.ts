import type { EventParseResult } from '~/server/utils/ai/eventParseSchema'

const SHORT_MAX = 280

function coerceBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value
  if (value === 'true' || value === 1 || value === '1') return true
  if (value === 'false' || value === 0 || value === '0') return false
  return fallback
}

function deriveTitleFromText(full: string, short: string): string {
  const candidate = (short || full).split(/\n+/).map((line) => line.trim()).find((line) => line.length >= 3)
  if (candidate) return candidate.slice(0, 160)
  return 'Событие'
}

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

  let title = String(o.title ?? '').trim()
  if (title.length < 3) {
    title = deriveTitleFromText(full, short)
  }

  const priceFrom =
    typeof o.price_from === 'number' && Number.isFinite(o.price_from) ? o.price_from : null
  const isFree = coerceBoolean(o.is_free, priceFrom === null || priceFrom === 0)

  const topicTags = Array.isArray(o.topic_tags)
    ? o.topic_tags.map((tag) => String(tag).trim()).filter((tag) => tag.length >= 2)
    : []

  const recurrenceRaw =
    o.recurrence && typeof o.recurrence === 'object'
      ? (o.recurrence as Record<string, unknown>)
      : {}
  const recurrenceDates = Array.isArray(recurrenceRaw.dates)
    ? recurrenceRaw.dates.map((d) => String(d).trim()).filter(Boolean)
    : []
  const recurrenceRule =
    typeof recurrenceRaw.rule === 'string' && recurrenceRaw.rule.trim()
      ? recurrenceRaw.rule.trim()
      : 'none'

  const venueRaw = o.venue && typeof o.venue === 'object' ? (o.venue as Record<string, unknown>) : {}
  const orgRaw =
    o.organization && typeof o.organization === 'object'
      ? (o.organization as Record<string, unknown>)
      : {}

  const confidence =
    typeof o.confidence === 'number' && Number.isFinite(o.confidence)
      ? Math.min(1, Math.max(0, o.confidence))
      : 0.6

  const missingFields = Array.isArray(o.missing_fields)
    ? o.missing_fields.map((field) => String(field).trim()).filter(Boolean)
    : []

  return {
    ...o,
    title,
    description_full: full || title,
    description_short: short || title,
    description: full || title,
    cover_media_url: cover,
    is_free: isFree,
    price_from: priceFrom,
    topic_tags: topicTags,
    recurrence: {
      rule: recurrenceRule,
      dates: recurrenceDates,
    },
    venue: {
      name: venueRaw.name == null ? null : String(venueRaw.name).trim() || null,
      address: venueRaw.address == null ? null : String(venueRaw.address).trim() || null,
    },
    organization: {
      name: orgRaw.name == null ? null : String(orgRaw.name).trim() || null,
      ...(orgRaw.id ? { id: String(orgRaw.id) } : {}),
    },
    confidence,
    missing_fields: missingFields,
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
