import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { parseEventWithGroq } from '~/server/utils/ai/groqEventParser'
import { eventParseInputSchema } from '~/server/utils/ai/eventParseSchema'
import { writeAiParseLog } from '~/server/utils/ai/aiParseLogs'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

type IngestBody = {
  rawText?: string
  sourceKind?: 'bot_submit' | 'telegram_parse' | 'manual_editor'
  sourceUrl?: string | null
  sourceExternalId?: string | null
  citySlug?: string | null
  timezone?: string | null
  hints?: {
    categorySlug?: string | null
    topicTags?: string[]
  }
  persist?: boolean
}

function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ').trim()
}

function confidenceStatus(args: { confidence: number; missingFields: string[]; hasDates: boolean }): 'pending' | 'needs_revision' {
  if (!args.hasDates) return 'needs_revision'
  if (args.missingFields.length >= 3) return 'needs_revision'
  if (args.confidence < 0.65) return 'needs_revision'
  return 'pending'
}

async function findEventDuplicates(args: {
  event: Parameters<typeof defineEventHandler>[0] extends (e: infer E) => any ? E : never
  cityId: string
  title: string
  dates: string[]
}) {
  const client = await serverSupabaseServiceRole(args.event as any)
  const sinceIso = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString()

  const { data, error } = await client
    .from('events')
    .select('id,slug,title,starts_at')
    .eq('city_id', args.cityId)
    .gte('starts_at', sinceIso)
    .order('starts_at', { ascending: true })
    .limit(300)

  if (error) {
    return { checked: false as const, items: [] as Array<{ id: string; slug: string; title: string; startsAt: string | null }> }
  }

  const targetTitle = normalizeTitle(args.title)
  const targetDates = new Set(args.dates.map((x) => x.slice(0, 10)))
  const candidates = (data ?? []).filter((row: any) => {
    const rowTitle = normalizeTitle(String(row.title || ''))
    const titleHit = rowTitle === targetTitle || rowTitle.includes(targetTitle) || targetTitle.includes(rowTitle)
    const rowDate = typeof row.starts_at === 'string' ? row.starts_at.slice(0, 10) : ''
    const dateHit = rowDate ? targetDates.has(rowDate) : false
    return titleHit && dateHit
  })

  return {
    checked: true as const,
    items: candidates.map((row: any) => ({
      id: String(row.id),
      slug: String(row.slug || ''),
      title: String(row.title || ''),
      startsAt: typeof row.starts_at === 'string' ? row.starts_at : null,
    })),
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody<IngestBody>(event).catch(() => ({}))
  const parsedInput = eventParseInputSchema.safeParse({
    rawText: body.rawText,
    sourceKind: body.sourceKind,
    sourceUrl: body.sourceUrl,
    sourceExternalId: body.sourceExternalId,
    citySlug: body.citySlug,
    timezone: body.timezone,
    hints: body.hints,
  })

  if (!parsedInput.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ingest payload',
      data: parsedInput.error.flatten(),
    })
  }

  const parseOutput = await parseEventWithGroq(parsedInput.data)
  const result = parseOutput.result
  const lastUsage = [...parseOutput.attempts].reverse().find((x) => x.ok && x.usage)?.usage
  const citySlug = result.city_slug || parsedInput.data.citySlug
  if (!citySlug) {
    throw createError({ statusCode: 400, statusMessage: 'city_slug is required either in input or parse result' })
  }

  const city = await resolveCityBySlug(event, citySlug)
  const duplicates = await findEventDuplicates({
    event,
    cityId: city.id,
    title: result.title,
    dates: result.recurrence.dates,
  })

  const status = confidenceStatus({
    confidence: result.confidence,
    missingFields: result.missing_fields,
    hasDates: result.recurrence.dates.length > 0,
  })
  const shouldPersist = body.persist === true

  let persisted: { ok: boolean; id: string | null; warning: string | null } = { ok: false, id: null, warning: null }
  if (shouldPersist) {
    const client = await serverSupabaseServiceRole(event)
    const insertPayload = {
      city_id: city.id,
      kind: 'event',
      status,
      payload: result,
      source_kind: result.source.kind,
      source_url: result.source.url,
      source_external_id: result.source.external_id,
      editorial_score: null,
    }

    const { data, error } = await client
      .from('content_submissions')
      .insert(insertPayload as any)
      .select('id')
      .maybeSingle()

    if (error) {
      persisted = {
        ok: false,
        id: null,
        warning: `Persist skipped: ${error.message || 'content_submissions insert failed'}`,
      }
    } else {
      persisted = {
        ok: true,
        id: data && (data as any).id ? String((data as any).id) : null,
        warning: null,
      }
    }
  }

  await writeAiParseLog(event, {
    sourceKind: result.source.kind,
    sourceUrl: result.source.url,
    sourceExternalId: result.source.external_id,
    citySlug: city.slug,
    model: parseOutput.model,
    status: shouldPersist ? (persisted.ok ? 'persisted' : 'persist_failed') : 'success',
    latencyMs: parseOutput.latencyMs,
    promptTokens: lastUsage?.promptTokens ?? null,
    completionTokens: lastUsage?.completionTokens ?? null,
    totalTokens: lastUsage?.totalTokens ?? null,
    confidence: result.confidence,
    missingFieldsCount: result.missing_fields.length,
    parseAttempts: parseOutput.attempts.length,
    errorMessage: persisted.warning,
    payload: {
      moderationStatus: status,
      duplicateCount: duplicates.items.length,
      persisted: persisted.ok,
      hasDates: result.recurrence.dates.length > 0,
      eventKind: result.event_kind,
    },
  })

  return {
    ok: true as const,
    city: {
      id: city.id,
      slug: city.slug,
      name: city.name,
      timezone: city.timezone,
    },
    parse: result,
    moderationStatus: status,
    duplicates,
    persisted,
    attempts: parseOutput.attempts.map((x) => ({
      ok: x.ok,
      attempt: x.attempt,
      error: x.error || null,
    })),
    model: parseOutput.model,
    latencyMs: parseOutput.latencyMs,
  }
})
