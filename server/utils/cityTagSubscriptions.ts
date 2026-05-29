import type { H3Event } from 'h3'
import { createError, getHeader } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  getMaxBotTokenForShop,
  uniqueNonEmptyTokens,
  validateWebAppInitDataAnyToken,
} from '~/server/utils/messengerInitData'
import { ensureCustomerProfileRow } from '~/server/utils/customerProfile'

export type SubscriptionChannel = 'telegram' | 'max'

function readInitDataFromEvent(event: H3Event): string {
  return getHeader(event, 'x-messenger-init-data')?.trim()
    || getHeader(event, 'x-telegram-init-data')?.trim()
    || ''
}

export function detectSubscriptionChannel(event: H3Event): SubscriptionChannel | null {
  const initData = readInitDataFromEvent(event)
  if (!initData) return null

  const config = useRuntimeConfig()
  const tenant = event.context?.tenant as { telegramBotToken?: string; integrationKeys?: Record<string, unknown> } | undefined
  const telegramTokens = uniqueNonEmptyTokens([
    tenant?.telegramBotToken,
    config.botToken as string | undefined,
  ])
  if (validateWebAppInitDataAnyToken(initData, telegramTokens)) return 'telegram'

  const integrationKeys = tenant?.integrationKeys ?? {}
  const maxTokens = uniqueNonEmptyTokens([
    typeof integrationKeys.max_bot_token === 'string' ? integrationKeys.max_bot_token : undefined,
    config.maxMiniAppBotToken as string | undefined,
    config.maxApiToken as string | undefined,
  ])
  if (maxTokens.length && validateWebAppInitDataAnyToken(initData, maxTokens)) return 'max'

  return null
}

export async function loadCityTagSubscriptionState(args: {
  event: H3Event
  cityId: string
  userId: string
  channel: SubscriptionChannel | null
}): Promise<{
  interestTags: string[]
  hasEventsTopic: boolean
  channel: SubscriptionChannel | null
}> {
  const client = await serverSupabaseServiceRole(args.event)

  const { data: prefs } = await client
    .from('user_city_preferences')
    .select('interest_tags')
    .eq('user_id', args.userId)
    .eq('city_id', args.cityId)
    .maybeSingle()

  let hasEventsTopic = false
  if (args.channel) {
    const { data: sub } = await client
      .from('city_subscriptions')
      .select('id')
      .eq('user_id', args.userId)
      .eq('city_id', args.cityId)
      .eq('channel', args.channel)
      .eq('topic_slug', 'events')
      .maybeSingle()
    hasEventsTopic = !!sub?.id
  }

  return {
    interestTags: Array.isArray(prefs?.interest_tags)
      ? prefs.interest_tags.map((x) => String(x)).filter(Boolean)
      : [],
    hasEventsTopic,
    channel: args.channel,
  }
}

export async function subscribeToCityEventTags(args: {
  event: H3Event
  cityId: string
  userId: string
  tags: string[]
  channel: SubscriptionChannel | null
}): Promise<{
  interestTags: string[]
  hasEventsTopic: boolean
  channel: SubscriptionChannel | null
  messengerLinked: boolean
}> {
  const client = await serverSupabaseServiceRole(args.event)
  const tagSlugs = [...new Set(args.tags.map((x) => String(x).trim()).filter(Boolean))]
  if (!tagSlugs.length) {
    throw createError({ statusCode: 400, statusMessage: 'At least one tag is required' })
  }

  await ensureCustomerProfileRow(args.event, args.userId)

  const { data: existingPrefs } = await client
    .from('user_city_preferences')
    .select('interest_tags, notify_channels')
    .eq('user_id', args.userId)
    .eq('city_id', args.cityId)
    .maybeSingle()

  const currentTags = Array.isArray(existingPrefs?.interest_tags)
    ? existingPrefs.interest_tags.map((x) => String(x)).filter(Boolean)
    : []
  const mergedTags = [...new Set([...currentTags, ...tagSlugs])]

  const notifyChannels = existingPrefs?.notify_channels && typeof existingPrefs.notify_channels === 'object'
    ? { ...(existingPrefs.notify_channels as Record<string, unknown>) }
    : {}

  if (args.channel === 'telegram') notifyChannels.telegram = true
  if (args.channel === 'max') notifyChannels.max = true

  const prefsPayload = {
    interest_tags: mergedTags,
    notify_channels: notifyChannels,
    updated_at: new Date().toISOString(),
  }

  const prefsError = existingPrefs
    ? (await client
      .from('user_city_preferences')
      .update(prefsPayload)
      .eq('user_id', args.userId)
      .eq('city_id', args.cityId)).error
    : (await client.from('user_city_preferences').insert({
      user_id: args.userId,
      city_id: args.cityId,
      ...prefsPayload,
    })).error

  if (prefsError) {
    console.error('[cityTagSubscriptions] preferences save failed:', prefsError)
    throw createError({ statusCode: 500, statusMessage: 'Failed to save preferences' })
  }

  let hasEventsTopic = false
  if (args.channel) {
    const { data: existingSub } = await client
      .from('city_subscriptions')
      .select('id')
      .eq('user_id', args.userId)
      .eq('city_id', args.cityId)
      .eq('channel', args.channel)
      .eq('topic_slug', 'events')
      .maybeSingle()

    const subError = existingSub?.id
      ? (await client
        .from('city_subscriptions')
        .update({ metadata: { source: 'afisha_tag_filter' } })
        .eq('id', existingSub.id)).error
      : (await client.from('city_subscriptions').insert({
        user_id: args.userId,
        city_id: args.cityId,
        channel: args.channel,
        topic_slug: 'events',
        metadata: { source: 'afisha_tag_filter' },
      })).error

    if (subError) {
      console.error('[cityTagSubscriptions] subscription save failed:', subError)
      throw createError({ statusCode: 500, statusMessage: 'Failed to save subscription' })
    }
    hasEventsTopic = true
  }

  return {
    interestTags: mergedTags,
    hasEventsTopic,
    channel: args.channel,
    messengerLinked: !!args.channel,
  }
}
