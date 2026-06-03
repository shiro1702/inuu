import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { runContentIngest } from '~/server/utils/contentIngestCore'
import { extractUrls, hasIngestibleContent } from '~/server/utils/contentUrlEnricher'
import {
  loadCityTelegramOpsSettings,
  resolveTelegramModerationChatIds,
  type ContentOpsTelegramSettings,
} from '~/server/utils/inuuContentModeration'
import {
  addEventToCuratedList,
  removeEventFromCuratedList,
  resolvePeriodListMeta,
  upsertCuratedListForPeriod,
  type CuratedPeriod,
} from '~/server/utils/curatedListPeriod'
import { resolveTelegramIngestCover } from '~/server/utils/telegramContentMedia'

const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`

async function telegramSend(token: string, method: string, body: Record<string, unknown>): Promise<unknown> {
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

export type ParserSourceCityRow = {
  id: string
  slug: string
  name: string
  timezone: string
  content_ops_settings: {
    telegram?: ContentOpsTelegramSettings
  }
}

export type InuuTelegramMessage = {
  message_id?: number
  text?: string
  caption?: string
  video?: { file_id?: string; mime_type?: string; duration?: number }
  photo?: Array<{ file_id?: string; width?: number; height?: number }>
  chat?: { id: number; type?: string; username?: string; title?: string }
  from?: { id?: number; username?: string }
  reply_to_message?: InuuTelegramMessage
  forward_origin?: {
    type?: string
    chat?: { id?: number; username?: string; title?: string }
    message_id?: number
  }
  forward_from_chat?: { id?: number; username?: string; title?: string }
  forward_from_message_id?: number
}

function isParserSourceCommand(text: string): boolean {
  const trimmed = text.trim()
  const lower = trimmed.toLowerCase()
  return (
    lower.startsWith('/bindcity')
    || lower.startsWith('/bind ')
    || lower.startsWith('/bind_')
    || lower === '/bind'
    || lower.startsWith('/start')
    || lower === '/help'
    || lower.startsWith('/pick')
  )
}

export function extractTelegramMessageText(message: InuuTelegramMessage): string {
  const parts = [message.text, message.caption].filter((x) => typeof x === 'string' && x.trim())
  return parts.join('\n').trim()
}

function buildSourceMeta(message: InuuTelegramMessage, chatId: string): { sourceUrl: string | null; sourceExternalId: string } {
  const messageId = message.message_id
  const fwdChat = message.forward_origin?.chat || message.forward_from_chat
  const fwdMessageId = message.forward_origin?.message_id || message.forward_from_message_id

  if (fwdChat?.username && fwdMessageId) {
    return {
      sourceUrl: `https://t.me/${fwdChat.username}/${fwdMessageId}`,
      sourceExternalId: `${fwdChat.id ?? fwdChat.username}:${fwdMessageId}`,
    }
  }
  if (fwdChat?.id && fwdMessageId) {
    return {
      sourceUrl: null,
      sourceExternalId: `${fwdChat.id}:${fwdMessageId}`,
    }
  }
  if (messageId) {
    return {
      sourceUrl: null,
      sourceExternalId: `${chatId}:${messageId}`,
    }
  }
  return { sourceUrl: null, sourceExternalId: `${chatId}:${Date.now()}` }
}

export async function findCityByTelegramParserSourceChat(
  event: H3Event,
  chatId: string,
): Promise<ParserSourceCityRow | null> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('cities')
    .select('id,slug,name,timezone,content_ops_settings')
    .eq('is_active', true)

  if (error) {
    console.error('[inuuContentBot] cities load failed:', error)
    return null
  }

  const normalizedChatId = String(chatId)
  for (const row of data ?? []) {
    const settings = ((row as any).content_ops_settings || {}) as ParserSourceCityRow['content_ops_settings']
    const chats = Array.isArray(settings.telegram?.parser_source_chats)
      ? settings.telegram.parser_source_chats.map((x) => String(x))
      : []
    if (chats.includes(normalizedChatId)) {
      return row as ParserSourceCityRow
    }
  }
  return null
}

