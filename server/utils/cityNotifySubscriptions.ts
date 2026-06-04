import type { H3Event } from 'h3'
import { createError } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { listCityContentTags } from '~/server/utils/cityContentTaxonomy'
import { listCityContentTagsInScope } from '~/server/utils/cityContentTagsInUse'
import {
  detectSubscriptionChannel,
  type SubscriptionChannel,
} from '~/server/utils/cityTagSubscriptions'
import { ensureCustomerProfileRow } from '~/server/utils/customerProfile'
import { ensureTelegramCustomerProfile } from '~/server/utils/ensureTelegramCustomerProfile'
import { resolveCityBySlug } from '~/server/utils/inuuCity'

export type NotifyTopicSlug = 'digest' | 'events' | 'news'

const MVP_TOPICS: Array<{ slug: NotifyTopicSlug; label: string; emoji: string }> = [
  { slug: 'digest', label: 'Главное по городу', emoji: '📬' },
  { slug: 'events', label: 'Афиша', emoji: '🎭' },
  { slug: 'news', label: 'Новости', emoji: '📰' },
]

export type CitySubscriptionSettings = {
  interestTags: string[]
  topics: NotifyTopicSlug[]
  marketingOptOut: boolean
  messengerLinked: boolean
  channel: SubscriptionChannel | null
  telegramId: number | null
  availableTags: Array<{ slug: string; name: string }>
}

function parseMarketingOptOut(metadata: unknown): boolean {
  if (!metadata || typeof metadata !== 'object') return false
  const notify = (metadata as Record<string, unknown>).notify
  if (!notify || typeof notify !== 'object') return false
  return (notify as Record<string, unknown>).marketing_opt_out === true
}

export async function resolveProfileTelegramId(
  event: H3Event,
  userId: string,
): Promise<number | null> {
  const client = await serverSupabaseServiceRole(event)
  const { data } = await client
    .from('profiles')
    .select('telegram_id')
    .eq('id', userId)
    .maybeSingle()
  const id = data?.telegram_id
  return typeof id === 'number' && Number.isFinite(id) ? id : null
}

export async function resolveUserIdByTelegramId(
  event: H3Event,
  telegramId: number,
): Promise<string | null> {
  const client = await serverSupabaseServiceRole(event)
  const { data } = await client
    .from('profiles')
    .select('id')
    .eq('telegram_id', telegramId)
    .maybeSingle()
  return data?.id ? String(data.id) : null
}

export async function loadCitySubscriptionSettings(args: {
  event: H3Event
  cityId: string
  userId: string
  channel?: SubscriptionChannel | null
}): Promise<CitySubscriptionSettings> {
  let channel = args.channel === undefined
    ? detectSubscriptionChannel(args.event)
    : args.channel
  const client = await serverSupabaseServiceRole(args.event)

  const [{ data: prefs }, { data: profile }] = await Promise.all([
    client
      .from('user_city_preferences')
      .select('interest_tags')
      .eq('user_id', args.userId)
      .eq('city_id', args.cityId)
      .maybeSingle(),
    client.from('profiles').select('telegram_id, metadata').eq('id', args.userId).maybeSingle(),
  ])

  const telegramId = typeof profile?.telegram_id === 'number' ? profile.telegram_id : null
  if (!channel && telegramId) channel = 'telegram'

  const subsRes = channel
    ? await client
      .from('city_subscriptions')
      .select('topic_slug')
      .eq('user_id', args.userId)
      .eq('city_id', args.cityId)
      .eq('channel', channel)
    : { data: [] as Array<{ topic_slug: string }> }

  const catalog = await listCityContentTags(args.event, args.cityId)
  const availableTags = await listCityContentTagsInScope(args.event, args.cityId, 'events', catalog)

  const topics = ((subsRes.data ?? []) as Array<{ topic_slug: string }>)
    .map((row) => String(row.topic_slug))
    .filter((slug): slug is NotifyTopicSlug => slug === 'digest' || slug === 'events' || slug === 'news')

  return {
    interestTags: Array.isArray(prefs?.interest_tags)
      ? prefs.interest_tags.map((x) => String(x)).filter(Boolean)
      : [],
    topics,
    marketingOptOut: parseMarketingOptOut(profile?.metadata),
    messengerLinked: !!channel || !!telegramId,
    channel,
    telegramId,
    availableTags,
  }
}

