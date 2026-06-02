import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { EventParseResult } from '~/server/utils/ai/eventParseSchema'
import {
  isEditorialPayload,
  type EditorialParseResult,
} from '~/server/utils/ai/editorialParseSchema'
import { formatTopicTagsAsHashtags } from '~/server/utils/ingestSourceDisplayName'
import { formatDescriptionsForModeration } from '~/server/utils/eventParseDescriptions'
import { publishContentSubmission } from '~/server/utils/contentSubmissionPublish'
import {
  buildContentSubmissionEditLinks,
  buildPublicEventPageUrl,
} from '~/server/utils/contentSubmissionEditUrl'
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

const CONTENT_SUBMISSION_STATUS_LABELS: Record<string, string> = {
  draft: 'Черновик',
  pending: 'На модерации',
  needs_revision: 'На доработке',
  approved: 'Опубликовано',
  rejected: 'Отклонено',
}

const CONTENT_SUBMISSION_STATUS_EMOJI: Record<string, string> = {
  draft: '⚪',
  pending: '🟡',
  needs_revision: '🟠',
  approved: '🟢',
  rejected: '🔴',
}

const MODERATION_CARD_SELECT =
  'id,city_id,kind,status,payload,source_kind,moderation_chat_id,moderation_message_id,reviewed_by_username,reviewed_at,reject_reason_code,editorial_score'

const EDITORIAL_KIND_LABELS: Record<string, string> = {
  venue_review: 'Обзор места',
  venue_post: 'Пост о месте',
  news: 'Новость',
  story: 'Story',
}

export function formatContentSubmissionStatusLabel(status: string): string {
  const key = String(status || 'pending').trim()
  return CONTENT_SUBMISSION_STATUS_LABELS[key] || key
}

function formatModerationTimestamp(iso: string | null | undefined): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export type ContentSubmissionCardMeta = {
  reviewedByUsername?: string | null
  reviewedAt?: string | null
  rejectReasonCode?: string | null
  editorialScore?: number | null
  statusSuffix?: string | null
}