export async function findCityByTelegramModerationChat(
  event: H3Event,
  chatId: string,
): Promise<ParserSourceCityRow | null> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('cities')
    .select('id,slug,name,timezone,content_ops_settings')
    .eq('is_active', true)

  if (error) return null

  const normalizedChatId = String(chatId)
  for (const row of data ?? []) {
    const settings = (((row as any).content_ops_settings || {}).telegram || {}) as ContentOpsTelegramSettings
    const allowed = resolveTelegramModerationChatIds(settings)
    if (allowed.includes(normalizedChatId)) {
      return row as ParserSourceCityRow
    }
  }

  const config = useRuntimeConfig(event)
  const fallback = String((config as any).inuuEditorialModerationChatId || process.env.NUXT_INUU_EDITORIAL_MODERATION_CHAT_ID || '').trim()
  if (fallback === normalizedChatId && data?.length) {
    return (data.find((r: any) => r.slug === 'ulan-ude') || data[0]) as ParserSourceCityRow
  }
  return null
}

function formatIngestReply(result: Awaited<ReturnType<typeof runContentIngest>>): string {
  const shortId = result.persisted.id ? result.persisted.id.slice(0, 8) : '—'
  const eventCount = result.events.length
  const isDigest = result.parseKind === 'digest'

  const lines = isDigest
    ? [
        `✅ Распознано ${eventCount} событий (digest)`,
        result.digest?.title ? `📅 ${result.digest.title}` : null,
        `Город: ${result.city.name}`,
        `Статус пакета: ${result.moderationStatus}`,
      ]
    : [
        '✅ Анонс принят в обработку',
        `Город: ${result.city.name}`,
        `Заголовок: ${result.parse.title}`,
        `Статус: ${result.moderationStatus}`,
        `Уверенность AI: ${Math.round(result.parse.confidence * 100)}%`,
      ]

  lines.push(`Очередь: ${result.persisted.ok ? `#${shortId}` : 'не сохранено'}`)

  if (result.enrichedUrls?.length) {
    lines.push(`🔗 Загружено страниц: ${result.enrichedUrls.length}`)
  }
  if (result.persisted.resent) lines.push('Повторно отправлено на модерацию (обновлена карточка в чате менеджеров).')
  else if (result.persisted.warning) lines.push(`Примечание: ${result.persisted.warning}`)

  const dupTotal = result.items.reduce((n, i) => n + i.duplicates.items.length, 0)
  if (dupTotal > 0) lines.push(`⚠️ Похожих событий в афише: ${dupTotal}`)

  if (!isDigest) {
    const dateCount = result.parse.recurrence.dates.length
    if (dateCount > 1) lines.push(`Дат в анонсе: ${dateCount} (при публикации создадутся отдельные слоты)`)
    if (result.parse.missing_fields.length) {
      lines.push(`Не хватает полей: ${result.parse.missing_fields.slice(0, 5).join(', ')}`)
    }
  }

  return lines.filter(Boolean).join('\n')
}

function parsePickCommand(text: string): {
  action: 'pick' | 'list'
  period: CuratedPeriod
  listSlug?: string | null
} | null {
  const parts = text.trim().split(/\s+/).filter(Boolean)
  if (String(parts[0] || '').toLowerCase() !== '/pick') return null

  const p1 = String(parts[1] || '').toLowerCase()
  if (p1 === 'list') {
    const target = String(parts[2] || '').trim().toLowerCase()
    if (target === 'month') return { action: 'list', period: 'month', listSlug: null }
    if (target && target !== 'week') return { action: 'list', period: 'week', listSlug: target }
    return { action: 'list', period: 'week', listSlug: null }
  }

  return {
    action: 'pick',
    period: p1 === 'month' ? 'month' : 'week',
    listSlug: null,
  }
}

async function loadPeriodEvents(
  event: H3Event,
  args: { cityId: string; period: CuratedPeriod; timeZone: string },
) {
  const meta = resolvePeriodListMeta({ period: args.period, timeZone: args.timeZone })
  const client = await serverSupabaseServiceRole(event)
  const startIso = `${meta.periodStart}T00:00:00`
  const endIso = `${meta.periodEnd}T23:59:59`

  const { data } = await client
    .from('events')
    .select('id,slug,title,starts_at')
    .eq('city_id', args.cityId)
    .eq('is_published', true)
    .gte('starts_at', startIso)
    .lte('starts_at', endIso)
    .order('starts_at', { ascending: true })
    .limit(15)

  return { meta, events: data ?? [] }
}

export async function tryHandleInuuPickTelegramMessage(
  event: H3Event,
  args: { botToken: string; message: InuuTelegramMessage },
): Promise<boolean> {
  const chatId = args.message.chat?.id
  if (chatId === undefined) return false

  const rawText = extractTelegramMessageText(args.message)
  const pickCmd = parsePickCommand(rawText)
  const isReplyPick = rawText.trim().toLowerCase() === '/pick' && args.message.reply_to_message

  if (!pickCmd && !isReplyPick) return false

  const city = await findCityByTelegramModerationChat(event, String(chatId))
  if (!city) return false

  const client = await serverSupabaseServiceRole(event)

  if (isReplyPick) {
    const replyText = extractTelegramMessageText(args.message.reply_to_message!)
    const match = replyText.match(/#([a-f0-9]{8})/i)
    if (!match) {
      await telegramSend(args.botToken, 'sendMessage', {
        chat_id: chatId,
        text: 'Не удалось найти заявку в сообщении. Ответьте на карточку модерации.',
        reply_to_message_id: args.message.message_id,
      })
      return true
    }
    const prefix = match[1].toLowerCase()
    const { data: submissions } = await client
      .from('content_submissions')
      .select('id,published_entity_id,published_entity_type,status')
      .eq('city_id', city.id)
      .ilike('id', `${prefix}%`)
      .limit(5)

    const approved = (submissions ?? []).find(
      (s: any) => s.status === 'approved' && s.published_entity_type === 'event' && s.published_entity_id,
    )
    if (!approved) {
      await telegramSend(args.botToken, 'sendMessage', {
        chat_id: chatId,
        text: 'Сначала опубликуйте событие (✅), затем добавьте в подборку.',
        reply_to_message_id: args.message.message_id,
      })
      return true
    }

    const meta = resolvePeriodListMeta({ period: 'week', timeZone: city.timezone })
    const { listId } = await upsertCuratedListForPeriod(event, {
      cityId: city.id,
      meta,
      publish: true,
    })
    await addEventToCuratedList(event, {
      listId,
      eventId: String((approved as any).published_entity_id),
    })

    await telegramSend(args.botToken, 'sendMessage', {
      chat_id: chatId,
      text: `✅ Добавлено в подборку «${meta.title}» (/lists/${meta.slug})`,
      reply_to_message_id: args.message.message_id,
    })
    return true
  }

  if (!pickCmd) return false

  if (pickCmd.action === 'list') {
    const fallbackMeta = resolvePeriodListMeta({ period: pickCmd.period, timeZone: city.timezone })
    const targetSlug = pickCmd.listSlug || fallbackMeta.slug
    const { data: list } = await client
      .from('curated_lists')
      .select('id,title,slug')
      .eq('city_id', city.id)
      .eq('slug', targetSlug)
      .maybeSingle()

    if (!list?.id) {
      await telegramSend(args.botToken, 'sendMessage', {
        chat_id: chatId,
        text: `Подборка ${targetSlug} пока пуста. Используйте /pick ${pickCmd.period}`,
        reply_to_message_id: args.message.message_id,
      })
      return true
    }

    const { data: items } = await client
      .from('curated_list_items')
      .select('entity_id,sort_order')
      .eq('list_id', list.id)
      .eq('entity_type', 'event')
      .order('sort_order', { ascending: true })

    const eventIds = (items ?? []).map((i: any) => i.entity_id)
    const { data: events } = eventIds.length
      ? await client.from('events').select('id,title,starts_at').in('id', eventIds)
      : { data: [] }

    const lines = (events ?? []).map((ev: any, i: number) => {
      const d = ev.starts_at ? String(ev.starts_at).slice(0, 10) : '?'
      return `${i + 1}. ${ev.title} · ${d}`
    })

    await telegramSend(args.botToken, 'sendMessage', {
      chat_id: chatId,
      text: [
        `📋 ${(list as any).title}`,
        `/lists/${(list as any).slug}`,
        '────────────────',
        lines.length ? lines.join('\n') : 'Пока пусто',
      ].join('\n'),
      reply_to_message_id: args.message.message_id,
    })
    return true
  }

  const { meta, events } = await loadPeriodEvents(event, {
    cityId: city.id,
    period: pickCmd.period,
    timeZone: city.timezone,
  })

  if (!events.length) {
    await telegramSend(args.botToken, 'sendMessage', {
      chat_id: chatId,
      text: `Нет опубликованных событий на ${pickCmd.period === 'week' ? 'неделю' : 'месяц'}.`,
      reply_to_message_id: args.message.message_id,
    })
    return true
  }

  const buttons = events.slice(0, 12).map((ev: any) => [{
    text: `${String(ev.title).slice(0, 40)} · ${String(ev.starts_at).slice(0, 10)}`,
    callback_data: `inuu:pick:toggle:${ev.id}:${pickCmd.period}`,
  }])

  buttons.push([{
    text: '📤 Опубликовать подборку',
    callback_data: `inuu:pick:publish:${pickCmd.period}`,
  }])

  await telegramSend(args.botToken, 'sendMessage', {
    chat_id: chatId,
    text: [
      `Выберите события для «${meta.title}»`,
      'Нажмите — добавить/убрать из подборки.',
    ].join('\n'),
    reply_markup: { inline_keyboard: buttons },
    reply_to_message_id: args.message.message_id,
  })
  return true
}

export function parseInuuPickCallback(data: string): {
  action: 'toggle' | 'publish'
  eventId?: string
  period: CuratedPeriod
} | null {
  const parts = data.split(':')
  if (parts.length < 5 || parts[0] !== 'inuu' || parts[1] !== 'pick') return null
  const action = parts[2]
  if (action === 'publish') {
    const period = parts[3] === 'month' ? 'month' : 'week'
    return { action: 'publish', period }
  }
  if (action === 'toggle' && parts[3] && parts[4]) {
    const period = parts[4] === 'month' ? 'month' : 'week'
    return { action: 'toggle', eventId: parts[3], period }
  }
  return null
}

export async function sendCuratedListDraftNotification(
  event: H3Event,
  args: {
    botToken: string
    cityId: string
    cityName: string
    slug: string
    mode: 'weekly' | 'custom'
  },
): Promise<{ sent: number; targets: number; reason?: string }> {
  const token = String(args.botToken || '').trim()
  if (!token) return { sent: 0, targets: 0, reason: 'bot_token_missing' }
  const settings = await loadCityTelegramOpsSettings(event, args.cityId)
  let chatIds = resolveTelegramModerationChatIds(settings)
  if (!chatIds.length) {
    const config = useRuntimeConfig(event)
    const fallback = String((config as any).inuuEditorialModerationChatId || process.env.NUXT_INUU_EDITORIAL_MODERATION_CHAT_ID || '').trim()
    if (fallback) chatIds = [fallback]
  }
  if (!chatIds.length) return { sent: 0, targets: 0, reason: 'chat_ids_missing' }

  const uniqueChatIds = [...new Set(chatIds.map((id) => String(id).trim()).filter(Boolean))]
  const modeLabel = args.mode === 'weekly' ? 'weekly' : 'custom'
  const text = [
    `🧠 Черновик подборки создан (${modeLabel})`,
    `Город: ${args.cityName}`,
    `Список: /lists/${args.slug}`,
    'Команды:',
    '• /pick list week',
    `• /pick list ${args.slug}`,
  ].join('\n')
  let sent = 0
  for (const chatId of uniqueChatIds) {
    await telegramSend(token, 'sendMessage', {
      chat_id: chatId,
      text,
    }).then(() => {
      sent += 1
    }).catch((err) => {
      console.error('[inuuContentBot] curated notification failed:', err)
    })
  }
  return { sent, targets: uniqueChatIds.length }
}

export async function handleInuuPickTelegramCallback(
  event: H3Event,
  args: {
    botToken: string
    data: string
    chatId: number
    fromId: number
  },
): Promise<{ alertText: string; showAlert: boolean }> {
  const parsed = parseInuuPickCallback(args.data)
  if (!parsed) return { alertText: 'Некорректный callback', showAlert: true }

  const city = await findCityByTelegramModerationChat(event, String(args.chatId))
  if (!city) return { alertText: 'Чат не привязан к городу', showAlert: true }

  const meta = resolvePeriodListMeta({ period: parsed.period, timeZone: city.timezone })
  const { listId } = await upsertCuratedListForPeriod(event, {
    cityId: city.id,
    meta,
    publish: parsed.action === 'publish',
  })

  if (parsed.action === 'publish') {
    return { alertText: `Подборка опубликована: /lists/${meta.slug}`, showAlert: false }
  }

  if (!parsed.eventId) return { alertText: 'Нет event id', showAlert: true }

  const client = await serverSupabaseServiceRole(event)
  const { data: existing } = await client
    .from('curated_list_items')
    .select('id')
    .eq('list_id', listId)
    .eq('entity_type', 'event')
    .eq('entity_id', parsed.eventId)
    .maybeSingle()

  if (existing?.id) {
    await removeEventFromCuratedList(event, { listId, eventId: parsed.eventId })
    return { alertText: 'Убрано из подборки', showAlert: false }
  }

  await addEventToCuratedList(event, { listId, eventId: parsed.eventId })
  return { alertText: 'Добавлено в подборку', showAlert: false }
}

export async function tryHandleInuuParserSourceTelegramMessage(
  event: H3Event,
  args: { botToken: string; message: InuuTelegramMessage },
): Promise<boolean> {
  const chatId = args.message.chat?.id
  if (chatId === undefined) return false

  const chatIdValue = String(chatId)
  const city = await findCityByTelegramParserSourceChat(event, chatIdValue)
  if (!city) return false

  const rawText = extractTelegramMessageText(args.message)
  if (!hasIngestibleContent(rawText)) return false
  if (isParserSourceCommand(rawText)) return false

  const { sourceUrl, sourceExternalId } = buildSourceMeta(args.message, chatIdValue)
  const urlsInText = extractUrls(rawText)
  const coverSourceUrl =
    sourceUrl
    || urlsInText.find((url) => /(?:t\.me|telegram\.me)\//i.test(url))
    || urlsInText[0]
    || null

  const coverMediaUrl = await resolveTelegramIngestCover(event, {
    botToken: args.botToken,
    message: args.message,
    cityId: city.id,
    sourceExternalId,
    sourceUrl: coverSourceUrl,
  })

  await telegramSend(args.botToken, 'sendMessage', {
    chat_id: chatId,
    text: '⏳ Разбираю анонс через AI…',
    reply_to_message_id: args.message.message_id,
  }).catch((err) => console.error('[inuuContentBot] ack failed:', err))

  try {
    const result = await runContentIngest(event, {
      rawText,
      sourceKind: 'telegram_parse',
      sourceIntake: 'telegram_group',
      sourceUrl,
      sourceExternalId,
      citySlug: city.slug,
      timezone: city.timezone,
      coverMediaUrl,
      persist: true,
      moderationBotToken: args.botToken,
    })

    await telegramSend(args.botToken, 'sendMessage', {
      chat_id: chatId,
      text: formatIngestReply(result),
      reply_to_message_id: args.message.message_id,
    })

    return true
  } catch (err) {
    console.error('[inuuContentBot] ingest failed:', err)
    await telegramSend(args.botToken, 'sendMessage', {
      chat_id: chatId,
      text: '❌ Не удалось разобрать анонс. Проверьте GROQ API key и текст (минимум 10 символов или ссылка).',
      reply_to_message_id: args.message.message_id,
    }).catch(() => {})
    return true
  }
}
