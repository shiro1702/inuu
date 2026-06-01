import Groq from 'groq-sdk'
import { createError } from 'h3'
import {
  detectPreferDigest,
  eventDigestParseResultSchema,
  eventParseInputSchema,
  eventParseResultSchema,
  type EventDigestParseResult,
  type EventParseInput,
  type EventParseResult,
} from '~/server/utils/ai/eventParseSchema'
import { slugifyTaxonomy } from '~/server/utils/cityContentTaxonomy'
import { buildEventParseSystemPrompt } from '~/server/utils/ai/eventParsePrompt'
import {
  coerceEventParsePayload,
  normalizeEventParseDescriptions,
} from '~/server/utils/eventParseDescriptions'

type ParseAttempt = {
  ok: boolean
  attempt: number
  raw?: string
  error?: string
  usage?: {
    promptTokens: number | null
    completionTokens: number | null
    totalTokens: number | null
  }
}

type ParseOutput = {
  result: EventParseResult
  attempts: ParseAttempt[]
  model: string
  latencyMs: number
}

export type EventsParseOutput = {
  result: EventDigestParseResult
  attempts: ParseAttempt[]
  model: string
  latencyMs: number
}

const SINGLE_EVENT_SHAPE = {
  title: 'string',
  description_short: 'string',
  description_full: 'string',
  cover_media_url: 'string|null',
  city_slug: 'string|null',
  event_kind: 'event|masterclass|news',
  category_slug: 'string|null',
  venue: { name: 'string|null', address: 'string|null' },
  organization: { name: 'string|null' },
  source: {
    kind: 'bot_submit|telegram_parse|manual_editor|web_cron',
    url: 'string|null',
    external_id: 'string|null',
  },
  is_free: false,
  price_from: 0,
  capacity: null,
  registration_url: 'string|null',
  topic_tags: ['culture'],
  recurrence: {
    rule: 'none|daily|weekly|monthly|custom',
    dates: ['2026-06-15T11:00:00+08:00'],
  },
  confidence: 0.8,
  missing_fields: ['capacity'],
}

function buildSystemPrompt(input: EventParseInput) {
  return buildEventParseSystemPrompt(input)
}

function buildUserPrompt(input: EventParseInput) {
  const timezone = input.timezone || 'Asia/Irkutsk'
  const citySlug = input.citySlug || null
  const sourceUrl = input.sourceUrl || null
  const sourceExternalId = input.sourceExternalId || null
  const hints = input.hints || {}
  const tagsHint = Array.isArray(hints.availableTags) && hints.availableTags.length
    ? `KNOWN_TAGS: ${JSON.stringify(hints.availableTags)}`
    : ''
  const categoriesHint = Array.isArray(hints.availableCategories) && hints.availableCategories.length
    ? `KNOWN_CATEGORIES: ${JSON.stringify(hints.availableCategories)}`
    : ''

  return [
    'Верни JSON строго по этой форме:',
    JSON.stringify({
      parse_kind: 'single|digest',
      digest: {
        title: 'string|null',
        period: 'week|month|null',
        period_start: 'string|null',
        period_end: 'string|null',
      },
      events: [SINGLE_EVENT_SHAPE],
    }),
    '',
    `CONTEXT: timezone=${timezone}`,
    `CONTEXT: source.kind=${input.sourceKind}`,
    `CONTEXT: source.url=${sourceUrl}`,
    `CONTEXT: source.external_id=${sourceExternalId}`,
    `CONTEXT: city_slug=${citySlug}`,
    `CONTEXT: hints=${JSON.stringify({ categorySlug: hints.categorySlug, topicTags: hints.topicTags, preferDigest: hints.preferDigest })}`,
    tagsHint,
    categoriesHint,
    '',
    'INPUT_TEXT:',
    input.rawText,
  ].join('\n')
}

function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim()
  if (!trimmed) throw new Error('Empty LLM response')
  try {
    return JSON.parse(trimmed)
  } catch {
    const start = trimmed.indexOf('{')
    const end = trimmed.lastIndexOf('}')
    if (start === -1 || end === -1 || end <= start) {
      throw new Error('No JSON object found')
    }
    return JSON.parse(trimmed.slice(start, end + 1))
  }
}

function normalizeResult(result: EventParseResult): EventParseResult {
  const normalizedTags = Array.from(
    new Set(
      (result.topic_tags || [])
        .map((tag) => slugifyTaxonomy(tag))
        .filter((tag) => tag.length >= 2),
    ),
  ).slice(0, 5)

  return normalizeEventParseDescriptions({
    ...result,
    topic_tags: normalizedTags,
    category_slug: result.category_slug ? slugifyTaxonomy(result.category_slug) : null,
    source: {
      ...result.source,
      kind: result.source?.kind || 'telegram_parse',
      url: result.source.url || null,
      external_id: result.source.external_id || null,
    },
  })
}