async function saveInterestTags(args: {
  event: H3Event
  cityId: string
  userId: string
  interestTags: string[]
  channel: SubscriptionChannel | null
}) {
  const client = await serverSupabaseServiceRole(args.event)
  await ensureCustomerProfileRow(args.event, args.userId)

  const { data: existingPrefs } = await client
    .from('user_city_preferences')
    .select('notify_channels')
    .eq('user_id', args.userId)
    .eq('city_id', args.cityId)
    .maybeSingle()

  const notifyChannels = existingPrefs?.notify_channels && typeof existingPrefs.notify_channels === 'object'
    ? { ...(existingPrefs.notify_channels as Record<string, unknown>) }
    : {}
  if (args.channel === 'telegram') notifyChannels.telegram = true
  if (args.channel === 'max') notifyChannels.max = true

  const payload = {
    interest_tags: args.interestTags,
    notify_channels: notifyChannels,
    updated_at: new Date().toISOString(),
  }

  const error = existingPrefs
    ? (await client.from('user_city_preferences').update(payload).eq('user_id', args.userId).eq('city_id', args.cityId)).error
    : (await client.from('user_city_preferences').insert({ user_id: args.userId, city_id: args.cityId, ...payload })).error

  if (error) {
    console.error('[cityNotifySubscriptions] save interest tags failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to save preferences' })
  }
}

async function setTopicSubscription(args: {
  event: H3Event
  cityId: string
  userId: string
  channel: SubscriptionChannel
  topicSlug: NotifyTopicSlug
  enabled: boolean
}) {
  const client = await serverSupabaseServiceRole(args.event)
  if (args.enabled) {
    const { data: existingSub } = await client
      .from('city_subscriptions')
      .select('id')
      .eq('user_id', args.userId)
      .eq('city_id', args.cityId)
      .eq('channel', args.channel)
      .eq('topic_slug', args.topicSlug)
      .maybeSingle()

    const error = existingSub?.id
      ? (await client
        .from('city_subscriptions')
        .update({ metadata: { source: 'notify_settings' } })
        .eq('id', existingSub.id)).error
      : (await client.from('city_subscriptions').insert({
        user_id: args.userId,
        city_id: args.cityId,
        channel: args.channel,
        topic_slug: args.topicSlug,
        metadata: { source: 'notify_settings' },
      })).error

    if (error) {
      console.error('[cityNotifySubscriptions] enable topic failed:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to save subscription' })
    }
    return
  }

  const { error } = await client
    .from('city_subscriptions')
    .delete()
    .eq('user_id', args.userId)
    .eq('city_id', args.cityId)
    .eq('channel', args.channel)
    .eq('topic_slug', args.topicSlug)
  if (error) {
    console.error('[cityNotifySubscriptions] disable topic failed:', error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to remove subscription' })
  }
}

export async function toggleInterestTag(args: {
  event: H3Event
  cityId: string
  userId: string
  tagSlug: string
  channel: SubscriptionChannel | null
}): Promise<string[]> {
  const settings = await loadCitySubscriptionSettings(args)
  const set = new Set(settings.interestTags)
  if (set.has(args.tagSlug)) set.delete(args.tagSlug)
  else set.add(args.tagSlug)
  const interestTags = [...set]
  await saveInterestTags({ ...args, interestTags })
  return interestTags
}

