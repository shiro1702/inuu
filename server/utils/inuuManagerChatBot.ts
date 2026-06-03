import { createError, type H3Event } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import type { EditorialParseResult } from '~/server/utils/ai/editorialParseSchema'
import {
  submissionKindFromEditorial,
  type EditorialContentType,
} from '~/server/utils/ai/editorialParseSchema'
import { parseEditorialWithGroq } from '~/server/utils/ai/groqEditorialParser'
import { loadCityParseTaxonomy, resolveParsedTaxonomy } from '~/server/utils/cityContentTaxonomy'
import {
  attachShadowOrgToEditorialPayload,
  editorialMissingOrg,
  enrichEditorialOrganization,
} from '~/server/utils/editorialOrgResolve'
import {
  extractTelegramMessageText,
  type InuuTelegramMessage,
  type ParserSourceCityRow,
} from '~/server/utils/inuuContentBot'
import {
  formatEditorialSubmissionCard,
  notifyContentSubmissionTelegramChats,
} from '~/server/utils/inuuContentModeration'
import {
  ingestTelegramMessageCover,
  ingestTelegramMessageVideo,
  resolveTelegramIngestCover,
} from '~/server/utils/telegramContentMedia'
import { hasIngestibleContent } from '~/server/utils/contentUrlEnricher'

const TELEGRAM_API = (token: string) => `https://api.telegram.org/bot${token}`

async function telegramSend(token: string, method: string, body: Record<string, unknown>) {
  const res = await fetch(`${TELEGRAM_API(token)}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Telegram ${method}: ${res.status} ${await res.text()}`)
  return res.json() as Promise<{ ok?: boolean; result?: { message_id?: number } }>
}

export async function findCityByTelegramManagerChat(
  event: H3Event,
  chatId: string,
): Promise<ParserSourceCityRow | null> {
  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('cities')
    .select('id,slug,name,timezone,content_ops_settings')
    .eq('is_active', true)

  if (error) return null

  const normalized = String(chatId)
  for (const row of data ?? []) {
    const manager = String(
      ((row as any).content_ops_settings || {}).telegram?.manager_chat_id || '',
    ).trim()
    if (manager && manager === normalized) {
      return row as ParserSourceCityRow
    }
  }
  return null
}

function isManagerChatCommand(text: string): boolean {
  const lower = text.trim().toLowerCase()
  return (
    lower.startsWith('/review')
    || lower.startsWith('/place')
    || lower.startsWith('/post')
    || lower.startsWith('/story')
  )
}

function parseContentTypeFromCommand(text: string): EditorialContentType | null {
  const lower = text.trim().toLowerCase()
  if (lower.startsWith('/review') || lower.startsWith('/place')) return 'venue_review'
  if (lower.startsWith('/post')) return 'venue_post'
  if (lower.startsWith('/story')) return 'story'
  return null
}

function stripCommandPrefix(text: string): string {
  return text.replace(/^\/\w+(@\w+)?\s*/i, '').trim()
}

function buildManagerPreviewKeyboard(submissionId: string, needsOrg: boolean) {
  const rows: Array<Array<{ text: string; callback_data: string }>> = []
  if (needsOrg) {
    rows.push([
      { text: '➕ Создать организацию', callback_data: `inuu:mgr:org:create:${submissionId}` },
    ])
  }
  rows.push(
    [{ text: '✅ В модерацию', callback_data: `inuu:mgr:moderate:${submissionId}` }],
    [{ text: '❌ Отмена', callback_data: `inuu:mgr:cancel:${submissionId}` }],
  )
  return { inline_keyboard: rows }
}

async function resolveManagerMedia(
  event: H3Event,
  args: {
    botToken: string
    message: InuuTelegramMessage
    cityId: string
    sourceExternalId: string
    sourceUrl: string | null
  },
): Promise<{ coverMediaUrl: string | null; videoUrl: string | null }> {
  const coverMediaUrl = await resolveTelegramIngestCover(event, {
    botToken: args.botToken,
    message: args.message,
    cityId: args.cityId,
    sourceExternalId: args.sourceExternalId,
    sourceUrl: args.sourceUrl,
  })
  const videoUrl = await ingestTelegramMessageVideo(event, {
    botToken: args.botToken,
    message: args.message,
    cityId: args.cityId,
    sourceExternalId: args.sourceExternalId,
  })
  return { coverMediaUrl, videoUrl }
}

