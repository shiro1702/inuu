import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { parseEventsWithGroq } from '~/server/utils/ai/groqEventParser'
import type { EventDigestMeta, EventParseInput, EventParseResult } from '~/server/utils/ai/eventParseSchema'
import { writeAiParseLog } from '~/server/utils/ai/aiParseLogs'
import { enrichRawTextWithUrls } from '~/server/utils/contentUrlEnricher'
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

type EventDuplicateItem = {
  id: string
  slug: string
  title: string
  startsAt: string | null
  seriesSlug: string | null
}

async function findEventDuplicates(args: {
  event: H3Event
  cityId: string
  title: string
  dates: string[]
}) {
  const client = await serverSupabaseServiceRole(args.event)
  const sinceIso = new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString()

  const { data, error } = await client
    .from('events')
    .select('id,slug,title,starts_at,series_slug')
    .eq('city_id', args.cityId)
    .gte('starts_at', sinceIso)
    .order('starts_at', { ascending: true })
    .limit(300)

  const empty = {
    checked: false as const,
    items: [] as EventDuplicateItem[],
    seriesMatches: [] as EventDuplicateItem[],
  }

  if (error) {
    return empty
  }

  const targetTitle = normalizeTitle(args.title)
  const targetDates = new Set(args.dates.map((x) => x.slice(0, 10)))
  const titleMatches = (data ?? []).filter((row: any) => {
    const rowTitle = normalizeTitle(String(row.title || ''))
    return rowTitle === targetTitle || rowTitle.includes(targetTitle) || targetTitle.includes(rowTitle)
  })

  const mapRow = (row: any): EventDuplicateItem => ({
    id: String(row.id),
    slug: String(row.slug || ''),
    title: String(row.title || ''),
    startsAt: typeof row.starts_at === 'string' ? row.starts_at : null,
    seriesSlug: row.series_slug ? String(row.series_slug) : null,
  })

  const items = titleMatches
    .filter((row: any) => {
      const rowDate = typeof row.starts_at === 'string' ? row.starts_at.slice(0, 10) : ''
      return rowDate ? targetDates.has(rowDate) : false
    })
    .map(mapRow)

  const seriesMatches = titleMatches
    .filter((row: any) => {
      const rowDate = typeof row.starts_at === 'string' ? row.starts_at.slice(0, 10) : ''
      return rowDate ? !targetDates.has(rowDate) : true
    })
    .map(mapRow)

  return {
    checked: true as const,
    items,
    seriesMatches,
  }
}

export type ContentIngestItemResult = {
  parse: EventParseResult
  moderationStatus: 'pending' | 'needs_revision'
  duplicates: Awaited<ReturnType<typeof findEventDuplicates>>
  submissionId: string | null
  batchIndex: number
}

export type ContentIngestResult = {
  city: { id: string; slug: string; name: string; timezone: string }
  parseKind: 'single' | 'digest'
  digest: EventDigestMeta | null
  events: EventParseResult[]
  items: ContentIngestItemResult[]
  batchId: string | null
  parentSubmissionId: string | null
  /** @deprecated use items[0].parse for single */
  parse: EventParseResult
  moderationStatus: 'pending' | 'needs_revision'
  duplicates: Awaited<ReturnType<typeof findEventDuplicates>>
  persisted: { ok: boolean; id: string | null; warning: string | null; resent?: boolean }
  model: string
  latencyMs: number
  enrichedUrls?: string[]
}

async function resolveEventResult(
  event: H3Event,
  cityId: string,
  result: EventParseResult,
): Promise<EventParseResult> {
  const resolvedTaxonomy = await resolveParsedTaxonomy(event, cityId, {
    topicTags: result.topic_tags,
    categorySlug: result.category_slug,
  })
  return {
    ...result,
    topic_tags: resolvedTaxonomy.topicTags,
    category_slug: resolvedTaxonomy.categorySlug,
  }
}

type PersistBatchArgs = {
  event: H3Event
  cityId: string
  parseKind: 'single' | 'digest'
  digest: EventDigestMeta | null
  items: ContentIngestItemResult[]
  sourceKind: string
  sourceUrl: string | null
  sourceExternalId: string | null
  fullPayload: Record<string, unknown>
}