export async function toggleNotifyTopic(args: {
  event: H3Event
  cityId: string
  userId: string
  channel: SubscriptionChannel
  topicSlug: NotifyTopicSlug
}): Promise<NotifyTopicSlug[]> {
  const settings = await loadCitySubscriptionSettings(args)
  const enabled = settings.topics.includes(args.topicSlug)
  await setTopicSubscription({ ...args, enabled: !enabled })
  const next = new Set(settings.topics)
  if (enabled) next.delete(args.topicSlug)
  else next.add(args.topicSlug)
  return [...next]
}

export async function updateCitySubscriptionSettings(args: {
  event: H3Event
  cityId: string
  userId: string
  channel: SubscriptionChannel | null
  interestTags?: string[]
  topics?: NotifyTopicSlug[]
  marketingOptOut?: boolean
}): Promise<CitySubscriptionSettings> {
  await ensureCustomerProfileRow(args.event, args.userId)

  if (Array.isArray(args.interestTags)) {
    const tags = [...new Set(args.interestTags.map((x) => String(x).trim()).filter(Boolean))]
    await saveInterestTags({ ...args, interestTags: tags })
  }

  if (Array.isArray(args.topics)) {
    const effectiveChannel = args.channel || (await resolveProfileTelegramId(args.event, args.userId) ? 'telegram' : null)
    if (effectiveChannel) {
      const wanted = new Set(args.topics)
      for (const topic of MVP_TOPICS) {
        await setTopicSubscription({
          event: args.event,
          cityId: args.cityId,
          userId: args.userId,
          channel: effectiveChannel,
          topicSlug: topic.slug,
          enabled: wanted.has(topic.slug),
        })
      }
    }
  }

  if (typeof args.marketingOptOut === 'boolean') {
    const client = await serverSupabaseServiceRole(args.event)
    const { data: profile } = await client.from('profiles').select('metadata').eq('id', args.userId).maybeSingle()
    const metadata = profile?.metadata && typeof profile.metadata === 'object'
      ? { ...(profile.metadata as Record<string, unknown>) }
      : {}
    const notify = metadata.notify && typeof metadata.notify === 'object'
      ? { ...(metadata.notify as Record<string, unknown>) }
      : {}
    notify.marketing_opt_out = args.marketingOptOut
    metadata.notify = notify
    const { error } = await client.from('profiles').update({ metadata }).eq('id', args.userId)
    if (error) {
      console.error('[cityNotifySubscriptions] marketing opt-out failed:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to save notification settings' })
    }
  }

  return loadCitySubscriptionSettings(args)
}

export function formatTagLabels(
  slugs: string[],
  availableTags: Array<{ slug: string; name: string }>,
): string[] {
  const bySlug = new Map(availableTags.map((t) => [t.slug, t.name]))
  return slugs.map((slug) => bySlug.get(slug) || slug)
}

export function buildNotifyMenuKeyboard(args: {
  citySlug: string
  appUrlBase: string
  settings: CitySubscriptionSettings
}) {
  const rows: Array<Array<Record<string, string>>> = []

  for (const topic of MVP_TOPICS) {
    const active = args.settings.topics.includes(topic.slug)
    rows.push([{
      text: `${active ? '✓ ' : ''}${topic.emoji} ${topic.label}`,
      callback_data: `inuu:notify:toggle:topic:${topic.slug}:${args.citySlug}`,
    }])
  }

  const tagRow: Array<Record<string, string>> = []
  for (const tag of args.settings.availableTags.slice(0, 6)) {
    const active = args.settings.interestTags.includes(tag.slug)
    tagRow.push({
      text: `${active ? '✓ ' : ''}#${tag.name}`,
      callback_data: `inuu:notify:toggle:tag:${tag.slug}:${args.citySlug}`,
    })
  }
  if (tagRow.length) rows.push(tagRow)

  rows.push([
    {
      text: args.settings.marketingOptOut ? '🔔 Включить рассылки' : '🔕 Только записи и билеты',
      callback_data: `inuu:notify:optout:${args.citySlug}`,
    },
  ])

  const settingsUrl = `${args.appUrlBase.replace(/\/$/, '')}/${args.citySlug}/subscriptions`
  rows.push([
    { text: '⚙️ Настроить на сайте', url: settingsUrl },
  ])

  return { inline_keyboard: rows }
}

