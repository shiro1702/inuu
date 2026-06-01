import { createError, defineEventHandler, readBody } from 'h3'
import { evaluateContentPrefilter } from '~/server/utils/ai/contentPrefilter'
import { eventParseInputSchema } from '~/server/utils/ai/eventParseSchema'
import { parseEventsWithGroq } from '~/server/utils/ai/groqEventParser'
import { writeAiParseLog } from '~/server/utils/ai/aiParseLogs'
import { enrichRawTextWithUrls } from '~/server/utils/contentUrlEnricher'
import { resolveCityPrefilterEnabled } from '~/server/utils/cityIngestSettings'
import { loadCityParseTaxonomy, resolveParsedTaxonomy } from '~/server/utils/cityContentTaxonomy'
import { resolveIngestSourceContext } from '~/server/utils/ingestSourceContext'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null)
  const parsedInput = eventParseInputSchema.safeParse(body)

  if (!parsedInput.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid parser payload',
      data: parsedInput.error.flatten(),
    })
  }

  let hints = parsedInput.data.hints || {}
  const citySlug = parsedInput.data.citySlug
  if (citySlug) {
    const city = await resolveCityBySlug(event, citySlug)
    const taxonomy = await loadCityParseTaxonomy(event, city.id)
    const contextType = await resolveIngestSourceContext(event, {
      citySlug,
      sourceUrl: parsedInput.data.sourceUrl,
    })
    hints = {
      ...hints,
      availableTags: taxonomy.tags,
      availableCategories: taxonomy.categories,
      contextType,
    }
  }

  const enriched = await enrichRawTextWithUrls(parsedInput.data.rawText)
  const prefilterEnabled = citySlug
    ? await resolveCityPrefilterEnabled(event, citySlug)
    : true
  if (prefilterEnabled) {
    const prefilter = evaluateContentPrefilter(enriched.rawText)
    if (!prefilter.pass) {
    await writeAiParseLog(event, {
      sourceKind: parsedInput.data.sourceKind,
      sourceUrl: parsedInput.data.sourceUrl ?? null,
      sourceExternalId: parsedInput.data.sourceExternalId ?? null,
      citySlug: citySlug ?? null,
      model: 'prefilter',
      status: 'skipped',
      latencyMs: 0,
      errorMessage: 'skipped by prefilter',
      payload: {
        mode: 'parse-only',
        reason: prefilter.reason,
        signals: prefilter.signals,
      },
    })

    return {
      ok: true as const,
      skippedByPrefilter: true,
      reason: prefilter.reason,
      signals: prefilter.signals,
      eventsCount: 0,
      events: [],
      enrichedUrls: enriched.enrichedUrls,
    }
    }
  }

  const output = await parseEventsWithGroq({ ...parsedInput.data, rawText: enriched.rawText, hints })

  let events = [...output.result.events]
  const resolvedCitySlug = events[0]?.city_slug || citySlug
  if (resolvedCitySlug) {
    const city = await resolveCityBySlug(event, resolvedCitySlug)
    events = await Promise.all(
      events.map(async (ev) => {
        const resolved = await resolveParsedTaxonomy(event, city.id, {
          topicTags: ev.topic_tags,
          categorySlug: ev.category_slug,
        })
        return { ...ev, topic_tags: resolved.topicTags, category_slug: resolved.categorySlug }
      }),
    )
  }

  const lastUsage = [...output.attempts].reverse().find((x) => x.ok && x.usage)?.usage
  await writeAiParseLog(event, {
    sourceKind: parsedInput.data.sourceKind,
    sourceUrl: parsedInput.data.sourceUrl ?? null,
    sourceExternalId: parsedInput.data.sourceExternalId ?? null,
    citySlug: events[0]?.city_slug ?? parsedInput.data.citySlug ?? null,
    model: output.model,
    status: 'success',
    latencyMs: output.latencyMs,
    promptTokens: lastUsage?.promptTokens ?? null,
    completionTokens: lastUsage?.completionTokens ?? null,
    totalTokens: lastUsage?.totalTokens ?? null,
    confidence: events[0]?.confidence ?? 0,
    missingFieldsCount: events[0]?.missing_fields.length ?? 0,
    parseAttempts: output.attempts.length,
    payload: {
      mode: 'parse-only',
      parseKind: output.result.parse_kind,
      eventsCount: events.length,
      hasDates: events.some((e) => e.recurrence.dates.length > 0),
      enrichedUrlCount: enriched.enrichedUrls.length,
    },
  })

  return {
    ok: true as const,
    parseKind: output.result.parse_kind,
    eventsCount: events.length,
    digest: output.result.digest,
    result: events[0],
    events,
    attempts: output.attempts.map((x) => ({
      ok: x.ok,
      attempt: x.attempt,
      error: x.error || null,
    })),
    model: output.model,
    latencyMs: output.latencyMs,
    enrichedUrls: enriched.enrichedUrls,
  }
})
