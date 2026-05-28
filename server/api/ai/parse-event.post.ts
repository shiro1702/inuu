import { createError, defineEventHandler, readBody } from 'h3'
import { eventParseInputSchema } from '~/server/utils/ai/eventParseSchema'
import { parseEventWithGroq } from '~/server/utils/ai/groqEventParser'
import { writeAiParseLog } from '~/server/utils/ai/aiParseLogs'
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

  const output = await parseEventWithGroq({ ...parsedInput.data, hints })
  let result = output.result
  const resolvedCitySlug = result.city_slug || citySlug
  if (resolvedCitySlug) {
    const city = await resolveCityBySlug(event, resolvedCitySlug)
    const resolved = await resolveParsedTaxonomy(event, city.id, {
      topicTags: result.topic_tags,
      categorySlug: result.category_slug,
    })
    result = { ...result, topic_tags: resolved.topicTags, category_slug: resolved.categorySlug }
  }

  const lastUsage = [...output.attempts].reverse().find((x) => x.ok && x.usage)?.usage
  await writeAiParseLog(event, {
    sourceKind: parsedInput.data.sourceKind,
    sourceUrl: parsedInput.data.sourceUrl ?? null,
    sourceExternalId: parsedInput.data.sourceExternalId ?? null,
    citySlug: result.city_slug ?? parsedInput.data.citySlug ?? null,
    model: output.model,
    status: 'success',
    latencyMs: output.latencyMs,
    promptTokens: lastUsage?.promptTokens ?? null,
    completionTokens: lastUsage?.completionTokens ?? null,
    totalTokens: lastUsage?.totalTokens ?? null,
    confidence: result.confidence,
    missingFieldsCount: result.missing_fields.length,
    parseAttempts: output.attempts.length,
    payload: {
      mode: 'parse-only',
      hasDates: result.recurrence.dates.length > 0,
      eventKind: result.event_kind,
    },
  })

  return {
    ok: true as const,
    result,
    attempts: output.attempts.map((x) => ({
      ok: x.ok,
      attempt: x.attempt,
      error: x.error || null,
    })),
    model: output.model,
    latencyMs: output.latencyMs,
  }
})