function coerceDigestPayload(raw: unknown, input: EventParseInput): unknown {
  if (!raw || typeof raw !== 'object') return raw
  const o = raw as Record<string, unknown>

  if (Array.isArray(o.events) && o.events.length > 0) {
    return {
      parse_kind: o.parse_kind === 'digest' ? 'digest' : (o.events.length > 1 ? 'digest' : 'single'),
      digest: o.digest ?? null,
      events: o.events.map((ev) => coerceEventParsePayload(ev)),
    }
  }

  if (typeof o.title === 'string') {
    return {
      parse_kind: 'single',
      digest: null,
      events: [coerceEventParsePayload(o)],
    }
  }

  return raw
}

function applyInputSourceDefaults(event: EventParseResult, input: EventParseInput): EventParseResult {
  return normalizeResult({
    ...event,
    city_slug: event.city_slug || input.citySlug || null,
    source: {
      kind: input.sourceKind,
      url: event.source?.url || input.sourceUrl || null,
      external_id: event.source?.external_id || input.sourceExternalId || null,
    },
  })
}

function normalizeDigestResult(raw: EventDigestParseResult, input: EventParseInput): EventDigestParseResult {
  const events = raw.events.map((ev) => applyInputSourceDefaults(ev, input))
  let parseKind = raw.parse_kind
  if (events.length > 1 && parseKind === 'single') {
    parseKind = 'digest'
  }
  if (events.length === 1 && parseKind === 'digest' && !raw.digest?.title) {
    parseKind = 'single'
  }
  return {
    parse_kind: parseKind,
    digest: raw.digest,
    events,
  }
}

async function runSingleAttempt(args: {
  client: Groq
  model: string
  input: EventParseInput
  attempt: number
}): Promise<{
  parsed: EventDigestParseResult
  raw: string
  usage: { promptTokens: number | null; completionTokens: number | null; totalTokens: number | null }
}> {
  const completion = await args.client.chat.completions.create({
    model: args.model,
    temperature: 0,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: buildSystemPrompt(args.input) },
      { role: 'user', content: buildUserPrompt(args.input) },
    ],
  })

  const raw = completion.choices[0]?.message?.content || ''
  const json = extractJsonObject(raw)
  const coerced = coerceDigestPayload(json, args.input)
  const parsed = eventDigestParseResultSchema.parse(coerced)
  const usage = completion.usage
  return {
    parsed: normalizeDigestResult(parsed, args.input),
    raw,
    usage: {
      promptTokens: typeof usage?.prompt_tokens === 'number' ? usage.prompt_tokens : null,
      completionTokens: typeof usage?.completion_tokens === 'number' ? usage.completion_tokens : null,
      totalTokens: typeof usage?.total_tokens === 'number' ? usage.total_tokens : null,
    },
  }
}

export async function parseEventsWithGroq(inputRaw: EventParseInput): Promise<EventsParseOutput> {
  const startedAt = Date.now()
  const preferDigest = detectPreferDigest(inputRaw.rawText || '')
  const input = eventParseInputSchema.parse({
    ...inputRaw,
    hints: {
      ...(inputRaw.hints || {}),
      preferDigest: inputRaw.hints?.preferDigest ?? preferDigest,
    },
  })
  const config = useRuntimeConfig()
  const apiKey = String(config.groqApiKey || '').trim()
  const model = String(config.groqModel || '').trim() || 'llama-3.3-70b-versatile'

  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_GROQ_API_KEY is not configured' })
  }

  const client = new Groq({ apiKey })
  const attempts: ParseAttempt[] = []
  const maxAttempts = 2

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const { parsed, raw, usage } = await runSingleAttempt({ client, model, input, attempt })
      attempts.push({ ok: true, attempt, raw, usage })
      return { result: parsed, attempts, model, latencyMs: Date.now() - startedAt }
    } catch (error: any) {
      attempts.push({
        ok: false,
        attempt,
        error: error?.message ? String(error.message) : 'Unknown parse error',
      })
    }
  }

  throw createError({
    statusCode: 422,
    statusMessage: `Failed to parse event payload after ${maxAttempts} attempts`,
    data: { attempts },
  })
}

/** Backward-compatible single-event parser. */
export async function parseEventWithGroq(inputRaw: EventParseInput): Promise<ParseOutput> {
  const output = await parseEventsWithGroq(inputRaw)
  const first = output.result.events[0]
  if (!first) {
    throw createError({ statusCode: 422, statusMessage: 'No events parsed' })
  }
  return {
    result: first,
    attempts: output.attempts,
    model: output.model,
    latencyMs: output.latencyMs,
  }
}