async function persistBatchSubmissions(args: PersistBatchArgs): Promise<{
  ok: boolean
  parentId: string | null
  warning: string | null
  resent?: boolean
}> {
  const client = await serverSupabaseServiceRole(args.event)
  const externalId = args.sourceExternalId

  if (args.parseKind === 'single' && args.items[0]) {
    const item = args.items[0]
    if (externalId) {
      const { data: existing } = await client
        .from('content_submissions')
        .select('id,status')
        .eq('city_id', args.cityId)
        .eq('source_external_id', externalId)
        .maybeSingle()
      if (existing?.id) {
        const existingStatus = String((existing as any).status || '')
        if (['needs_revision', 'pending'].includes(existingStatus)) {
          await client
            .from('content_submissions')
            .update({
              status: item.moderationStatus,
              payload: item.parse,
              source_kind: args.sourceKind,
              source_url: args.sourceUrl,
              updated_at: new Date().toISOString(),
            } as any)
            .eq('id', existing.id)
          item.submissionId = String(existing.id)
          return { ok: true, parentId: String(existing.id), warning: null, resent: true }
        }
        item.submissionId = String(existing.id)
        return {
          ok: true,
          parentId: String(existing.id),
          warning: `Already in queue (status: ${existingStatus || 'unknown'})`,
        }
      }
    }

    const { data: singleRow, error: singleError } = await client
      .from('content_submissions')
      .insert({
        city_id: args.cityId,
        kind: 'event',
        status: item.moderationStatus,
        payload: item.parse,
        source_kind: args.sourceKind,
        source_url: args.sourceUrl,
        source_external_id: externalId,
        editorial_score: null,
      } as any)
      .select('id')
      .maybeSingle()

    if (singleError || !singleRow?.id) {
      return {
        ok: false,
        parentId: null,
        warning: `Persist skipped: ${singleError?.message || 'single insert failed'}`,
      }
    }
    item.submissionId = String(singleRow.id)
    return { ok: true, parentId: String(singleRow.id), warning: null }
  }

  if (externalId) {
    const { data: existingParent } = await client
      .from('content_submissions')
      .select('id,status')
      .eq('city_id', args.cityId)
      .eq('source_external_id', externalId)
      .eq('batch_role', 'batch')
      .maybeSingle()

    if (existingParent?.id) {
      const existingStatus = String((existingParent as any).status || '')
      if (['needs_revision', 'pending'].includes(existingStatus)) {
        await client
          .from('content_submissions')
          .update({
            status: args.items.some((i) => i.moderationStatus === 'needs_revision') ? 'needs_revision' : 'pending',
            payload: args.fullPayload,
            source_kind: args.sourceKind,
            source_url: args.sourceUrl,
            updated_at: new Date().toISOString(),
          } as any)
          .eq('id', existingParent.id)

        for (const item of args.items) {
          const itemExternalId = `${externalId}#item-${item.batchIndex}`
          const itemPayload = {
            ...item.parse,
            digest_context: {
              batch_id: String(existingParent.id),
              digest_title: args.digest?.title || null,
              period: args.digest?.period || null,
              batch_index: item.batchIndex,
            },
          }
          const { data: existingItem } = await client
            .from('content_submissions')
            .select('id')
            .eq('city_id', args.cityId)
            .eq('source_external_id', itemExternalId)
            .maybeSingle()

          const row = {
            city_id: args.cityId,
            kind: 'event',
            status: item.moderationStatus,
            payload: itemPayload,
            source_kind: args.sourceKind,
            source_url: args.sourceUrl,
            source_external_id: itemExternalId,
            editorial_score: null,
            batch_id: existingParent.id,
            batch_role: 'item',
            batch_index: item.batchIndex,
            updated_at: new Date().toISOString(),
          }

          if (existingItem?.id) {
            await client.from('content_submissions').update(row as any).eq('id', existingItem.id)
            item.submissionId = String(existingItem.id)
          } else {
            const { data: inserted } = await client
              .from('content_submissions')
              .insert(row as any)
              .select('id')
              .maybeSingle()
            item.submissionId = inserted?.id ? String(inserted.id) : null
          }
        }

        return { ok: true, parentId: String(existingParent.id), warning: null, resent: true }
      }
      return {
        ok: true,
        parentId: String(existingParent.id),
        warning: `Already in queue (status: ${existingStatus || 'unknown'})`,
      }
    }
  }

  const parentStatus = args.items.some((i) => i.moderationStatus === 'needs_revision')
    ? 'needs_revision'
    : 'pending'

  const { data: parent, error: parentError } = await client
    .from('content_submissions')
    .insert({
      city_id: args.cityId,
      kind: args.parseKind === 'digest' ? 'event_digest' : 'event',
      status: parentStatus,
      payload: args.fullPayload,
      source_kind: args.sourceKind,
      source_url: args.sourceUrl,
      source_external_id: externalId,
      editorial_score: null,
      batch_role: args.parseKind === 'digest' ? 'batch' : null,
      batch_index: null,
    } as any)
    .select('id')
    .maybeSingle()

  if (parentError || !parent?.id) {
    return {
      ok: false,
      parentId: null,
      warning: `Persist skipped: ${parentError?.message || 'parent insert failed'}`,
    }
  }

  const parentId = String(parent.id)

  for (const item of args.items) {
    const itemExternalId = externalId ? `${externalId}#item-${item.batchIndex}` : null
    const itemPayload = {
      ...item.parse,
      digest_context: {
        batch_id: parentId,
        digest_title: args.digest?.title || null,
        period: args.digest?.period || null,
        batch_index: item.batchIndex,
      },
    }
    const { data: itemRow, error: itemError } = await client
      .from('content_submissions')
      .insert({
        city_id: args.cityId,
        kind: 'event',
        status: item.moderationStatus,
        payload: itemPayload,
        source_kind: args.sourceKind,
        source_url: args.sourceUrl,
        source_external_id: itemExternalId,
        editorial_score: null,
        batch_id: parentId,
        batch_role: 'item',
        batch_index: item.batchIndex,
      } as any)
      .select('id')
      .maybeSingle()

    if (itemError || !itemRow?.id) {
      console.error('[contentIngestCore] item insert failed:', itemError)
      continue
    }
    item.submissionId = String(itemRow.id)
  }

  return { ok: true, parentId, warning: null }
}