export function formatContentSubmissionStatusFooter(args: {
  status: string
} & ContentSubmissionCardMeta): string {
  const key = String(args.status || 'pending').trim()
  const emoji = CONTENT_SUBMISSION_STATUS_EMOJI[key] || '⚪'
  const label = formatContentSubmissionStatusLabel(key)
  const parts: string[] = [`${emoji} Статус: ${label}`]
  const user = args.reviewedByUsername ? String(args.reviewedByUsername).replace(/^@/, '') : ''
  if (user) parts.push(`@${user}`)
  const ts = formatModerationTimestamp(args.reviewedAt)
  if (ts) parts.push(ts)
  if (args.rejectReasonCode && REJECT_LABELS[args.rejectReasonCode]) {
    parts.push(REJECT_LABELS[args.rejectReasonCode])
  }
  if (typeof args.editorialScore === 'number') {
    parts.push(`⭐${args.editorialScore}`)
  }
  return parts.join(' · ')
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

export function formatSubmissionIdHeader(submissionId: string): string[] {
  const id = String(submissionId || '').trim()
  const shortId = id.slice(0, 8) || '—'
  return [
    `📋 Заявка #${shortId}`,
    id ? `🆔 ${id}` : null,
  ].filter(Boolean) as string[]
}

export function formatSubmissionEditMessageLines(submissionId: string): string[] {
  const id = String(submissionId || '').trim()
  const shortId = id.slice(0, 8) || '—'
  return [
    `✏️ Редактирование заявки #${shortId}`,
    id ? `🆔 ${id}` : null,
  ].filter(Boolean) as string[]
}

export function formatEditorialSubmissionCard(args: {
  submissionId: string
  cityName: string
  citySlug: string
  status: string
  sourceKind: string | null
  kind?: string | null
  payload: EditorialParseResult
  meta?: ContentSubmissionCardMeta
  needsOrg?: boolean
}): string {
  const p = args.payload
  const kindLabel = EDITORIAL_KIND_LABELS[String(args.kind || p.content_type)] || p.content_type
  const venueName = p.venue?.name || '—'
  const orgName = p.organization?.name || '—'
  const orgLine = p.organization?.id
    ? `🏢 ${orgName}`
    : `🏢 ${orgName} ⚠️ не привязана`
  const pubDate = p.publication_date ? `📆 Публикация: ${p.publication_date}` : null
  const tags = formatTopicTagsAsHashtags(Array.isArray(p.topic_tags) ? p.topic_tags : [])
  const meta = args.meta || {}

  const lines = [
    ...formatSubmissionIdHeader(args.submissionId),
    `Тип: ${kindLabel}`,
    `Город: ${args.cityName} (${args.citySlug})`,
    `Статус: ${formatContentSubmissionStatusLabel(args.status)}`,
    `Источник: ${args.sourceKind || p.source?.kind || '—'}`,
    '────────────────',
    String(p.title || 'Без названия'),
    pubDate,
    `📍 ${venueName}`,
    orgLine,
    p.video_url ? '🎬 Видео прикреплено' : null,
    `🏷 ${tags}`,
    p.source?.url ? `🔗 ${p.source.url}` : null,
    '────────────────',
    ...formatDescriptionsForModeration(p as unknown as Record<string, unknown>),
    '────────────────',
    formatContentSubmissionStatusFooter({ status: args.status, ...meta }),
    args.needsOrg ? '⚠️ Укажите организацию перед модерацией' : null,
    meta.statusSuffix || null,
  ]

  if (p.content_type === 'story' && p.story?.slides?.length) {
    lines.splice(7, 0, `📱 Слайдов: ${p.story.slides.length}`)
  }

  return lines.filter(Boolean).join('\n')
}

export function formatContentSubmissionCard(args: {
  submissionId: string
  cityName: string
  citySlug: string
  status: string
  sourceKind: string | null
  kind?: string | null
  payload: EventParseResult | Record<string, unknown>
  meta?: ContentSubmissionCardMeta
}): string {
  if (isEditorialPayload(args.payload)) {
    return formatEditorialSubmissionCard({
      ...args,
      payload: args.payload,
    })
  }

  const p = args.payload as EventParseResult
  const dates = Array.isArray(p.recurrence?.dates) ? p.recurrence.dates : []
  const dateLine = dates.length
    ? dates.length > 4
      ? `${dates.slice(0, 3).join(', ')} … (+${dates.length - 3})`
      : dates.join(', ')
    : 'дата не указана'
  const venueName = p.venue?.name || '—'
  const venueAddress = p.venue?.address ? ` · ${p.venue.address}` : ''
  const priceLine = p.is_free
    ? 'Бесплатно'
    : typeof p.price_from === 'number'
      ? `от ${p.price_from} ₽`
      : '—'
  const tags = formatTopicTagsAsHashtags(Array.isArray(p.topic_tags) ? p.topic_tags : [])
  const meta = args.meta || {}

  return [
    ...formatSubmissionIdHeader(args.submissionId),
    `Город: ${args.cityName} (${args.citySlug})`,
    `Статус: ${formatContentSubmissionStatusLabel(args.status)}`,
    `Источник: ${args.sourceKind || p.source?.kind || '—'}`,
    '────────────────',
    String(p.title || 'Без названия'),
    `📅 ${dateLine}`,
    `📍 ${venueName}${venueAddress}`,
    `💰 ${priceLine}${typeof p.capacity === 'number' ? ` · ${p.capacity} мест` : ''}`,
    `🏷 ${tags}`,
    p.source?.url ? `🔗 ${p.source.url}` : null,
    '────────────────',
    ...formatDescriptionsForModeration(p as unknown as Record<string, unknown>),
    '────────────────',
    formatContentSubmissionStatusFooter({ status: args.status, ...meta }),
    meta.statusSuffix || null,
  ].filter(Boolean).join('\n')
}

async function editModerationCardMessage(args: {
  botToken: string
  chatId: string
  messageId: number
  text: string
  keyboard?: Record<string, unknown> | null
}): Promise<void> {
  const markup = args.keyboard ?? undefined
  const base = {
    chat_id: args.chatId,
    message_id: args.messageId,
    reply_markup: markup,
  }
  try {
    await telegram(args.botToken, 'editMessageText', { ...base, text: args.text })
    return
  } catch {
    // photo cards use caption instead of text
  }
  try {
    await telegram(args.botToken, 'editMessageCaption', { ...base, caption: args.text })
    return
  } catch (err) {
    if (markup) {
      await telegram(args.botToken, 'editMessageReplyMarkup', {
        chat_id: args.chatId,
        message_id: args.messageId,
        reply_markup: markup,
      }).catch((fallbackErr) => console.error('[inuuContentModeration] edit card markup:', fallbackErr))
      return
    }
    console.error('[inuuContentModeration] edit card message:', err)
  }
}

async function buildContentSubmissionCardText(
  event: H3Event,
  submission: Record<string, unknown>,
  extras?: { statusSuffix?: string | null },
): Promise<string> {
  const client = await serverSupabaseServiceRole(event)
  const { data: city } = await client
    .from('cities')
    .select('name,slug')
    .eq('id', String(submission.city_id))
    .maybeSingle()

  return formatContentSubmissionCard({
    submissionId: String(submission.id),
    cityName: String((city as any)?.name || ''),
    citySlug: String((city as any)?.slug || ''),
    status: String(submission.status || 'pending'),
    sourceKind: submission.source_kind ? String(submission.source_kind) : null,
    kind: (submission as any).kind ? String((submission as any).kind) : null,
    payload: ((submission.payload || {}) as EventParseResult),
    meta: {
      reviewedByUsername: submission.reviewed_by_username ? String(submission.reviewed_by_username) : null,
      reviewedAt: submission.reviewed_at ? String(submission.reviewed_at) : null,
      rejectReasonCode: submission.reject_reason_code ? String(submission.reject_reason_code) : null,
      editorialScore: typeof submission.editorial_score === 'number' ? submission.editorial_score : null,
      statusSuffix: extras?.statusSuffix ?? null,
    },
  })
}

export async function updateContentSubmissionModerationCardInChat(
  event: H3Event,
  args: {
    submissionId: string
    botToken: string
    chatId?: string | null
    messageId?: number | null
    keyboard?: Record<string, unknown> | null
    statusSuffix?: string | null
  },
): Promise<void> {
  const client = await serverSupabaseServiceRole(event)
  const { data: submission } = await client
    .from('content_submissions')
    .select(MODERATION_CARD_SELECT)
    .eq('id', args.submissionId)
    .maybeSingle()

  if (!submission?.id) return
  const chatId = String(args.chatId || (submission as any).moderation_chat_id || '').trim()
  const messageId = Number(args.messageId ?? (submission as any).moderation_message_id)
  if (!chatId || !Number.isFinite(messageId)) return

  const text = await buildContentSubmissionCardText(event, submission as Record<string, unknown>, {
    statusSuffix: args.statusSuffix,
  })

  await editModerationCardMessage({
    botToken: args.botToken,
    chatId,
    messageId,
    text,
    keyboard: args.keyboard,
  })
}

function submissionCoverUrl(payload: Record<string, unknown>): string | null {
  const url = typeof payload.cover_media_url === 'string' ? payload.cover_media_url.trim() : ''
  return url || null
}

async function sendModerationCardMessage(args: {
  botToken: string
  chatId: string
  text: string
  keyboard: ReturnType<typeof buildContentSubmissionMainKeyboard>
  coverUrl: string | null
}): Promise<number | null> {
  const caption = args.text.length <= 1024 ? args.text : `${args.text.slice(0, 1020)}…`
  if (args.coverUrl) {
    const res = await telegram(args.botToken, 'sendPhoto', {
      chat_id: args.chatId,
      photo: args.coverUrl,
      caption,
      reply_markup: args.keyboard,
    })
    const msgId = Number(res?.result?.message_id)
    return Number.isFinite(msgId) ? msgId : null
  }
  const res = await telegram(args.botToken, 'sendMessage', {
    chat_id: args.chatId,
    text: args.text,
    reply_markup: args.keyboard,
  })
  const msgId = Number(res?.result?.message_id)
  return Number.isFinite(msgId) ? msgId : null
}

/** Кнопки модерации до публикации (без оценки). */
export function buildContentSubmissionMainKeyboard(submissionId: string) {
  return {
    inline_keyboard: [
      [
        { text: '✅ Опубликовать', callback_data: `inuu:sub:approve:${submissionId}` },
        { text: '✏️ На доработку', callback_data: `inuu:sub:revise:${submissionId}` },
      ],
      [
        { text: '❌ Отклонить', callback_data: `inuu:sub:reject:${submissionId}` },
      ],
      [
        // web_app и t.me?startapp= в группах не работают → callback → личка с web_app
        { text: '🛠 Редактировать', callback_data: `inuu:sub:edit:${submissionId}` },
      ],
    ],
  }
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

  const keyboard = buildContentSubmissionMainKeyboard(String(submission.id))
  const coverUrl = submissionCoverUrl(((submission as any).payload || {}) as Record<string, unknown>)
  const primaryChat = String(args.primaryChatId || uniqueChatIds[0] || '').trim()
  let primaryMessageId: number | null = null
  let sent = 0

  for (const chatId of uniqueChatIds) {
    try {
      const msgId = await sendModerationCardMessage({
        botToken: args.botToken,
        chatId,
        text,
        keyboard,
        coverUrl,
      })
      if (msgId) {
        sent += 1
        if (chatId === primaryChat) primaryMessageId = msgId
        if (!primaryMessageId) primaryMessageId = msgId
      }
    } catch (err) {
      console.error(`[inuuContentModeration] send to ${chatId} failed:`, err)
      if (coverUrl) {
        try {
          const msgId = await sendModerationCardMessage({
            botToken: args.botToken,
            chatId,
            text,
            keyboard,
            coverUrl: null,
          })
          if (msgId) {
            sent += 1
            if (chatId === primaryChat) primaryMessageId = msgId
            if (!primaryMessageId) primaryMessageId = msgId
          }
        } catch (fallbackErr) {
          console.error(`[inuuContentModeration] fallback send to ${chatId} failed:`, fallbackErr)
        }
      }
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
  const suffix = args.publishPath
    ? `✅ Опубликовано на сайте\n${args.publishPath}\n\nОцените приоритет в ленте:`
    : '✅ Опубликовано\n\nОцените приоритет в ленте:'

  await updateContentSubmissionModerationCardInChat(event, {
    submissionId: args.submissionId,
    botToken: args.botToken,
    chatId: args.chatId,
    messageId: args.messageId,
    keyboard: buildContentSubmissionScoreKeyboard(args.submissionId),
    statusSuffix: suffix,
  })
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
  await updateContentSubmissionModerationCardInChat(event, {
    submissionId: args.submissionId,
    botToken: args.botToken,
    keyboard: buildContentSubmissionMainKeyboard(args.submissionId),
  })
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
  action: 'approve' | 'revise' | 'reject' | 'rej' | 'rej_cancel' | 'score' | 'edit'
  submissionId: string
  rejectCode?: string
  score?: number
} | null {
  const parts = data.split(':')
  if (parts.length < 4 || parts[0] !== 'inuu' || parts[1] !== 'sub') return null
  const action = parts[2]
  const submissionId = parts[3]?.trim()
  if (!submissionId) return null

  if (action === 'approve' || action === 'revise' || action === 'reject' || action === 'rej_cancel' || action === 'edit') {
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

  if (parsed.action === 'edit') {
    if (status === 'rejected') {
      return { alertText: 'Заявка отклонена, редактирование недоступно', showAlert: false }
    }
    const { data: cityRow } = await client
      .from('cities')
      .select('slug')
      .eq('id', String((submission as any).city_id))
      .maybeSingle()
    const editLinks = buildContentSubmissionEditLinks(event, {
      submissionId: parsed.submissionId,
      citySlug: String((cityRow as any)?.slug || ''),
    })
    if (!editLinks.httpsUrl) {
      return { alertText: 'Не настроен NUXT_APP_URL на сервере', showAlert: true }
    }
    try {
      await telegram(args.botToken, 'sendMessage', {
        chat_id: args.fromId,
        text: [
          ...formatSubmissionEditMessageLines(parsed.submissionId),
          'Нажмите кнопку ниже — откроется форма в Mini App.',
        ].join('\n'),
        reply_markup: {
          inline_keyboard: [[{ text: '🛠 Открыть редактор', web_app: { url: editLinks.httpsUrl } }]],
        },
      })
      return { alertText: 'Форма отправлена вам в личку с ботом', showAlert: false }
    } catch (err) {
      console.error('[inuuContentModeration] edit DM failed:', err)
      return {
        alertText: 'Не удалось написать вам в личку. Откройте бота и отправьте /start, затем нажмите снова.',
        showAlert: true,
      }
    }
  }

  if (parsed.action === 'score' && status !== 'approved') {
    return { alertText: 'Оценка доступна после публикации (✅ Опубликовать)', showAlert: false }
  }
  const needsRepublish =
    status === 'approved'
    && !(submission as any).published_entity_id

  if (!['pending', 'needs_revision'].includes(status) && parsed.action !== 'score' && !needsRepublish) {
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
    await telegram(args.botToken, 'editMessageReplyMarkup', {
      chat_id: args.chatId,
      message_id: args.messageId,
      reply_markup: buildContentSubmissionMainKeyboard(parsed.submissionId),
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
    let publishLabel = 'Одобрено'
    let publishedEvent = false
    let publishPath: string | null = null
    const { data: cityRow } = await client
      .from('cities')
      .select('slug')
      .eq('id', String((submission as any).city_id))
      .maybeSingle()
    const citySlug = String((cityRow as any)?.slug || '').trim()
    try {
      const published = await publishContentSubmission(event, parsed.submissionId)
      await client
        .from('content_submissions')
        .update({ ...reviewedPatch })
        .eq('id', parsed.submissionId)
      if (published.entityType === 'event') {
        publishedEvent = true
        publishPath = buildPublicEventPageUrl(event, {
          citySlug,
          eventSlug: published.entitySlug,
        })
        publishLabel = published.alreadyPublished
          ? 'Уже опубликовано — оцените приоритет'
          : `Опубликовано — оцените приоритет`
      } else if (published.entityType === 'story_campaign') {
        publishLabel = published.alreadyPublished
          ? 'Story уже опубликована'
          : 'Story опубликована на главной'
      } else {
        publishLabel = published.alreadyPublished
          ? 'Материал уже был опубликован'
          : 'Материал опубликован'
      }
    } catch (err) {
      console.error('[inuuContentModeration] publish on approve:', err)
      const errMsg = err && typeof err === 'object' && 'statusMessage' in err
        ? String((err as { statusMessage?: string }).statusMessage)
        : err instanceof Error ? err.message : ''
      publishLabel = errMsg
        ? `Публикация не удалась: ${errMsg}`
        : 'Публикация не удалась — проверьте дату и обязательные поля'
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
      const newsSuffix = publishPath
        ? `✅ Опубликовано на сайте\n${publishPath}`
        : '✅ Материал опубликован'
      await updateContentSubmissionModerationCardInChat(event, {
        submissionId: parsed.submissionId,
        botToken: args.botToken,
        chatId: String(args.chatId),
        messageId: args.messageId,
        keyboard: { inline_keyboard: [] },
        statusSuffix: newsSuffix,
      }).catch((err) => console.error('[inuuContentModeration] post-approve news card:', err))
    }
    return { alertText: publishLabel, showAlert: false }
  }

  if (parsed.action === 'revise') {
    await client
      .from('content_submissions')
      .update({ status: 'needs_revision', ...reviewedPatch })
      .eq('id', parsed.submissionId)
    await updateContentSubmissionModerationCardInChat(event, {
      submissionId: parsed.submissionId,
      botToken: args.botToken,
      chatId: String(args.chatId),
      messageId: args.messageId,
      keyboard: { inline_keyboard: [] },
    }).catch((err) => console.error('[inuuContentModeration] revise card:', err))
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
    await updateContentSubmissionModerationCardInChat(event, {
      submissionId: parsed.submissionId,
      botToken: args.botToken,
      chatId: String(args.chatId),
      messageId: args.messageId,
      keyboard: { inline_keyboard: [] },
    }).catch((err) => console.error('[inuuContentModeration] reject card:', err))
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
    let scoreStatusSuffix: string | null = null
    if (publishedEntityType === 'event' && publishedEntityId) {
      await client
        .from('events')
        .update({
          is_promoted: parsed.score >= 4,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', String(publishedEntityId))

      const { data: cityRow } = await client
        .from('cities')
        .select('slug')
        .eq('id', String((submission as any).city_id))
        .maybeSingle()
      const { data: eventRow } = await client
        .from('events')
        .select('slug')
        .eq('id', String(publishedEntityId))
        .maybeSingle()
      const publishUrl = buildPublicEventPageUrl(event, {
        citySlug: String((cityRow as any)?.slug || ''),
        eventSlug: String((eventRow as any)?.slug || ''),
      })
      if (publishUrl) scoreStatusSuffix = `✅ Опубликовано на сайте\n${publishUrl}`
    }

    await updateContentSubmissionModerationCardInChat(event, {
      submissionId: parsed.submissionId,
      botToken: args.botToken,
      chatId: String(args.chatId),
      messageId: args.messageId,
      keyboard: { inline_keyboard: [] },
      statusSuffix: scoreStatusSuffix,
    }).catch((err) => console.error('[inuuContentModeration] score card:', err))
    return { alertText: `Оценка ${parsed.score} сохранена`, showAlert: false }
  }

  void cityTelegram
  return { alertText: 'Действие не поддерживается', showAlert: true }
}

// --- Digest batch moderation ---

export function formatDigestBatchCard(args: {
  batchId: string
  cityName: string
  citySlug: string
  status: string
  payload: Record<string, unknown>
  itemCount: number
}): string {
  const p = args.payload
  const digest = (p.digest || {}) as Record<string, unknown>
  const digestTitle = String(digest.title || 'Афиша / digest')
  const period = digest.period ? String(digest.period) : '—'
  const events = Array.isArray(p.events) ? p.events : []
  const lines = events.slice(0, 12).map((ev: any, i: number) => {
    const dates = Array.isArray(ev?.recurrence?.dates) ? ev.recurrence.dates : []
    const dateStr = dates[0] ? String(dates[0]).slice(0, 16) : 'дата ?'
    return `${i + 1}. ${String(ev?.title || '—')} · ${dateStr}`
  })
  const more = events.length > 12 ? `\n… ещё ${events.length - 12}` : ''

  return [
    `📦 Пакет #${args.batchId.slice(0, 8)}`,
    `Город: ${args.cityName} (${args.citySlug})`,
    `Статус: ${args.status}`,
    `📅 ${digestTitle} (${period})`,
    `Событий: ${args.itemCount}`,
    '────────────────',
    ...lines,
    more,
    '────────────────',
    p.source && typeof p.source === 'object' && (p.source as any).url
      ? `🔗 ${(p.source as any).url}`
      : null,
  ].filter(Boolean).join('\n')
}

export function buildDigestBatchKeyboard(batchId: string) {
  return {
    inline_keyboard: [
      [
        { text: '✅ Одобрить все', callback_data: `inuu:digest:approve_all:${batchId}` },
        { text: '📋 По одному', callback_data: `inuu:digest:split:${batchId}` },
      ],
      [
        { text: '❌ Отклонить пакет', callback_data: `inuu:digest:reject:${batchId}` },
      ],
    ],
  }
}

export async function sendDigestBatchModerationCards(
  event: H3Event,
  args: {
    batchId: string
    botToken: string
    chatIds: string[]
    primaryChatId?: string | null
  },
): Promise<{ sent: number; primaryMessageId: number | null }> {
  const uniqueChatIds = [...new Set(args.chatIds.map((x) => String(x).trim()).filter(Boolean))]
  if (!uniqueChatIds.length) return { sent: 0, primaryMessageId: null }

  const client = await serverSupabaseServiceRole(event)
  const { data: batch, error } = await client
    .from('content_submissions')
    .select('id,city_id,status,payload,batch_role')
    .eq('id', args.batchId)
    .maybeSingle()

  if (error || !batch?.id || (batch as any).batch_role !== 'batch') {
    throw createError({ statusCode: 404, statusMessage: 'Digest batch not found' })
  }

  const { data: items } = await client
    .from('content_submissions')
    .select('id')
    .eq('batch_id', args.batchId)
    .eq('batch_role', 'item')

  const { data: city } = await client
    .from('cities')
    .select('name,slug,timezone')
    .eq('id', (batch as any).city_id)
    .maybeSingle()

  const text = formatDigestBatchCard({
    batchId: String(batch.id),
    cityName: String((city as any)?.name || ''),
    citySlug: String((city as any)?.slug || ''),
    status: String((batch as any).status || 'pending'),
    payload: ((batch as any).payload || {}) as Record<string, unknown>,
    itemCount: (items ?? []).length,
  })

  const keyboard = buildDigestBatchKeyboard(String(batch.id))
  const primaryChat = String(args.primaryChatId || uniqueChatIds[0] || '').trim()
  let primaryMessageId: number | null = null
  let sent = 0

  for (const chatId of uniqueChatIds) {
    try {
      const msgId = await sendModerationCardMessage({
        botToken: args.botToken,
        chatId,
        text,
        keyboard: keyboard as any,
        coverUrl: null,
      })
      if (msgId) {
        sent += 1
        if (chatId === primaryChat) primaryMessageId = msgId
        if (!primaryMessageId) primaryMessageId = msgId
      }
    } catch (err) {
      console.error(`[inuuContentModeration] digest batch send to ${chatId} failed:`, err)
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
      .eq('id', args.batchId)
  }

  return { sent, primaryMessageId }
}

export async function notifyContentIngestModeration(
  event: H3Event,
  args: {
    ingestResult: {
      parseKind: 'single' | 'digest'
      persisted: { ok: boolean; id: string | null; resent?: boolean }
      items: Array<{ submissionId: string | null }>
    }
    cityId: string
    botToken: string
    force?: boolean
  },
): Promise<void> {
  if (!args.ingestResult.persisted.ok || !args.ingestResult.persisted.id) return

  if (args.ingestResult.parseKind === 'digest') {
    const settings = await loadCityTelegramOpsSettings(event, args.cityId)
    let chatIds = resolveTelegramModerationChatIds(settings)
    if (!chatIds.length) {
      const config = useRuntimeConfig(event)
      const fallback = String((config as any).inuuEditorialModerationChatId || process.env.NUXT_INUU_EDITORIAL_MODERATION_CHAT_ID || '').trim()
      if (fallback) chatIds = [fallback]
    }
    if (!chatIds.length) return
    const primary = String(settings.moderation_chat_id || settings.manager_chat_id || chatIds[0] || '').trim()
    await sendDigestBatchModerationCards(event, {
      batchId: args.ingestResult.persisted.id,
      botToken: args.botToken,
      chatIds,
      primaryChatId: primary || null,
    })
    return
  }

  const firstItemId = args.ingestResult.items[0]?.submissionId || args.ingestResult.persisted.id
  if (!firstItemId) return
  await notifyContentSubmissionTelegramChats(event, {
    submissionId: firstItemId,
    cityId: args.cityId,
    botToken: args.botToken,
    force: args.force ?? args.ingestResult.persisted.resent === true,
  })
}

export function parseInuuDigestCallback(data: string): {
  action: 'approve_all' | 'split' | 'reject'
  batchId: string
} | null {
  const parts = data.split(':')
  if (parts.length < 4 || parts[0] !== 'inuu' || parts[1] !== 'digest') return null
  const action = parts[2]
  const batchId = parts[3]?.trim()
  if (!batchId) return null
  if (action === 'approve_all' || action === 'split' || action === 'reject') {
    return { action, batchId }
  }
  return null
}

export async function handleInuuDigestTelegramCallback(
  event: H3Event,
  args: {
    botToken: string
    data: string
    chatId: number
    messageId: number
    fromId: number
    fromUsername?: string | null
  },
): Promise<{ alertText: string; showAlert: boolean }> {
  const parsed = parseInuuDigestCallback(args.data)
  if (!parsed) {
    return { alertText: 'Некорректный callback', showAlert: true }
  }

  await assertCanModerateInChat(event, {
    botToken: args.botToken,
    chatId: String(args.chatId),
    userId: args.fromId,
    submissionId: parsed.batchId,
  })

  const client = await serverSupabaseServiceRole(event)
  const { data: batch } = await client
    .from('content_submissions')
    .select('id,city_id,status,payload,batch_role')
    .eq('id', parsed.batchId)
    .maybeSingle()

  if (!batch?.id || (batch as any).batch_role !== 'batch') {
    return { alertText: 'Пакет не найден', showAlert: true }
  }

  const status = String((batch as any).status || '')
  if (status === 'rejected') {
    return { alertText: 'Пакет уже отклонён', showAlert: false }
  }

  const reviewedPatch = {
    reviewed_by_telegram_id: args.fromId,
    reviewed_by_username: args.fromUsername ? String(args.fromUsername) : null,
    reviewed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  const { data: city } = await client
    .from('cities')
    .select('slug,timezone')
    .eq('id', (batch as any).city_id)
    .maybeSingle()

  if (parsed.action === 'reject') {
    await client
      .from('content_submissions')
      .update({ status: 'rejected', reject_reason_code: 'off_topic', ...reviewedPatch })
      .eq('batch_id', parsed.batchId)
    await client
      .from('content_submissions')
      .update({ status: 'rejected', reject_reason_code: 'off_topic', ...reviewedPatch })
      .eq('id', parsed.batchId)
    await telegram(args.botToken, 'editMessageReplyMarkup', {
      chat_id: args.chatId,
      message_id: args.messageId,
      reply_markup: { inline_keyboard: [] },
    })
    return { alertText: 'Пакет отклонён', showAlert: false }
  }

  if (parsed.action === 'split') {
    const settings = await loadCityTelegramOpsSettings(event, String((batch as any).city_id))
    let chatIds = resolveTelegramModerationChatIds(settings)
    if (!chatIds.length) chatIds = [String(args.chatId)]

    const { data: items } = await client
      .from('content_submissions')
      .select('id')
      .eq('batch_id', parsed.batchId)
      .eq('batch_role', 'item')
      .order('batch_index', { ascending: true })

    for (const item of items ?? []) {
      await notifyContentSubmissionTelegramChats(event, {
        submissionId: String(item.id),
        cityId: String((batch as any).city_id),
        botToken: args.botToken,
        force: true,
      }).catch((err) => console.error('[digest split] item card:', err))
    }

    return { alertText: `Отправлено ${(items ?? []).length} карточек`, showAlert: false }
  }

  if (parsed.action === 'approve_all') {
    if (status === 'approved') {
      return { alertText: 'Пакет уже опубликован', showAlert: false }
    }

    const { data: items } = await client
      .from('content_submissions')
      .select('id,status,batch_index')
      .eq('batch_id', parsed.batchId)
      .eq('batch_role', 'item')
      .in('status', ['pending', 'needs_revision'])
      .order('batch_index', { ascending: true })

    const publishedItems: Array<{ eventId: string; batchIndex: number }> = []
    let failCount = 0

    for (const item of items ?? []) {
      try {
        const result = await publishContentSubmission(event, String(item.id))
        if (result.entityType === 'event' && result.entityId) {
          publishedItems.push({
            eventId: result.entityId,
            batchIndex: Number((item as any).batch_index) || 0,
          })
        }
      } catch (err) {
        failCount += 1
        console.error('[digest approve_all] item publish:', err)
      }
    }

    const batchPayload = ((batch as any).payload || {}) as Record<string, unknown>
    const digest = batchPayload.digest as import('~/server/utils/ai/eventParseSchema').EventDigestMeta | null

    let listSlug: string | null = null
    if (publishedItems.length) {
      const { syncDigestEventsToCuratedList } = await import('~/server/utils/curatedListPeriod')
      const synced = await syncDigestEventsToCuratedList(event, {
        cityId: String((batch as any).city_id),
        timeZone: String((city as any)?.timezone || 'Asia/Irkutsk'),
        digest,
        batchId: parsed.batchId,
        publishedItems,
      }).catch((err) => {
        console.error('[digest approve_all] curated list:', err)
        return null
      })
      listSlug = synced?.listSlug || null
    }

    await client
      .from('content_submissions')
      .update({ status: 'approved', ...reviewedPatch })
      .eq('id', parsed.batchId)

    await telegram(args.botToken, 'editMessageReplyMarkup', {
      chat_id: args.chatId,
      message_id: args.messageId,
      reply_markup: { inline_keyboard: [] },
    })

    const listHint = listSlug ? ` · подборка /lists/${listSlug}` : ''
    if (failCount > 0) {
      return {
        alertText: `Опубликовано ${publishedItems.length}, ошибок: ${failCount}${listHint}`,
        showAlert: true,
      }
    }
    return {
      alertText: `Опубликовано ${publishedItems.length} событий${listHint}`,
      showAlert: false,
    }
  }

  return { alertText: 'Действие не поддерживается', showAlert: true }
}
