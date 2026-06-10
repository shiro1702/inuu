import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { requireDashboardAccess } from '~/server/utils/dashboard'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

type Body = {
  city_slug?: string
  destination?: 'moderation' | 'dm'
  chat_id?: string
  media_urls?: string[]
  caption?: string
}

export default defineEventHandler(async (event) => {
  await requireDashboardAccess(event)
  const body = await readBody<Body>(event)
  const citySlug = typeof body?.city_slug === 'string' ? body.city_slug.trim() : ''
  const mediaUrls = (body?.media_urls || []).map((u) => String(u).trim()).filter(Boolean)
  if (!mediaUrls.length) {
    throw createError({ statusCode: 400, statusMessage: 'media_urls required' })
  }

  let chatId = body?.chat_id?.trim() || ''
  let botKind = 'moderation'

  if (body?.destination === 'dm') {
    botKind = 'partner'
    if (!chatId) {
      throw createError({ statusCode: 400, statusMessage: 'chat_id required for dm destination' })
    }
  } else if (citySlug) {
    const scope = await resolveManagerCityScopeOrThrow(event, citySlug)
    const client = await serverSupabaseServiceRole(event)
    const { data: settings } = await client
      .from('city_content_ops_settings')
      .select('moderation_telegram_chat_id')
      .eq('city_id', scope.cityId)
      .maybeSingle()
    chatId = String((settings as { moderation_telegram_chat_id?: string } | null)?.moderation_telegram_chat_id || '').trim()
    if (!chatId) {
      throw createError({ statusCode: 400, statusMessage: 'Moderation chat not configured for city' })
    }
  } else {
    throw createError({ statusCode: 400, statusMessage: 'city_slug or chat_id required' })
  }

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('telegram_queue')
    .insert({
      status: 'pending',
      bot_kind: botKind,
      chat_id: chatId,
      payload: {
        media_urls: mediaUrls,
        caption: body?.caption || '',
      },
    })
    .select('id')
    .single()

  if (error || !data) {
    throw createError({ statusCode: 500, statusMessage: error?.message || 'Failed to enqueue' })
  }

  return { ok: true as const, queue_id: (data as { id: string }).id }
})
