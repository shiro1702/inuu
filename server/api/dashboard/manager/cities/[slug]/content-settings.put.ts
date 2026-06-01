import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { parseCityIngestSettings } from '~/server/utils/cityIngestSettings'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

type Body = {
  telegramManagerChatId?: string | null
  telegramModerationChatId?: string | null
  telegramParserSourceChats?: string[]
  maxManagerChatId?: string | null
  maxModerationChatId?: string | null
  maxParserSourceChats?: string[]
  prefilterEnabled?: boolean
}

function normalizeChatArray(input: unknown): string[] {
  if (!Array.isArray(input)) return []
  return Array.from(
    new Set(
      input
        .map((x) => String(x || '').trim())
        .filter((x) => x.length > 0)
        .slice(0, 50),
    ),
  )
}

function nullableTrimmedString(input: unknown): string | null {
  const value = String(input || '').trim()
  return value.length ? value : null
}

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const body = await readBody<Body>(event).catch(() => ({}))

  const client = await serverSupabaseServiceRole(event)
  const { data: existingRow, error: loadError } = await client
    .from('cities')
    .select('content_ops_settings')
    .eq('id', scope.cityId)
    .maybeSingle()

  if (loadError) {
    throw createError({ statusCode: 500, statusMessage: loadError.message })
  }

  const existing = ((existingRow as any)?.content_ops_settings || {}) as Record<string, unknown>
  const existingTelegram = (existing.telegram && typeof existing.telegram === 'object'
    ? existing.telegram
    : {}) as Record<string, unknown>
  const existingMax = (existing.max && typeof existing.max === 'object'
    ? existing.max
    : {}) as Record<string, unknown>
  const existingIngest = parseCityIngestSettings(existing.ingest)

  const nextTelegram = { ...existingTelegram }
  if (body.telegramManagerChatId !== undefined) {
    nextTelegram.manager_chat_id = nullableTrimmedString(body.telegramManagerChatId)
  }
  if (body.telegramModerationChatId !== undefined) {
    nextTelegram.moderation_chat_id = nullableTrimmedString(body.telegramModerationChatId)
  }
  if (body.telegramParserSourceChats !== undefined) {
    nextTelegram.parser_source_chats = normalizeChatArray(body.telegramParserSourceChats)
  }

  const nextMax = { ...existingMax }
  if (body.maxManagerChatId !== undefined) {
    nextMax.manager_chat_id = nullableTrimmedString(body.maxManagerChatId)
  }
  if (body.maxModerationChatId !== undefined) {
    nextMax.moderation_chat_id = nullableTrimmedString(body.maxModerationChatId)
  }
  if (body.maxParserSourceChats !== undefined) {
    nextMax.parser_source_chats = normalizeChatArray(body.maxParserSourceChats)
  }

  const nextIngest = {
    prefilter_enabled: body.prefilterEnabled === undefined
      ? existingIngest.prefilter_enabled
      : body.prefilterEnabled !== false,
  }

  const nextSettings = {
    ...existing,
    telegram: nextTelegram,
    max: nextMax,
    ingest: nextIngest,
  }

  const { error } = await client
    .from('cities')
    .update({ content_ops_settings: nextSettings })
    .eq('id', scope.cityId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to update city content settings' })
  }

  return {
    ok: true as const,
    city: {
      id: scope.cityId,
      slug: scope.citySlug,
      name: scope.cityName,
    },
    settings: nextSettings,
    ingestSettings: parseCityIngestSettings(nextSettings.ingest),
  }
})
