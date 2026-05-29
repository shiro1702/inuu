import type { H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { runContentIngest } from '~/server/utils/contentIngestCore'
import { notifyContentSubmissionTelegramChats } from '~/server/utils/inuuContentModeration'

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

export type ContentOpsTelegramSettings = {
  manager_chat_id?: string
  moderation_chat_id?: string
  parser_source_chats?: string[]
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
  chat?: { id: number; type?: string; username?: string; title?: string }
  from?: { id?: number; username?: string }
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

function formatIngestReply(result: Awaited<ReturnType<typeof runContentIngest>>): string {
  const shortId = result.persisted.id ? result.persisted.id.slice(0, 8) : '—'
  const dupCount = result.duplicates.items.length
  const seriesCount = result.duplicates.seriesMatches?.length ?? 0
  const lines = [
    '✅ Анонс принят в обработку',
    `Город: ${result.city.name}`,
    `Заголовок: ${result.parse.title}`,
    `Статус: ${result.moderationStatus}`,
    `Уверенность AI: ${Math.round(result.parse.confidence * 100)}%`,
    `Очередь: ${result.persisted.ok ? `#${shortId}` : 'не сохранено'}`,
  ]
  if (result.persisted.resent) lines.push('Повторно отправлено на модерацию (обновлена карточка в чате менеджеров).')
  else if (result.persisted.warning) lines.push(`Примечание: ${result.persisted.warning}`)
  if (dupCount > 0) lines.push(`⚠️ Похожих событий в афише (та же дата): ${dupCount}`)
  if (seriesCount > 0) lines.push(`📅 Другие даты этого события уже в афише: ${seriesCount}`)
  const dateCount = result.parse.recurrence.dates.length
  if (dateCount > 1) lines.push(`Дат в анонсе: ${dateCount} (при публикации создадутся отдельные слоты)`)
  if (result.parse.missing_fields.length) {
    lines.push(`Не хватает полей: ${result.parse.missing_fields.slice(0, 5).join(', ')}`)
  }
  return lines.join('\n')
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
  if (rawText.length < 10) return false
  if (isParserSourceCommand(rawText)) return false

  const { sourceUrl, sourceExternalId } = buildSourceMeta(args.message, chatIdValue)

  await telegramSend(args.botToken, 'sendMessage', {
    chat_id: chatId,
    text: '⏳ Разбираю анонс через AI…',
    reply_to_message_id: args.message.message_id,
  }).catch((err) => console.error('[inuuContentBot] ack failed:', err))

  try {
    const result = await runContentIngest(event, {
      rawText,
      sourceKind: 'telegram_parse',
      sourceUrl,
      sourceExternalId,
      citySlug: city.slug,
      timezone: city.timezone,
      persist: true,
    })

    await telegramSend(args.botToken, 'sendMessage', {
      chat_id: chatId,
      text: formatIngestReply(result),
      reply_to_message_id: args.message.message_id,
    })

    if (result.persisted.ok && result.persisted.id) {
      await notifyContentSubmissionTelegramChats(event, {
        submissionId: result.persisted.id,
        cityId: result.city.id,
        botToken: args.botToken,
        force: result.persisted.resent === true,
      }).catch((err) => console.error('[inuuContentBot] moderation cards:', err))
    }

    return true
  } catch (err) {
    console.error('[inuuContentBot] ingest failed:', err)
    await telegramSend(args.botToken, 'sendMessage', {
      chat_id: chatId,
      text: '❌ Не удалось разобрать анонс. Проверьте GROQ API key и текст (минимум 10 символов).',
      reply_to_message_id: args.message.message_id,
    }).catch(() => {})
    return true
  }
}