export async function createManagerEditorialDraft(
  event: H3Event,
  args: {
    city: ParserSourceCityRow
    botToken: string
    message: InuuTelegramMessage
    contentTypeHint: EditorialContentType
    sourceUrl: string | null
    sourceExternalId: string
  },
): Promise<{ submissionId: string; payload: EditorialParseResult }> {
  const rawBase = extractTelegramMessageText(args.message)
  const rawText = stripCommandPrefix(rawBase) || rawBase
  if (!hasIngestibleContent(rawText) && !args.message.photo?.length && !args.message.video) {
    throw createError({ statusCode: 400, statusMessage: 'Need text, photo or video' })
  }

  const { coverMediaUrl, videoUrl } = await resolveManagerMedia(event, {
    botToken: args.botToken,
    message: args.message,
    cityId: args.city.id,
    sourceExternalId: args.sourceExternalId,
    sourceUrl: args.sourceUrl,
  })

  const taxonomy = await loadCityParseTaxonomy(event, args.city.id)
  const parseOutput = await parseEditorialWithGroq({
    rawText: rawText || 'Обзор места (см. медиа)',
    sourceKind: 'manual_editor',
    sourceUrl: args.sourceUrl,
    sourceExternalId: args.sourceExternalId,
    citySlug: args.city.slug,
    timezone: args.city.timezone,
    contentTypeHint: args.contentTypeHint,
    coverMediaUrl,
    videoUrl,
    hints: {
      availableTags: taxonomy.tags,
    },
  })

  const resolved = await resolveParsedTaxonomy(event, args.city.id, {
    topicTags: parseOutput.result.topic_tags,
    categorySlug: null,
  })

  let payload: EditorialParseResult = {
    ...parseOutput.result,
    topic_tags: resolved.topicTags,
    city_slug: args.city.slug,
    cover_media_url: coverMediaUrl || parseOutput.result.cover_media_url,
    video_url: videoUrl || parseOutput.result.video_url,
    source: {
      ...parseOutput.result.source,
      kind: 'manual_editor',
      intake: 'manual',
    },
  }

  if (coverMediaUrl && !payload.media_urls.includes(coverMediaUrl)) {
    payload.media_urls = [coverMediaUrl, ...payload.media_urls]
  }

  payload = await enrichEditorialOrganization(event, {
    cityId: args.city.id,
    citySlug: args.city.slug,
    payload,
    sourceUrl: args.sourceUrl,
  })

  if (args.contentTypeHint === 'story') {
    const slideUrls = payload.media_urls.length
      ? payload.media_urls
      : [coverMediaUrl, videoUrl].filter((u): u is string => !!u)
    if (!payload.story?.slides?.length && slideUrls.length) {
      payload.story = {
        title: payload.title,
        slides: slideUrls.map((url) => ({
          media_url: url,
          duration_seconds: 5,
          action_type: 'none' as const,
          action_payload: {},
        })),
      }
    } else if (payload.story?.slides?.length) {
      payload.story = {
        title: payload.story.title || payload.title,
        slides: payload.story.slides.map((s, idx) => ({
          ...s,
          media_url: s.media_url || slideUrls[idx] || slideUrls[0] || '',
        })),
      }
    }
    payload.content_type = 'story'
  }

  const kind = submissionKindFromEditorial(payload.content_type)
  const client = await serverSupabaseServiceRole(event)

  const { data: row, error } = await client
    .from('content_submissions')
    .insert({
      city_id: args.city.id,
      kind,
      status: 'draft',
      payload,
      source_kind: 'manual_editor',
      source_url: args.sourceUrl,
      source_external_id: args.sourceExternalId,
    } as any)
    .select('id')
    .maybeSingle()

  if (error || !row?.id) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to save draft',
    })
  }

  return { submissionId: String(row.id), payload }
}