export async function runContentIngest(
  event: H3Event,
  input: EventParseInput & { persist?: boolean; skipUrlEnrich?: boolean },
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

  const enriched = input.skipUrlEnrich
    ? { rawText: input.rawText, urls: [], enrichedUrls: [] as string[] }
    : await enrichRawTextWithUrls(input.rawText)

  const parseOutput = await parseEventsWithGroq({
    ...input,
    rawText: enriched.rawText,
    hints: taxonomyHints,
  })

  const digestResult = parseOutput.result
  let events = [...digestResult.events]

  if (input.coverMediaUrl && events[0]) {
    events = [{ ...events[0], cover_media_url: input.coverMediaUrl }, ...events.slice(1)]
  }

  const lastUsage = [...parseOutput.attempts].reverse().find((x) => x.ok && x.usage)?.usage
  const citySlug = events[0]?.city_slug || input.citySlug
  if (!citySlug) {
    throw new Error('city_slug is required either in input or parse result')
  }

  const city = cityForTaxonomy?.slug === citySlug
    ? cityForTaxonomy
    : await resolveCityBySlug(event, citySlug)

  const items: ContentIngestItemResult[] = []
  for (let i = 0; i < events.length; i++) {
    let parsed = await resolveEventResult(event, city.id, events[i])
    events[i] = parsed
    const duplicates = await findEventDuplicates({
      event,
      cityId: city.id,
      title: parsed.title,
      dates: parsed.recurrence.dates,
    })
    const moderationStatus = confidenceStatus({
      confidence: parsed.confidence,
      missingFields: parsed.missing_fields,
      hasDates: parsed.recurrence.dates.length > 0,
    })
    items.push({
      parse: parsed,
      moderationStatus,
      duplicates,
      submissionId: null,
      batchIndex: i,
    })
  }

  const parseKind = digestResult.parse_kind
  const digest = digestResult.digest
  const firstItem = items[0]
  const shouldPersist = input.persist === true

  const fullPayload = {
    parse_kind: parseKind,
    digest,
    events,
    source: {
      kind: input.sourceKind,
      url: input.sourceUrl || null,
      external_id: input.sourceExternalId || null,
    },
  }

  let persisted: { ok: boolean; id: string | null; warning: string | null; resent?: boolean } = {
    ok: false,
    id: null,
    warning: null,
  }

  if (shouldPersist) {
    const batchPersist = await persistBatchSubmissions({
      event,
      cityId: city.id,
      parseKind,
      digest,
      items,
      sourceKind: input.sourceKind,
      sourceUrl: input.sourceUrl || null,
      sourceExternalId: input.sourceExternalId || null,
      fullPayload,
    })
    persisted = {
      ok: batchPersist.ok,
      id: batchPersist.parentId,
      warning: batchPersist.warning,
      resent: batchPersist.resent,
    }
  }

  const aggregateDuplicates = firstItem?.duplicates || {
    checked: false as const,
    items: [] as EventDuplicateItem[],
    seriesMatches: [] as EventDuplicateItem[],
  }

  await writeAiParseLog(event, {
    sourceKind: input.sourceKind,
    sourceUrl: input.sourceUrl ?? null,
    sourceExternalId: input.sourceExternalId ?? null,
    citySlug: city.slug,
    model: parseOutput.model,
    status: shouldPersist ? (persisted.ok ? 'persisted' : 'persist_failed') : 'success',
    latencyMs: parseOutput.latencyMs,
    promptTokens: lastUsage?.promptTokens ?? null,
    completionTokens: lastUsage?.completionTokens ?? null,
    totalTokens: lastUsage?.totalTokens ?? null,
    confidence: firstItem?.parse.confidence ?? 0,
    missingFieldsCount: firstItem?.parse.missing_fields.length ?? 0,
    parseAttempts: parseOutput.attempts.length,
    errorMessage: persisted.warning,
    payload: {
      parseKind,
      eventsCount: events.length,
      moderationStatus: firstItem?.moderationStatus,
      duplicateCount: aggregateDuplicates.items.length,
      seriesMatchCount: aggregateDuplicates.seriesMatches.length,
      persisted: persisted.ok,
      enrichedUrlCount: enriched.enrichedUrls.length,
    },
  })

  return {
    city: {
      id: city.id,
      slug: city.slug,
      name: city.name,
      timezone: city.timezone,
    },
    parseKind,
    digest,
    events,
    items,
    batchId: parseKind === 'digest' ? persisted.id : null,
    parentSubmissionId: parseKind === 'digest' ? persisted.id : null,
    parse: firstItem?.parse || events[0],
    moderationStatus: firstItem?.moderationStatus || 'needs_revision',
    duplicates: aggregateDuplicates,
    persisted,
    model: parseOutput.model,
    latencyMs: parseOutput.latencyMs,
    enrichedUrls: enriched.enrichedUrls,
  }
}
