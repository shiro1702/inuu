import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { EventParseResult } from '~/server/utils/ai/eventParseSchema'
import { publishContentSubmission } from '~/server/utils/contentSubmissionPublish'
import { buildContentSubmissionEditLinks } from '~/server/utils/contentSubmissionEditUrl'
import {
  resolveMaxModerationChatIds,
  type ContentOpsSettings,
} from '~/server/utils/contentModerationAccess'
import { sendMax } from '~/server/utils/serviceCalls'

const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`

const REJECT_SHORT: Record<string, string> = {
  inc: 'incomplete_data',
  dup: 'duplicate',
  off: 'off_topic',
  spam: 'spam',
  oth: 'other',
}

const REJECT_LABELS: Record<string, string> = {
  incomplete_data: 'Неполные данные',
  duplicate: 'Дубликат',
  off_topic: 'Не наш формат',
  spam: 'Спам / реклама',
  other: 'Другое',
}

export type ContentOpsTelegramSettings = {
  manager_chat_id?: string
  moderation_chat_id?: string
  parser_source_chats?: string[]
}

async function telegram(token: string, method: string, body: Record<string, unknown>): Promise<any> {
  const res = await fetch(`${TELEGRAM_API(token)}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Telegram ${method}: ${res.status} ${text}`)
  }
  return res.json()
}

export function resolveTelegramModerationChatIds(settings: ContentOpsTelegramSettings | undefined): string[] {
  const moderation = String(settings?.moderation_chat_id || '').trim()
  const manager = String(settings?.manager_chat_id || '').trim()
  const ids: string[] = []
  if (moderation) ids.push(moderation)
  if (manager && manager !== moderation) ids.push(manager)
  return ids
}

export function formatContentSubmissionCard(args: {
  submissionId: string
  cityName: string
  citySlug: string
  status: string
  sourceKind: string | null
  payload: EventParseResult | Record<string, unknown>
}): string {
  const p = args.payload as EventParseResult
  const shortId = args.submissionId.slice(0, 8)
  const dates = Array.isArray(p.recurrence?.dates) ? p.recurrence.dates : []
  const dateLine = dates.length ? dates.slice(0, 2).join(', ') : 'дата не указана'
  const venueName = p.venue?.name || '—'
  const venueAddress = p.venue?.address ? ` · ${p.venue.address}` : ''
  const priceLine = p.is_free
    ? 'Бесплатно'
    : typeof p.price_from === 'number'
      ? `от ${p.price_from} ₽`
      : '—'
  const tags = Array.isArray(p.topic_tags) && p.topic_tags.length ? p.topic_tags.join(', ') : '—'

  return [
    `📋 Заявка #${shortId}`,
    `Город: ${args.cityName} (${args.citySlug})`,
    `Статус: ${args.status}`,
    `Источник: ${args.sourceKind || p.source?.kind || '—'}`,
    '────────────────',
    String(p.title || 'Без названия'),
    `📅 ${dateLine}`,
    `📍 ${venueName}${venueAddress}`,
    `💰 ${priceLine}${typeof p.capacity === 'number' ? ` · ${p.capacity} мест` : ''}`,
    `🏷 ${tags}`,
    p.source?.url ? `🔗 ${p.source.url}` : null,
    '────────────────',
    String(p.description || '').slice(0, 500),
  ].filter(Boolean).join('\n')
}

/** Кнопки модерации до публикации (без оценки). */
export function buildContentSubmissionMainKeyboard(
  submissionId: string,
  editLinks?: { telegramUrl: string | null; httpsUrl: string | null } | null,
) {
  const rows: Array<Array<Record<string, string>>> = [
    [
      { text: '✅ Опубликовать', callback_data: `inuu:sub:approve:${submissionId}` },
      { text: '✏️ На доработку', callback_data: `inuu:sub:revise:${submissionId}` },
    ],
    [
      { text: '❌ Отклонить', callback_data: `inuu:sub:reject:${submissionId}` },
    ],
  ]
  // web_app в inline-клавиатуре работает только в личке с ботом; в группе менеджеров — url / t.me startapp.
  const editUrl = editLinks?.telegramUrl || editLinks?.httpsUrl
  if (editUrl) {
    rows.push([{ text: '🛠 Редактировать', url: editUrl }])
  }
  return { inline_keyboard: rows }
}