export async function sendManagerEditorialPreview(
  event: H3Event,
  args: {
    botToken: string
    chatId: string
    replyToMessageId?: number
    submissionId: string
    city: ParserSourceCityRow
    payload: EditorialParseResult
  },
): Promise<void> {
  const needsOrg = editorialMissingOrg(args.payload)
  const text = formatEditorialSubmissionCard({
    submissionId: args.submissionId,
    cityName: args.city.name,
    citySlug: args.city.slug,
    status: 'draft',
    sourceKind: 'manual_editor',
    payload: args.payload,
    needsOrg,
  })
  const keyboard = buildManagerPreviewKeyboard(args.submissionId, needsOrg)
  const cover = args.payload.cover_media_url

  const base = {
    chat_id: args.chatId,
    reply_markup: keyboard,
    ...(args.replyToMessageId ? { reply_to_message_id: args.replyToMessageId } : {}),
  }

  if (cover) {
    await telegramSend(args.botToken, 'sendPhoto', {
      ...base,
      photo: cover,
      caption: text.length <= 1024 ? text : `${text.slice(0, 1020)}…`,
    })
  } else {
    await telegramSend(args.botToken, 'sendMessage', { ...base, text })
  }
}

export async function tryHandleInuuManagerChatMessage(
  event: H3Event,
  args: { botToken: string; message: InuuTelegramMessage },
): Promise<boolean> {
  const chatId = args.message.chat?.id
  if (chatId === undefined) return false

  const city = await findCityByTelegramManagerChat(event, String(chatId))
  if (!city) return false

  const rawText = extractTelegramMessageText(args.message)
  if (!hasIngestibleContent(rawText) && !args.message.photo?.length && !args.message.video) {
    if (!isManagerChatCommand(rawText)) return false
  }

  const chatIdValue = String(chatId)
  const { sourceUrl, sourceExternalId } = buildManagerSourceMeta(args.message, chatIdValue)

  let contentType = parseContentTypeFromCommand(rawText)
  if (!contentType) {
    if (args.message.video) {
      contentType = 'venue_review'
    } else if (hasIngestibleContent(rawText)) {
      await telegramSend(args.botToken, 'sendMessage', {
        chat_id: chatId,
        text: 'Выберите тип материала:',
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Обзор места', callback_data: `inuu:mgr:type:${chatIdValue}:venue_review` },
              { text: 'Пост о месте', callback_data: `inuu:mgr:type:${chatIdValue}:venue_post` },
            ],
            [
              { text: 'Story', callback_data: `inuu:mgr:type:${chatIdValue}:story` },
              { text: 'Новость', callback_data: `inuu:mgr:type:${chatIdValue}:news` },
            ],
          ],
        },
        reply_to_message_id: args.message.message_id,
      })
      return true
    }
    return false
  }

  await telegramSend(args.botToken, 'sendMessage', {
    chat_id: chatId,
    text: '⏳ Разбираю материал…',
    reply_to_message_id: args.message.message_id,
  }).catch(() => {})

  try {
    const { submissionId, payload } = await createManagerEditorialDraft(event, {
      city,
      botToken: args.botToken,
      message: args.message,
      contentTypeHint: contentType,
      sourceUrl,
      sourceExternalId,
    })

    await sendManagerEditorialPreview(event, {
      botToken: args.botToken,
      chatId: chatIdValue,
      replyToMessageId: args.message.message_id,
      submissionId,
      city,
      payload,
    })
    return true
  } catch (err) {
    console.error('[inuuManagerChatBot] draft failed:', err)
    await telegramSend(args.botToken, 'sendMessage', {
      chat_id: chatId,
      text: '❌ Не удалось разобрать материал. Добавьте текст (от 10 символов) или медиа.',
      reply_to_message_id: args.message.message_id,
    }).catch(() => {})
    return true
  }
}

function buildManagerSourceMeta(
  message: InuuTelegramMessage,
  chatId: string,
): { sourceUrl: string | null; sourceExternalId: string } {
  const messageId = message.message_id
  if (messageId) {
    return { sourceUrl: null, sourceExternalId: `mgr:${chatId}:${messageId}` }
  }
  return { sourceUrl: null, sourceExternalId: `mgr:${chatId}:${Date.now()}` }
}

