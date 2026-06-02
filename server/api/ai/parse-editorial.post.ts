import { createError, defineEventHandler, readBody } from 'h3'
import { writeAiParseLog } from '~/server/utils/ai/aiParseLogs'
import { editorialParseInputSchema } from '~/server/utils/ai/editorialParseSchema'
import { parseEditorialWithGroq } from '~/server/utils/ai/groqEditorialParser'
import { loadCityParseTaxonomy, resolveParsedTaxonomy } from '~/server/utils/cityContentTaxonomy'
import { enrichRawTextWithUrls } from '~/server/utils/contentUrlEnricher'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => null)
  const parsedInput = editorialParseInputSchema.safeParse(body)

  if (!parsedInput.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid editorial parser payload',
      data: parsedInput.error.flatten(),
    })
  }

  const enriched = await enrichRawTextWithUrls(parsedInput.data.rawText)
  let hints = parsedInput.data.hints || {}
  const citySlug = parsedInput.data.citySlug

  if (citySlug) {
    const city = await resolveCityBySlug(event, citySlug)
    const taxonomy = await loadCityParseTaxonomy(event, city.id)
    hints = {
      ...hints,
      availableTags: taxonomy.tags.map((t) => (typeof t === 'string' ? t : t.slug)),
    }
  }

  const output = await parseEditorialWithGroq({
    ...parsedInput.data,
    rawText: enriched.rawText,
    hints,
  })

  let result = output.result
  if (citySlug || result.city_slug) {
    const resolvedSlug = result.city_slug || citySlug
    if (resolvedSlug) {
      const city = await resolveCityBySlug(event, resolvedSlug)
      const resolved = await resolveParsedTaxonomy(event, city.id, {
        topicTags: result.topic_tags,
        categorySlug: null,
      })
      result = { ...result, topic_tags: resolved.topicTags, city_slug: resolvedSlug }
    }
  }

  const lastUsage = [...output.attempts].reverse().find((x) => x.ok && x.usage)?.usage
  await writeAiParseLog(event, {
    sourceKind: parsedInput.data.sourceKind,
    sourceUrl: parsedInput.data.sourceUrl ?? null,
    sourceExternalId: parsedInput.data.sourceExternalId ?? null,
    citySlug: result.city_slug ?? citySlug ?? null,
    model: output.model,
    status: 'success',
    latencyMs: output.latencyMs,
    promptTokens: lastUsage?.promptTokens ?? null,
    completionTokens: lastUsage?.completionTokens ?? null,
    totalTokens: lastUsage?.totalTokens ?? null,
    confidence: result.confidence ?? 0,
    missingFieldsCount: result.missing_fields.length ?? 0,
    parseAttempts: output.attempts.length,
    payload: {
      mode: 'parse-editorial',
      contentType: result.content_type,
      hasVideo: !!result.video_url,
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
    enrichedUrls: enriched.enrichedUrls,
  }
})
