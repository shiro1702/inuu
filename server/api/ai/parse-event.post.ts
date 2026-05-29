import { createError, defineEventHandler, readBody } from 'h3'
import { eventParseInputSchema } from '~/server/utils/ai/eventParseSchema'
import { parseEventsWithGroq } from '~/server/utils/ai/groqEventParser'
import { writeAiParseLog } from '~/server/utils/ai/aiParseLogs'
import { enrichRawTextWithUrls } from '~/server/utils/contentUrlEnricher'
import { loadCityParseTaxonomy, resolveParsedTaxonomy } from '~/server/utils/cityContentTaxonomy'
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
    hints = { ...hints, availableTags: taxonomy.tags, availableCategories: taxonomy.categories }
  }

  const enriched = await enrichRawTextWithUrls(parsedInput.data.rawText)
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