export async function handleInuuManagerTelegramCallback(
  event: H3Event,
  args: {
    botToken: string
    data: string
    chatId: number
    messageId: number
    fromId: number
  },
): Promise<{ alertText: string; showAlert: boolean }> {
  const parts = args.data.split(':')
  if (parts.length < 4 || parts[0] !== 'inuu' || parts[1] !== 'mgr') {
    return { alertText: 'Некорректный callback', showAlert: true }
  }

  const action = parts[2]

  if (action === 'type') {
    return { alertText: 'Отправьте материал с командой /review, /post или /story', showAlert: false }
  }

  let submissionId = parts[3]?.trim() || ''
  if (action === 'org') {
    submissionId = parts[4]?.trim() || ''
  }
  if (!submissionId) return { alertText: 'Нет id заявки', showAlert: true }

  const city = await findCityByTelegramManagerChat(event, String(args.chatId))
  if (!city) return { alertText: 'Чат не привязан как manager', showAlert: true }

  const client = await serverSupabaseServiceRole(event)
  const { data: submission } = await client
    .from('content_submissions')
    .select('id,city_id,status,payload,kind,source_url')
    .eq('id', submissionId)
    .maybeSingle()

  if (!submission?.id || String((submission as any).city_id) !== city.id) {
    return { alertText: 'Заявка не найдена', showAlert: true }
  }

  let payload = ((submission as any).payload || {}) as EditorialParseResult

  if (action === 'cancel') {
    await client.from('content_submissions').delete().eq('id', submissionId)
    return { alertText: 'Черновик удалён', showAlert: false }
  }

  if (action === 'org' && parts[3] === 'create') {
    const sourceUrl =
      String((submission as any).source_url || '').trim()
      || `https://manager.inuu.local/${submissionId}`
    payload = await attachShadowOrgToEditorialPayload(event, {
      cityId: city.id,
      payload: ((submission as any).payload || {}) as EditorialParseResult,
      sourceUrl,
    })
    await client
      .from('content_submissions')
      .update({ payload, updated_at: new Date().toISOString() } as any)
      .eq('id', submissionId)

    await sendManagerEditorialPreview(event, {
      botToken: args.botToken,
      chatId: String(args.chatId),
      submissionId,
      city,
      payload,
    })
    return { alertText: 'Организация создана', showAlert: false }
  }

  if (action === 'org' && parts[3] === 'pick' && parts[5]) {
    const shopId = parts[5]
    const { data: shop } = await client.from('shops').select('id,name').eq('id', shopId).maybeSingle()
    if (!shop?.id) return { alertText: 'Организация не найдена', showAlert: true }
    payload = {
      ...payload,
      organization: { id: String(shop.id), name: String((shop as any).name) },
    }
    await client
      .from('content_submissions')
      .update({ payload, updated_at: new Date().toISOString() } as any)
      .eq('id', submissionId)
    await sendManagerEditorialPreview(event, {
      botToken: args.botToken,
      chatId: String(args.chatId),
      submissionId,
      city,
      payload,
    })
    return { alertText: 'Организация привязана', showAlert: false }
  }

  if (action === 'moderate') {
    if (editorialMissingOrg(payload)) {
      return { alertText: 'Сначала привяжите или создайте организацию', showAlert: true }
    }

    const status = String((submission as any).status || '')
    if (status !== 'draft' && status !== 'needs_revision') {
      return { alertText: `Статус: ${status}`, showAlert: false }
    }

    await client
      .from('content_submissions')
      .update({
        status: 'pending',
        updated_at: new Date().toISOString(),
      } as any)
      .eq('id', submissionId)

    await notifyContentSubmissionTelegramChats(event, {
      submissionId,
      cityId: city.id,
      botToken: args.botToken,
      force: true,
    })

    return { alertText: 'Отправлено в модерацию', showAlert: false }
  }

  return { alertText: 'Неизвестное действие', showAlert: true }
}