function buildMaxContentSubmissionAttachments(editLinks: { httpsUrl: string | null; telegramUrl: string | null } | null) {
  const rows: Array<Array<Record<string, unknown>>> = []
  const editUrl = editLinks?.httpsUrl || editLinks?.telegramUrl
  if (editUrl) {
    rows.push([{ type: 'link', text: '🛠 Редактировать', url: editUrl }])
  }
  if (!rows.length) return undefined
  return [{ type: 'inline_keyboard', payload: { buttons: rows } }]
}

/** Оценка редакции — только после approve и публикации события. */
export function buildContentSubmissionScoreKeyboard(submissionId: string) {
  return {
    inline_keyboard: [
      [
        { text: '⭐1', callback_data: `inuu:sub:score:${submissionId}:1` },
        { text: '⭐2', callback_data: `inuu:sub:score:${submissionId}:2` },
        { text: '⭐3', callback_data: `inuu:sub:score:${submissionId}:3` },
        { text: '⭐4', callback_data: `inuu:sub:score:${submissionId}:4` },
        { text: '⭐5', callback_data: `inuu:sub:score:${submissionId}:5` },
      ],
    ],
  }
}

function buildRejectReasonKeyboard(submissionId: string) {
  return {
    inline_keyboard: [
      [
        { text: 'Неполные данные', callback_data: `inuu:sub:rej:${submissionId}:inc` },
        { text: 'Дубликат', callback_data: `inuu:sub:rej:${submissionId}:dup` },
      ],
      [
        { text: 'Не наш формат', callback_data: `inuu:sub:rej:${submissionId}:off` },
        { text: 'Спам', callback_data: `inuu:sub:rej:${submissionId}:spam` },
      ],
      [
        { text: 'Другое', callback_data: `inuu:sub:rej:${submissionId}:oth` },
        { text: '← Назад', callback_data: `inuu:sub:rej_cancel:${submissionId}` },
      ],
    ],
  }
}

