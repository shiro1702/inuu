import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'
import { serverSupabaseServiceRole } from '#supabase/server'
import { eventTopicTagsMatchInterest } from '~/utils/cityTopicBroadcastMatch'

export { eventTopicTagsMatchInterest } from '~/utils/cityTopicBroadcastMatch'

export type EventPublishRecipient = {
  userId: string
  telegramId: number
}

function parseMarketingOptOut(metadata: unknown): boolean {
  if (!metadata || typeof metadata !== 'object') return false
  const notify = (metadata as Record<string, unknown>).notify
  if (!notify || typeof notify !== 'object') return false
  return (notify as Record<string, unknown>).marketing_opt_out === true
}

export async function resolveCityEventPublishRecipients(
  event: H3Event,
  args: {
    cityId: string
    eventTopicTags: string[]
  },
): Promise<EventPublishRecipient[]> {
  const client = await serverSupabaseServiceRole(event)
  const { data: subs, error } = await client
    .from('city_subscriptions')
    .select('user_id')
    .eq('city_id', args.cityId)
    .eq('channel', 'telegram')
    .eq('topic_slug', 'events')

  if (error) {
    console.error('[cityTopicBroadcast] load subscriptions failed:', error)
    return []
  }

  const userIds = [...new Set((subs ?? []).map((row) => String((row as { user_id: string }).user_id)).filter(Boolean))]
  if (!userIds.length) return []

  const [{ data: profiles }, { data: prefsRows }] = await Promise.all([
    client
      .from('profiles')
      .select('id,telegram_id,metadata')
      .in('id', userIds),
    client
      .from('user_city_preferences')
      .select('user_id,interest_tags')
      .eq('city_id', args.cityId)
      .in('user_id', userIds),
  ])

  const interestByUser = new Map<string, string[]>()
  for (const row of prefsRows ?? []) {
    const userId = String((row as { user_id: string }).user_id)
    const tags = (row as { interest_tags?: unknown }).interest_tags
    interestByUser.set(
      userId,
      Array.isArray(tags) ? tags.map((x) => String(x || '').trim()).filter(Boolean) : [],
    )
  }

  const recipients: EventPublishRecipient[] = []
  for (const profile of profiles ?? []) {
    const userId = String((profile as { id: string }).id)
    const telegramId = (profile as { telegram_id?: number | null }).telegram_id
    if (typeof telegramId !== 'number' || !Number.isFinite(telegramId)) continue
    if (parseMarketingOptOut((profile as { metadata?: unknown }).metadata)) continue

    const interestTags = interestByUser.get(userId) ?? []
    if (!eventTopicTagsMatchInterest(args.eventTopicTags, interestTags)) continue

    recipients.push({ userId, telegramId })
  }

  return recipients
}

function formatEventStartsAtRu(startsAt: string | null | undefined, timeZone: string): string {
  if (!startsAt) return 'дата уточняется'
  const date = new Date(startsAt)
  if (Number.isNaN(date.getTime())) return 'дата уточняется'
  return new Intl.DateTimeFormat('ru-RU', {
    timeZone,
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

async function telegramSendMessage(botToken: string, chatId: number, text: string) {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: false,
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Telegram sendMessage: ${res.status} ${body}`)
  }
}

async function hasSentEventPublishNotification(
  event: H3Event,
  userId: string,
  eventId: string,
): Promise<boolean> {
  const client = await serverSupabaseServiceRole(event)
  const key = `event-published:${userId}:${eventId}`
  const { data } = await client
    .from('notification_events')
    .select('delivery_status')
    .eq('notification_key', key)
    .maybeSingle()
  return (data as { delivery_status?: string } | null)?.delivery_status === 'sent'
}

async function recordEventPublishNotification(args: {
  event: H3Event
  userId: string
  eventId: string
  cityId: string
  telegramId: number
  status: 'sent' | 'failed'
  payload: Record<string, unknown>
  lastError?: string | null
}) {
  const client = await serverSupabaseServiceRole(args.event)
  const key = `event-published:${args.userId}:${args.eventId}`
  const body = {
    notification_key: key,
    event_type: 'EVENT_PUBLISHED',
    channel: 'telegram',
    city_id: args.cityId,
    conversation_id: String(args.telegramId),
    delivery_status: args.status,
    attempt_count: 1,
    last_error: args.lastError ?? null,
    payload: args.payload,
    updated_at: new Date().toISOString(),
  }

  const { data: existing } = await client
    .from('notification_events')
    .select('id')
    .eq('notification_key', key)
    .maybeSingle()

  if (existing?.id) {
    await client.from('notification_events').update(body).eq('id', existing.id)
    return
  }
  await client.from('notification_events').insert(body)
}

export async function notifyEventPublished(
  event: H3Event,
  args: {
    cityId: string
    citySlug: string
    cityTimezone?: string
    eventId: string
    eventSlug: string
    eventTitle: string
    startsAt: string | null
    topicTags: string[]
  },
): Promise<{ sent: number; skipped: number }> {
  const config = useRuntimeConfig(event)
  const botToken = String(
    (event.context.tenant as { telegramBotToken?: string } | undefined)?.telegramBotToken
      || config.botToken
      || '',
  ).trim()
  if (!botToken) {
    console.warn('[cityTopicBroadcast] skipped: bot token not configured')
    return { sent: 0, skipped: 0 }
  }

  const recipients = await resolveCityEventPublishRecipients(event, {
    cityId: args.cityId,
    eventTopicTags: args.topicTags,
  })
  if (!recipients.length) return { sent: 0, skipped: 0 }

  const appUrlBase = String((config as { appUrl?: string }).appUrl || 'https://inuu.ru').replace(/\/$/, '')
  const eventUrl = `${appUrlBase}/${args.citySlug}/events/${args.eventSlug}`
  const dateLine = formatEventStartsAtRu(args.startsAt, args.cityTimezone || 'Asia/Irkutsk')
  const text = [
    '🎭 Новое событие в афише',
    '',
    args.eventTitle,
    `📅 ${dateLine}`,
    '',
    eventUrl,
  ].join('\n')

  let sent = 0
  let skipped = 0

  for (const recipient of recipients) {
    if (await hasSentEventPublishNotification(event, recipient.userId, args.eventId)) {
      skipped += 1
      continue
    }

    try {
      await telegramSendMessage(botToken, recipient.telegramId, text)
      await recordEventPublishNotification({
        event,
        userId: recipient.userId,
        eventId: args.eventId,
        cityId: args.cityId,
        telegramId: recipient.telegramId,
        status: 'sent',
        payload: {
          eventId: args.eventId,
          eventSlug: args.eventSlug,
          eventTitle: args.eventTitle,
          eventUrl,
          topicTags: args.topicTags,
        },
      })
      sent += 1
    } catch (err) {
      console.error('[cityTopicBroadcast] send failed:', recipient.userId, err)
      await recordEventPublishNotification({
        event,
        userId: recipient.userId,
        eventId: args.eventId,
        cityId: args.cityId,
        telegramId: recipient.telegramId,
        status: 'failed',
        payload: {
          eventId: args.eventId,
          eventSlug: args.eventSlug,
        },
        lastError: err instanceof Error ? err.message : String(err),
      }).catch(() => {})
    }
  }

  return { sent, skipped }
}
