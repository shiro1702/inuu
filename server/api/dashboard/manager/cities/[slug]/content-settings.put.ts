import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

type Body = {
  telegramManagerChatId?: string | null
  telegramModerationChatId?: string | null
  telegramParserSourceChats?: string[]
  maxManagerChatId?: string | null
  maxModerationChatId?: string | null
  maxParserSourceChats?: string[]
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

  const nextSettings = {
    telegram: {
      manager_chat_id: nullableTrimmedString(body.telegramManagerChatId),
      moderation_chat_id: nullableTrimmedString(body.telegramModerationChatId),
      parser_source_chats: normalizeChatArray(body.telegramParserSourceChats),
    },
    max: {
      manager_chat_id: nullableTrimmedString(body.maxManagerChatId),
      moderation_chat_id: nullableTrimmedString(body.maxModerationChatId),
      parser_source_chats: normalizeChatArray(body.maxParserSourceChats),
    },
  }

  const client = await serverSupabaseServiceRole(event)
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
  }
})