export async function sendContentSubmissionModerationCards(
  event: H3Event,
  args: {
    submissionId: string
    botToken: string
    chatIds: string[]
    primaryChatId?: string | null
  },
): Promise<{ sent: number; primaryMessageId: number | null }> {
  const uniqueChatIds = [...new Set(args.chatIds.map((x) => String(x).trim()).filter(Boolean))]
  if (!uniqueChatIds.length) {
    return { sent: 0, primaryMessageId: null }
  }

  const client = await serverSupabaseServiceRole(event)
  const { data: submission, error } = await client
    .from('content_submissions')
    .select('id,city_id,kind,status,payload,source_kind,moderation_message_id')
    .eq('id', args.submissionId)
    .maybeSingle()

  if (error || !submission?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Submission not found' })
  }

  const { data: city } = await client
    .from('cities')
    .select('name,slug')
    .eq('id', (submission as any).city_id)
    .maybeSingle()

  const text = formatContentSubmissionCard({
    submissionId: String(submission.id),
    cityName: String((city as any)?.name || (city as any)?.slug || 'город'),
    citySlug: String((city as any)?.slug || ''),
    status: String((submission as any).status || 'pending'),
    sourceKind: (submission as any).source_kind ? String((submission as any).source_kind) : null,
    payload: ((submission as any).payload || {}) as EventParseResult,
  })

  const citySlug = String((city as any)?.slug || '')
  const editLinks = buildContentSubmissionEditLinks(event, {
    submissionId: String(submission.id),
    citySlug,
  })
  if (!editLinks.telegramUrl && !editLinks.httpsUrl) {
    console.warn('[inuuContentModeration] edit link skipped: set NUXT_APP_URL or telegram bot name')
  }
  const keyboard = buildContentSubmissionMainKeyboard(String(submission.id), editLinks)
  const primaryChat = String(args.primaryChatId || uniqueChatIds[0] || '').trim()
  let primaryMessageId: number | null = null
  let sent = 0

  for (const chatId of uniqueChatIds) {
    try {
      const res = await telegram(args.botToken, 'sendMessage', {
        chat_id: chatId,
        text,
        reply_markup: keyboard,
      })
      const msgId = Number(res?.result?.message_id)
      if (Number.isFinite(msgId)) {
        sent += 1
        if (chatId === primaryChat) primaryMessageId = msgId
        if (!primaryMessageId) primaryMessageId = msgId
      }
    } catch (err) {
      console.error(`[inuuContentModeration] send to ${chatId} failed:`, err)
    }
  }

  if (primaryMessageId && primaryChat) {
    await client
      .from('content_submissions')
      .update({
        moderation_chat_id: primaryChat,
        moderation_message_id: primaryMessageId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', args.submissionId)
  }

  return { sent, primaryMessageId }
}

/** После approve события — показать ⭐1–5 в чате модерации. */
export async function showPostApproveScoreKeyboard(
  event: H3Event,
  args: {
    submissionId: string
    botToken: string
    publishPath?: string | null
    chatId?: string | null
    messageId?: number | null
  },
): Promise<void> {
  const client = await serverSupabaseServiceRole(event)
  const { data: submission } = await client
    .from('content_submissions')
    .select('id,city_id,status,payload,source_kind,moderation_chat_id,moderation_message_id,published_entity_type')
    .eq('id', args.submissionId)
    .maybeSingle()

  if (!submission?.id) return
  if ((submission as any).published_entity_type !== 'event') return

  const chatId = String(args.chatId || (submission as any).moderation_chat_id || '').trim()
  const messageId = Number(
    args.messageId ?? (submission as any).moderation_message_id,
  )
  if (!chatId || !Number.isFinite(messageId)) return

  const { data: city } = await client
    .from('cities')
    .select('name,slug')
    .eq('id', (submission as any).city_id)
    .maybeSingle()

  const suffix = args.publishPath
    ? `\n\n✅ Опубликовано на сайте\n${args.publishPath}\n\nОцените приоритет в ленте:`
    : '\n\n✅ Опубликовано\n\nОцените приоритет в ленте:'

  const text = `${formatContentSubmissionCard({
    submissionId: String(submission.id),
    cityName: String((city as any)?.name || ''),
    citySlug: String((city as any)?.slug || ''),
    status: 'approved',
    sourceKind: (submission as any).source_kind ? String((submission as any).source_kind) : null,
    payload: ((submission as any).payload || {}) as EventParseResult,
  })}${suffix}`

  const keyboard = buildContentSubmissionScoreKeyboard(args.submissionId)

  try {
    await telegram(args.botToken, 'editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
      reply_markup: keyboard,
    })
  } catch {
    await telegram(args.botToken, 'editMessageReplyMarkup', {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: keyboard,
    }).catch((err) => console.error('[inuuContentModeration] score keyboard:', err))
  }
}

export async function loadCityTelegramOpsSettings(
  event: H3Event,
  cityId: string,
): Promise<ContentOpsTelegramSettings> {
  const client = await serverSupabaseServiceRole(event)
  const { data } = await client
    .from('cities')
    .select('content_ops_settings')
    .eq('id', cityId)
    .maybeSingle()
  return (((data as any)?.content_ops_settings || {}).telegram || {}) as ContentOpsTelegramSettings
}

export async function refreshContentSubmissionModerationCard(
  event: H3Event,
  args: { submissionId: string; botToken: string },
): Promise<void> {
  const client = await serverSupabaseServiceRole(event)
  const { data: submission } = await client
    .from('content_submissions')
    .select('id,city_id,status,payload,source_kind,moderation_chat_id,moderation_message_id')
    .eq('id', args.submissionId)
    .maybeSingle()

  if (!submission?.id) return
  const chatId = String((submission as any).moderation_chat_id || '').trim()
  const messageId = Number((submission as any).moderation_message_id)
  if (!chatId || !Number.isFinite(messageId)) return

  const { data: city } = await client
    .from('cities')
    .select('name,slug')
    .eq('id', (submission as any).city_id)
    .maybeSingle()

  const citySlug = String((city as any)?.slug || '')
  const editLinks = buildContentSubmissionEditLinks(event, {
    submissionId: String(submission.id),
    citySlug,
  })
  const text = formatContentSubmissionCard({
    submissionId: String(submission.id),
    cityName: String((city as any)?.name || ''),
    citySlug,
    status: String((submission as any).status || 'pending'),
    sourceKind: (submission as any).source_kind ? String((submission as any).source_kind) : null,
    payload: ((submission as any).payload || {}) as EventParseResult,
  })
  const keyboard = buildContentSubmissionMainKeyboard(String(submission.id), editLinks)

  try {
    await telegram(args.botToken, 'editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
      reply_markup: keyboard,
    })
  } catch {
    await telegram(args.botToken, 'editMessageReplyMarkup', {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: keyboard,
    }).catch((err) => console.error('[inuuContentModeration] refresh card:', err))
  }
}

