import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { parseEventWithGroq } from '~/server/utils/ai/groqEventParser'
import type { EventParseInput } from '~/server/utils/ai/eventParseSchema'
import { writeAiParseLog } from '~/server/utils/ai/aiParseLogs'
import { resolveCityBySlug } from '~/server/utils/inuuCity'
import { loadCityParseTaxonomy, resolveParsedTaxonomy } from '~/server/utils/cityContentTaxonomy'

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
  event: H3Event
  cityId: string
  title: string
  dates: string[]
}) {
  const client = await serverSupabaseServiceRole(args.event)
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

export type ContentIngestResult = {
  city: { id: string; slug: string; name: string; timezone: string }
  parse: Awaited<ReturnType<typeof parseEventWithGroq>>['result']
  moderationStatus: 'pending' | 'needs_revision'
  duplicates: Awaited<ReturnType<typeof findEventDuplicates>>
  persisted: { ok: boolean; id: string | null; warning: string | null }
  model: string
  latencyMs: number
}

export async function runContentIngest(
  event: H3Event,
  input: EventParseInput & { persist?: boolean },
): Promise<ContentIngestResult> {
  const citySlugHint = input.citySlug || null
  let taxonomyHints = input.hints || {}
  let cityForTaxonomy: Awaited<ReturnType<typeof resolveCityBySlug>> | null = null

  if (citySlugHint) {
    cityForTaxonomy = await resolveCityBySlug(event, citySlugHint)
    const taxonomy = await loadCityParseTaxonomy(event, cityForTaxonomy.id)
    taxonomyHints = {
      ...taxonomyHints,
      availableTags: taxonomy.tags,
      availableCategories: taxonomy.categories,
    }
  }

  const parseOutput = await parseEventWithGroq({ ...input, hints: taxonomyHints })
  let result = parseOutput.result
  const lastUsage = [...parseOutput.attempts].reverse().find((x) => x.ok && x.usage)?.usage
  const citySlug = result.city_slug || input.citySlug
  if (!citySlug) {
    throw new Error('city_slug is required either in input or parse result')
  }

  const city = cityForTaxonomy?.slug === citySlug
    ? cityForTaxonomy
    : await resolveCityBySlug(event, citySlug)

  const resolvedTaxonomy = await resolveParsedTaxonomy(event, city.id, {
    topicTags: result.topic_tags,
    categorySlug: result.category_slug,
  })
  result = {
    ...result,
    topic_tags: resolvedTaxonomy.topicTags,
    category_slug: resolvedTaxonomy.categorySlug,
  }
  const duplicates = await findEventDuplicates({
    event,
    cityId: city.id,
    title: result.title,
    dates: result.recurrence.dates,
  })

  const moderationStatus = confidenceStatus({
    confidence: result.confidence,
    missingFields: result.missing_fields,
    hasDates: result.recurrence.dates.length > 0,
  })
  const shouldPersist = input.persist === true

  let persisted: { ok: boolean; id: string | null; warning: string | null } = { ok: false, id: null, warning: null }
  if (shouldPersist) {
    const client = await serverSupabaseServiceRole(event)
    const externalId = result.source.external_id || input.sourceExternalId || null
    if (externalId) {
      const { data: existing } = await client
        .from('content_submissions')
        .select('id,status')
        .eq('city_id', city.id)
        .eq('source_external_id', externalId)
        .maybeSingle()
      if (existing?.id) {
        persisted = {
          ok: true,
          id: String(existing.id),
          warning: `Already in queue (status: ${String((existing as any).status || 'unknown')})`,
        }
      }
    }

    if (!persisted.id) {
      const insertPayload = {
        city_id: city.id,
        kind: 'event',
        status: moderationStatus,
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
      moderationStatus,
      duplicateCount: duplicates.items.length,
      persisted: persisted.ok,
      hasDates: result.recurrence.dates.length > 0,
      eventKind: result.event_kind,
    },
  })

  return {
    city: {
      id: city.id,
      slug: city.slug,
      name: city.name,
      timezone: city.timezone,
    },
    parse: result,
    moderationStatus,
    duplicates,
    persisted,
    model: parseOutput.model,
    latencyMs: parseOutput.latencyMs,
  }
}
