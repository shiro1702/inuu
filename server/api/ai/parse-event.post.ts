import { createError, defineEventHandler, readBody } from 'h3'
import { eventParseInputSchema } from '~/server/utils/ai/eventParseSchema'
import { parseEventWithGroq } from '~/server/utils/ai/groqEventParser'
import { writeAiParseLog } from '~/server/utils/ai/aiParseLogs'

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

  const output = await parseEventWithGroq(parsedInput.data)
  const lastUsage = [...output.attempts].reverse().find((x) => x.ok && x.usage)?.usage
  await writeAiParseLog(event, {
    sourceKind: parsedInput.data.sourceKind,
    sourceUrl: parsedInput.data.sourceUrl ?? null,
    sourceExternalId: parsedInput.data.sourceExternalId ?? null,
    citySlug: output.result.city_slug ?? parsedInput.data.citySlug ?? null,
    model: output.model,
    status: 'success',
    latencyMs: output.latencyMs,
    promptTokens: lastUsage?.promptTokens ?? null,
    completionTokens: lastUsage?.completionTokens ?? null,
    totalTokens: lastUsage?.totalTokens ?? null,
    confidence: output.result.confidence,
    missingFieldsCount: output.result.missing_fields.length,
    parseAttempts: output.attempts.length,
    payload: {
      mode: 'parse-only',
      hasDates: output.result.recurrence.dates.length > 0,
      eventKind: output.result.event_kind,
    },
  })

  return {
    ok: true as const,
    result: output.result,
    attempts: output.attempts.map((x) => ({
      ok: x.ok,
      attempt: x.attempt,
      error: x.error || null,
    })),
    model: output.model,
    latencyMs: output.latencyMs,
  }
})