async function notifyContentSubmissionMaxChats(
  event: H3Event,
  args: { submissionId: string; cityId: string; force?: boolean },
): Promise<void> {
  const config = useRuntimeConfig(event)
  const maxBaseUrl = String(config.maxApiBaseUrl || '').trim()
  const maxToken = String(config.maxApiToken || '').trim()
  if (!maxBaseUrl || !maxToken) return

  const client = await serverSupabaseServiceRole(event)
  const { data: submission } = await client
    .from('content_submissions')
    .select('id,city_id,kind,status,payload,source_kind')
    .eq('id', args.submissionId)
    .maybeSingle()
  if (!submission?.id) return

  const { data: city } = await client
    .from('cities')
    .select('name,slug,content_ops_settings')
    .eq('id', args.cityId)
    .maybeSingle()

  const settings = (((city as any)?.content_ops_settings || {}) as ContentOpsSettings)
  const chatIds = resolveMaxModerationChatIds(settings)
  if (!chatIds.length) return

  const citySlug = String((city as any)?.slug || '')
  const editLinks = buildContentSubmissionEditLinks(event, {
    submissionId: String(submission.id),
    citySlug,
  })
  const text = formatContentSubmissionCard({
    submissionId: String(submission.id),
    cityName: String((city as any)?.name || citySlug),
    citySlug,
    status: String((submission as any).status || 'pending'),
    sourceKind: (submission as any).source_kind ? String((submission as any).source_kind) : null,
    payload: ((submission as any).payload || {}) as EventParseResult,
  })
  const attachments = buildMaxContentSubmissionAttachments(editLinks)
  const hint = '\n\nМодерация: кнопки ✅/❌ в Telegram-чате или «Редактировать» для правок в мини-приложении.'

  for (const conversationId of chatIds) {
    try {
      await sendMax(maxBaseUrl, maxToken, {
        conversationId,
        text: `${text}${hint}`,
        attachments,
      })
    } catch (err) {
      console.error(`[inuuContentModeration] MAX send to ${conversationId} failed:`, err)
    }
  }
}

export async function notifyContentSubmissionTelegramChats(
  event: H3Event,
  args: { submissionId: string; cityId: string; botToken: string; force?: boolean },
): Promise<void> {
  const client = await serverSupabaseServiceRole(event)
  const { data: existing } = await client
    .from('content_submissions')
    .select('moderation_message_id,moderation_chat_id,status')
    .eq('id', args.submissionId)
    .maybeSingle()

  const existingStatus = String((existing as any)?.status || '')
  const hasModerationCard = !!(existing as any)?.moderation_message_id
  const shouldRefreshCard =
    args.force === true || ['needs_revision', 'pending'].includes(existingStatus)

  if (!shouldRefreshCard && hasModerationCard) return

  if (shouldRefreshCard && hasModerationCard && (existing as any)?.moderation_chat_id) {
    await refreshContentSubmissionModerationCard(event, {
      submissionId: args.submissionId,
      botToken: args.botToken,
    }).catch((err) => console.error('[inuuContentModeration] refresh existing card:', err))
    await notifyContentSubmissionMaxChats(event, {
      submissionId: args.submissionId,
      cityId: args.cityId,
      force: args.force,
    })
    return
  }

  const settings = await loadCityTelegramOpsSettings(event, args.cityId)
  let chatIds = resolveTelegramModerationChatIds(settings)
  if (!chatIds.length) {
    const config = useRuntimeConfig(event)
    const fallback = String((config as any).inuuEditorialModerationChatId || process.env.NUXT_INUU_EDITORIAL_MODERATION_CHAT_ID || '').trim()
    if (fallback) chatIds = [fallback]
  }
  if (!chatIds.length) {
    console.warn('[inuuContentModeration] no manager/moderation chat configured for city', args.cityId)
    return
  }

  const primary = String(settings.moderation_chat_id || settings.manager_chat_id || chatIds[0] || '').trim()
  await sendContentSubmissionModerationCards(event, {
    submissionId: args.submissionId,
    botToken: args.botToken,
    chatIds,
    primaryChatId: primary || null,
  })
  await notifyContentSubmissionMaxChats(event, {
    submissionId: args.submissionId,
    cityId: args.cityId,
    force: args.force,
  })
}

