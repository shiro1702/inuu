import { createError, defineEventHandler, getHeader, readBody } from 'h3'
import { eventParseInputSchema } from '~/server/utils/ai/eventParseSchema'
import { runContentIngest } from '~/server/utils/contentIngestCore'
import { notifyContentIngestModeration } from '~/server/utils/inuuContentModeration'

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

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const ingestSecret = String((config as any).ingestSecret || '').trim()
  if (ingestSecret) {
    const header = String(getHeader(event, 'x-ingest-secret') || '').trim()
    if (header !== ingestSecret) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }
  }

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

  try {
    const result = await runContentIngest(event, {
      ...parsedInput.data,
      persist: body.persist === true,
    })

    if (body.persist === true && result.persisted.ok && result.persisted.id) {
      const botToken = String((event.context.tenant as any)?.telegramBotToken || config.botToken || '').trim()
      if (botToken) {
        await notifyContentIngestModeration(event, {
          ingestResult: result,
          cityId: result.city.id,
          botToken,
          force: result.persisted.resent === true,
        }).catch((err) => console.error('[ingest] telegram moderation cards:', err))
      }
    }

    return {
      ok: true as const,
      city: result.city,
      parseKind: result.parseKind,
      eventsCount: result.events.length,
      batchId: result.batchId,
      digest: result.digest,
      parse: result.parse,
      events: result.events,
      items: result.items.map((i) => ({
        batchIndex: i.batchIndex,
        submissionId: i.submissionId,
        moderationStatus: i.moderationStatus,
        title: i.parse.title,
        duplicates: i.duplicates,
      })),
      moderationStatus: result.moderationStatus,
      duplicates: result.duplicates,
      persisted: result.persisted,
      model: result.model,
      latencyMs: result.latencyMs,
      enrichedUrls: result.enrichedUrls,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ingest failed'
    if (message.includes('city_slug')) {
      throw createError({ statusCode: 400, statusMessage: message })
    }
    throw err
  }
})
