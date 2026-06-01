import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { requireDashboardAccess } from '~/server/utils/dashboard'
import {
  getMaxBotTokenForShop,
  getMessengerInitDataFromEvent,
  uniqueNonEmptyTokens,
  validateWebAppInitDataAnyToken,
} from '~/server/utils/messengerInitData'

const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`

export type ContentOpsSettings = {
  telegram?: { manager_chat_id?: string; moderation_chat_id?: string }
  max?: { manager_chat_id?: string; moderation_chat_id?: string }
}

export type ContentModerationScope = {
  cityId: string
  citySlug: string
  cityName: string
  submissionId: string
  channel: 'dashboard' | 'telegram' | 'max'
  actorUserId: string
}

function resolveModerationChatIds(
  settings: ContentOpsSettings | undefined,
  channel: 'telegram' | 'max',
): string[] {
  const block = channel === 'max' ? settings?.max : settings?.telegram
  const moderation = String(block?.moderation_chat_id || '').trim()
  const manager = String(block?.manager_chat_id || '').trim()
  const ids: string[] = []
  if (moderation) ids.push(moderation)
  if (manager && manager !== moderation) ids.push(manager)
  return ids
}

function parseChatIdFromInitData(initData: string): string | null {
  try {
    const params = new URLSearchParams(initData)
    const chatStr = params.get('chat')
    if (!chatStr) return null
    const chat = JSON.parse(decodeURIComponent(chatStr)) as { id?: number | string }
    const id = chat?.id
    return id != null ? String(id).trim() : null
  } catch {
    return null
  }
}

async function telegramUserInModerationChats(
  botToken: string,
  userId: number,
  chatIds: string[],
): Promise<boolean> {
  for (const chatId of chatIds) {
    try {
      const res = await fetch(`${TELEGRAM_API(botToken)}/getChatMember`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, user_id: userId }),
      })
      if (!res.ok) continue
      const json = await res.json().catch(() => null) as { result?: { status?: string } } | null
      const status = String(json?.result?.status || '').toLowerCase()
      if (['creator', 'administrator', 'member'].includes(status)) return true
    } catch {
      // try next chat
    }
  }
  return false
}

async function assertDashboardCityAccess(event: H3Event, cityId: string): Promise<string | null> {
  try {
    const access = await requireDashboardAccess(event)
    const client = await serverSupabaseServiceRole(event)
    const { data } = await client
      .from('shop_members')
      .select('shop_id,shops:shop_id(city_id)')
      .eq('user_id', access.userId)
    const rows = (data ?? []) as Array<{ shops?: { city_id?: string } | null }>
    const ok = rows.some((row) => String(row.shops?.city_id || '') === cityId)
    return ok ? access.userId : null
  } catch {
    return null
  }
}

async function assertMessengerModerator(
  event: H3Event,
  args: { cityId: string; settings: ContentOpsSettings },
): Promise<{ channel: 'telegram' | 'max'; actorUserId: string } | null> {
  const initData = getMessengerInitDataFromEvent(event)
  if (!initData) return null

  const config = useRuntimeConfig(event)
  const tenantKeys = (event.context?.tenant as { integrationKeys?: Record<string, unknown> } | undefined)?.integrationKeys

  const telegramTokens = uniqueNonEmptyTokens([
    (event.context?.tenant as { telegramBotToken?: string } | undefined)?.telegramBotToken,
    config.botToken as string | undefined,
  ])
  const tgUser = validateWebAppInitDataAnyToken(initData, telegramTokens)
  if (tgUser?.id) {
    const chatIds = resolveModerationChatIds(args.settings, 'telegram')
    const botToken = telegramTokens[0]
    if (!botToken || !chatIds.length) {
      throw createError({ statusCode: 403, statusMessage: 'Telegram moderation chats are not configured' })
    }
    const allowed = await telegramUserInModerationChats(botToken, tgUser.id, chatIds)
    if (!allowed) {
      throw createError({ statusCode: 403, statusMessage: 'Not a member of city manager/moderation chat' })
    }
    return { channel: 'telegram', actorUserId: String(tgUser.id) }
  }

  const maxTokens = uniqueNonEmptyTokens([
    getMaxBotTokenForShop(tenantKeys, {
      maxMiniAppBotToken: config.maxMiniAppBotToken as string | undefined,
      maxApiToken: config.maxApiToken as string | undefined,
    }),
    config.maxMiniAppBotToken as string | undefined,
    config.maxApiToken as string | undefined,
  ])
  const maxUser = validateWebAppInitDataAnyToken(initData, maxTokens)
  if (maxUser?.id) {
    const allowedChats = resolveModerationChatIds(args.settings, 'max')
    const chatFromInit = parseChatIdFromInitData(initData)
    if (allowedChats.length && chatFromInit && !allowedChats.includes(chatFromInit)) {
      throw createError({ statusCode: 403, statusMessage: 'Opened outside city manager/moderation chat' })
    }
    return { channel: 'max', actorUserId: String(maxUser.id) }
  }

  throw createError({ statusCode: 401, statusMessage: 'Invalid messenger initData' })
}

export async function assertContentModerationAccess(
  event: H3Event,
  submissionId: string,
): Promise<ContentModerationScope> {
  const id = submissionId.trim()
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Submission id is required' })

  const client = await serverSupabaseServiceRole(event)
  const { data: submission, error } = await client
    .from('content_submissions')
    .select('id,city_id,status')
    .eq('id', id)
    .maybeSingle()

  if (error || !submission?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Submission not found' })
  }

  const cityId = String((submission as any).city_id)
  const { data: city } = await client
    .from('cities')
    .select('id,name,slug,content_ops_settings')
    .eq('id', cityId)
    .maybeSingle()

  if (!city?.id) {
    throw createError({ statusCode: 404, statusMessage: 'City not found' })
  }

  const settings = ((city as any).content_ops_settings || {}) as ContentOpsSettings
  const citySlug = String((city as any).slug || '')
  const cityName = String((city as any).name || citySlug)

  const dashboardUserId = await assertDashboardCityAccess(event, cityId)
  if (dashboardUserId) {
    return {
      cityId,
      citySlug,
      cityName,
      submissionId: id,
      channel: 'dashboard',
      actorUserId: dashboardUserId,
    }
  }

  const messenger = await assertMessengerModerator(event, { cityId, settings })
  if (messenger) {
    return {
      cityId,
      citySlug,
      cityName,
      submissionId: id,
      channel: messenger.channel,
      actorUserId: messenger.actorUserId,
    }
  }

  const supabaseUser = await serverSupabaseUser(event)
  if (supabaseUser) {
    throw createError({ statusCode: 403, statusMessage: 'No access to moderate content for this city' })
  }

  throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
}

export function resolveMaxModerationChatIds(settings: ContentOpsSettings | undefined): string[] {
  return resolveModerationChatIds(settings, 'max')
}