export function parseInuuSubCallback(data: string): {
  action: 'approve' | 'revise' | 'reject' | 'rej' | 'rej_cancel' | 'score'
  submissionId: string
  rejectCode?: string
  score?: number
} | null {
  const parts = data.split(':')
  if (parts.length < 4 || parts[0] !== 'inuu' || parts[1] !== 'sub') return null
  const action = parts[2]
  const submissionId = parts[3]?.trim()
  if (!submissionId) return null

  if (action === 'approve' || action === 'revise' || action === 'reject' || action === 'rej_cancel') {
    return { action, submissionId }
  }
  if (action === 'rej' && parts[4]) {
    const short = parts[4].trim()
    return { action: 'rej', submissionId, rejectCode: REJECT_SHORT[short] || short }
  }
  if (action === 'score' && parts[4]) {
    const score = Number(parts[4])
    if (!Number.isFinite(score)) return null
    return { action: 'score', submissionId, score: Math.max(1, Math.min(5, Math.round(score))) }
  }
  return null
}

async function assertCanModerateInChat(
  event: H3Event,
  args: { botToken: string; chatId: string; userId: number; submissionId: string },
): Promise<{ submission: Record<string, unknown>; cityTelegram: ContentOpsTelegramSettings }> {
  const client = await serverSupabaseServiceRole(event)
  const { data: submission } = await client
    .from('content_submissions')
    .select('id,city_id,status,payload,moderation_chat_id,published_entity_type,published_entity_id')
    .eq('id', args.submissionId)
    .maybeSingle()

  if (!submission?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Submission not found' })
  }

  const settings = await loadCityTelegramOpsSettings(event, String((submission as any).city_id))
  const allowedChats = resolveTelegramModerationChatIds(settings)
  const storedChat = String((submission as any).moderation_chat_id || '').trim()
  if (storedChat && !allowedChats.includes(storedChat)) allowedChats.push(storedChat)

  if (!allowedChats.includes(String(args.chatId))) {
    throw createError({ statusCode: 403, statusMessage: 'Wrong moderation chat' })
  }

  const memberResult = await telegram(args.botToken, 'getChatMember', {
    chat_id: args.chatId,
    user_id: args.userId,
  }).catch(() => null)
  const memberStatus = String(memberResult?.result?.status || '').toLowerCase()
  if (!['creator', 'administrator', 'member'].includes(memberStatus)) {
    throw createError({ statusCode: 403, statusMessage: 'Not a chat member' })
  }

  return { submission: submission as Record<string, unknown>, cityTelegram: settings }
}

