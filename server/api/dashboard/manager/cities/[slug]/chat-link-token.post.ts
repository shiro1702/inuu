import { randomUUID } from 'node:crypto'
import { createError, defineEventHandler, readBody } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

type Body = {
  channel?: 'telegram' | 'max'
  target?: 'manager' | 'moderation' | 'parser_source'
}

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const body = await readBody<Body>(event).catch(() => ({}))
  const channel = body.channel === 'max' ? 'max' : 'telegram'
  const target = body.target === 'moderation' || body.target === 'parser_source' ? body.target : 'manager'

  const token = randomUUID()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()
  const client = await serverSupabaseServiceRole(event)
  const { error } = await client
    .from('city_chat_link_tokens')
    .insert({
      token,
      city_id: scope.cityId,
      channel,
      target,
      created_by: scope.userId,
      expires_at: expiresAt,
    } as any)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message || 'Failed to create city chat link token' })
  }

  const config = useRuntimeConfig(event)
  const tgBotName = String(config.public?.telegramBotName || '').trim().replace(/^@/, '')
  const maxBotUrl = String(config.public?.maxBotUrl || '').trim()

  const deepLink = channel === 'telegram'
    ? tgBotName
      ? `https://t.me/${tgBotName}?start=linkcitytg_${token}`
      : ''
    : maxBotUrl
      ? `${maxBotUrl}${maxBotUrl.includes('?') ? '&' : '?'}start=${encodeURIComponent(`linkcitymax_${token}`)}`
      : ''
  const bindCommand = channel === 'telegram'
    ? `/bindcity ${token}`
    : `/bindmaxcity ${token}`

  return {
    ok: true as const,
    city: { id: scope.cityId, slug: scope.citySlug, name: scope.cityName },
    channel,
    target,
    token,
    tokenExpiresAt: expiresAt,
    deepLink,
    bindCommand,
  }
})