export function renderNotifyMenuText(cityName: string, settings: CitySubscriptionSettings): string {
  const topicLines = MVP_TOPICS.map((t) => {
    const on = settings.topics.includes(t.slug)
    return `${on ? '✓' : '○'} ${t.emoji} ${t.label}`
  })
  const tagNames = formatTagLabels(settings.interestTags, settings.availableTags)
  const tagsLine = tagNames.length ? tagNames.map((n) => `#${n}`).join(' · ') : 'не выбраны (все темы по подписке)'
  return [
    `🔔 Уведомления • ${cityName}`,
    '',
    'Темы:',
    ...topicLines,
    '',
    `Теги: ${tagsLine}`,
    settings.marketingOptOut ? '\n🔕 Маркетинговые рассылки отключены' : '',
    '',
    'Нажмите кнопки ниже, чтобы изменить подписки.',
  ].join('\n').trim()
}

async function telegramApi(botToken: string, method: string, body: Record<string, unknown>) {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
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

export async function sendNotifySubscriptionMenu(args: {
  botToken: string
  chatId: number
  citySlug: string
  cityName: string
  appUrlBase: string
  settings: CitySubscriptionSettings
  introLine?: string
}) {
  const text = [
    args.introLine || 'Настройте, о чём присылать уведомления.',
    '',
    renderNotifyMenuText(args.cityName, args.settings),
  ].join('\n')

  await telegramApi(args.botToken, 'sendMessage', {
    chat_id: args.chatId,
    text,
    reply_markup: buildNotifyMenuKeyboard({
      citySlug: args.citySlug,
      appUrlBase: args.appUrlBase,
      settings: args.settings,
    }),
  })
}

export async function editNotifySubscriptionMenu(args: {
  botToken: string
  chatId: number
  messageId: number
  citySlug: string
  cityName: string
  appUrlBase: string
  settings: CitySubscriptionSettings
}) {
  await telegramApi(args.botToken, 'editMessageText', {
    chat_id: args.chatId,
    message_id: args.messageId,
    text: renderNotifyMenuText(args.cityName, args.settings),
    reply_markup: buildNotifyMenuKeyboard({
      citySlug: args.citySlug,
      appUrlBase: args.appUrlBase,
      settings: args.settings,
    }),
  })
}

export async function notifyTelegramUserAboutTagSubscription(args: {
  event: H3Event
  botToken: string
  userId: string
  cityId: string
  citySlug: string
  cityName: string
  appUrlBase: string
  addedTags: string[]
}) {
  const telegramId = await resolveProfileTelegramId(args.event, args.userId)
  if (!telegramId) return

  const settings = await loadCitySubscriptionSettings({
    event: args.event,
    cityId: args.cityId,
    userId: args.userId,
    channel: 'telegram',
  })
  const labels = formatTagLabels(args.addedTags, settings.availableTags)
  const tagLine = labels.map((n) => `#${n}`).join(' · ')

  await sendNotifySubscriptionMenu({
    botToken: args.botToken,
    chatId: telegramId,
    citySlug: args.citySlug,
    cityName: args.cityName,
    appUrlBase: args.appUrlBase,
    settings,
    introLine: `✅ Подписка на афишу сохранена.\nТеги: ${tagLine}`,
  })
}

export async function handleInuuNotifyTelegramCallback(
  event: H3Event,
  args: {
    botToken: string
    data: string
    chatId: number
    messageId: number
    fromId: number
    appUrlBase: string
    defaultCitySlug: string
  },
): Promise<{ alertText: string; showAlert: boolean }> {
  const parts = args.data.split(':')
  if (parts[0] !== 'inuu' || parts[1] !== 'notify') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid notify callback' })
  }

  let userId = await resolveUserIdByTelegramId(event, args.fromId)
  if (!userId) {
    userId = await ensureTelegramCustomerProfile(event, args.fromId)
  }
  if (!userId) {
    return { alertText: 'Не удалось определить профиль. Отправьте /start', showAlert: true }
  }

  const citySlug = parts[parts.length - 1] || args.defaultCitySlug
  const city = await resolveCityBySlug(event, citySlug)
  const channel: SubscriptionChannel = 'telegram'

  const action = parts[2]
  let settings = await loadCitySubscriptionSettings({ event, cityId: city.id, userId, channel })

  if (action === 'menu') {
    await editNotifySubscriptionMenu({
      botToken: args.botToken,
      chatId: args.chatId,
      messageId: args.messageId,
      citySlug: city.slug,
      cityName: city.name,
      appUrlBase: args.appUrlBase,
      settings,
    })
    return { alertText: 'Меню обновлено', showAlert: false }
  }

  if (action === 'toggle' && parts[3] === 'topic') {
    const topicSlug = parts[4] as NotifyTopicSlug
    if (!MVP_TOPICS.some((t) => t.slug === topicSlug)) {
      return { alertText: 'Неизвестная тема', showAlert: true }
    }
    await toggleNotifyTopic({ event, cityId: city.id, userId, channel, topicSlug })
    settings = await loadCitySubscriptionSettings({ event, cityId: city.id, userId, channel })
    await editNotifySubscriptionMenu({
      botToken: args.botToken,
      chatId: args.chatId,
      messageId: args.messageId,
      citySlug: city.slug,
      cityName: city.name,
      appUrlBase: args.appUrlBase,
      settings,
    })
    return { alertText: 'Сохранено', showAlert: false }
  }

  if (action === 'toggle' && parts[3] === 'tag') {
    const tagSlug = parts[4]
    if (!tagSlug) return { alertText: 'Неизвестный тег', showAlert: true }
    await toggleInterestTag({ event, cityId: city.id, userId, tagSlug, channel })
    settings = await loadCitySubscriptionSettings({ event, cityId: city.id, userId, channel })
    await editNotifySubscriptionMenu({
      botToken: args.botToken,
      chatId: args.chatId,
      messageId: args.messageId,
      citySlug: city.slug,
      cityName: city.name,
      appUrlBase: args.appUrlBase,
      settings,
    })
    return { alertText: 'Тег обновлён', showAlert: false }
  }

  if (action === 'optout') {
    settings = await updateCitySubscriptionSettings({
      event,
      cityId: city.id,
      userId,
      channel,
      marketingOptOut: !settings.marketingOptOut,
    })
    await editNotifySubscriptionMenu({
      botToken: args.botToken,
      chatId: args.chatId,
      messageId: args.messageId,
      citySlug: city.slug,
      cityName: city.name,
      appUrlBase: args.appUrlBase,
      settings,
    })
    return {
      alertText: settings.marketingOptOut ? 'Только записи и билеты' : 'Рассылки включены',
      showAlert: false,
    }
  }

  return { alertText: 'Неизвестное действие', showAlert: true }
}

export async function handleSubscribeCommand(args: {
  event: H3Event
  botToken: string
  chatId: number
  fromId: number
  appUrlBase: string
  defaultCitySlug: string
}) {
  const userId = await ensureTelegramCustomerProfile(args.event, args.fromId)
  if (!userId) throw new Error('Failed to ensure telegram profile')

  const city = await resolveCityBySlug(args.event, args.defaultCitySlug)
  const settings = await loadCitySubscriptionSettings({
    event: args.event,
    cityId: city.id,
    userId,
    channel: 'telegram',
  })

  await sendNotifySubscriptionMenu({
    botToken: args.botToken,
    chatId: args.chatId,
    citySlug: city.slug,
    cityName: city.name,
    appUrlBase: args.appUrlBase,
    settings,
    introLine: 'Выберите темы и теги для персональных подборок.',
  })
}

export { MVP_TOPICS }