export async function handleInuuSubTelegramCallback(
  event: H3Event,
  args: {
    botToken: string
    callbackQueryId: string
    data: string
    chatId: number
    messageId: number
    fromId: number
    fromUsername?: string | null
  },
): Promise<{ alertText: string; showAlert: boolean }> {
  const parsed = parseInuuSubCallback(args.data)
  if (!parsed) {
    return { alertText: 'Некорректный callback', showAlert: true }
  }

  const { submission, cityTelegram } = await assertCanModerateInChat(event, {
    botToken: args.botToken,
    chatId: String(args.chatId),
    userId: args.fromId,
    submissionId: parsed.submissionId,
  })

  const client = await serverSupabaseServiceRole(event)
  const status = String(submission.status || '')
  if (parsed.action === 'score' && status !== 'approved') {
    return { alertText: 'Оценка доступна после публикации (✅ Опубликовать)', showAlert: false }
  }
  if (!['pending', 'needs_revision'].includes(status) && parsed.action !== 'score') {
    return { alertText: `Заявка уже в статусе: ${status}`, showAlert: false }
  }

  if (parsed.action === 'reject') {
    await telegram(args.botToken, 'editMessageReplyMarkup', {
      chat_id: args.chatId,
      message_id: args.messageId,
      reply_markup: buildRejectReasonKeyboard(parsed.submissionId),
    })
    return { alertText: 'Выберите причину отклонения', showAlert: false }
  }

  if (parsed.action === 'rej_cancel') {
    const client = await serverSupabaseServiceRole(event)
    const { data: subRow } = await client
      .from('content_submissions')
      .select('city_id')
      .eq('id', parsed.submissionId)
      .maybeSingle()
    let editLinks: { telegramUrl: string | null; httpsUrl: string | null } | null = null
    if (subRow?.city_id) {
      const { data: cityRow } = await client
        .from('cities')
        .select('slug')
        .eq('id', (subRow as any).city_id)
        .maybeSingle()
      editLinks = buildContentSubmissionEditLinks(event, {
        submissionId: parsed.submissionId,
        citySlug: String((cityRow as any)?.slug || ''),
      })
    }
    await telegram(args.botToken, 'editMessageReplyMarkup', {
      chat_id: args.chatId,
      message_id: args.messageId,
      reply_markup: buildContentSubmissionMainKeyboard(parsed.submissionId, editLinks),
    })
    return { alertText: 'Отменено', showAlert: false }
  }

  const reviewedPatch = {
    reviewed_by_telegram_id: args.fromId,
    reviewed_by_username: args.fromUsername ? String(args.fromUsername) : null,
    reviewed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  if (parsed.action === 'approve') {
    await client
      .from('content_submissions')
      .update({ status: 'approved', ...reviewedPatch })
      .eq('id', parsed.submissionId)
    let publishLabel = 'Одобрено'
    let publishedEvent = false
    let publishPath: string | null = null
    try {
      const published = await publishContentSubmission(event, parsed.submissionId)
      if (published.entityType === 'event') {
        publishedEvent = true
        publishPath = `/events/${published.entitySlug}`
        publishLabel = published.alreadyPublished
          ? 'Уже опубликовано — оцените приоритет'
          : `Опубликовано — оцените приоритет`
      } else {
        publishLabel = published.alreadyPublished
          ? 'Новость уже была опубликована'
          : 'Новость опубликована'
      }
    } catch (err) {
      console.error('[inuuContentModeration] publish on approve:', err)
      publishLabel = 'Одобрено, но публикация не удалась — проверьте дату/поля'
    }

    if (publishedEvent) {
      await showPostApproveScoreKeyboard(event, {
        submissionId: parsed.submissionId,
        botToken: args.botToken,
        publishPath,
        chatId: String(args.chatId),
        messageId: args.messageId,
      }).catch((err) => console.error('[inuuContentModeration] post-approve score UI:', err))
    } else {
      await telegram(args.botToken, 'editMessageReplyMarkup', {
        chat_id: args.chatId,
        message_id: args.messageId,
        reply_markup: { inline_keyboard: [] },
      })
    }
    return { alertText: publishLabel, showAlert: false }
  }

  if (parsed.action === 'revise') {
    await client
      .from('content_submissions')
      .update({ status: 'needs_revision', ...reviewedPatch })
      .eq('id', parsed.submissionId)
    await telegram(args.botToken, 'editMessageReplyMarkup', {
      chat_id: args.chatId,
      message_id: args.messageId,
      reply_markup: { inline_keyboard: [] },
    })
    return { alertText: 'Отправлено на доработку', showAlert: false }
  }

  if (parsed.action === 'rej' && parsed.rejectCode) {
    const code = parsed.rejectCode
    await client
      .from('content_submissions')
      .update({
        status: 'rejected',
        reject_reason_code: code,
        ...reviewedPatch,
      })
      .eq('id', parsed.submissionId)
    const label = REJECT_LABELS[code] || code
    await telegram(args.botToken, 'editMessageReplyMarkup', {
      chat_id: args.chatId,
      message_id: args.messageId,
      reply_markup: { inline_keyboard: [] },
    })
    return { alertText: `Отклонено: ${label}`, showAlert: false }
  }

  if (parsed.action === 'score' && parsed.score) {
    await client
      .from('content_submissions')
      .update({
        editorial_score: parsed.score,
        updated_at: new Date().toISOString(),
      })
      .eq('id', parsed.submissionId)

    const publishedEntityId = (submission as any).published_entity_id
    const publishedEntityType = (submission as any).published_entity_type
    if (publishedEntityType === 'event' && publishedEntityId) {
      await client
        .from('events')
        .update({
          is_promoted: parsed.score >= 4,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', String(publishedEntityId))
    }

    await telegram(args.botToken, 'editMessageReplyMarkup', {
      chat_id: args.chatId,
      message_id: args.messageId,
      reply_markup: { inline_keyboard: [] },
    })
    return { alertText: `Оценка ${parsed.score} сохранена`, showAlert: false }
  }

  void cityTelegram
  return { alertText: 'Действие не поддерживается', showAlert: true }
}
