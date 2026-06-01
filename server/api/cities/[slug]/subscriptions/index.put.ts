import { createError, defineEventHandler, readBody, setResponseHeader } from 'h3'
import { resolveCustomerProfileId } from '~/server/utils/customerProfile'
import { resolveCityBySlug } from '~/server/utils/inuuCity'
import { detectSubscriptionChannel } from '~/server/utils/cityTagSubscriptions'
import {
  loadCitySubscriptionSettings,
  MVP_TOPICS,
  updateCitySubscriptionSettings,
  type NotifyTopicSlug,
} from '~/server/utils/cityNotifySubscriptions'

function parseTopics(raw: unknown): NotifyTopicSlug[] | undefined {
  if (!Array.isArray(raw)) return undefined
  const allowed = new Set(MVP_TOPICS.map((t) => t.slug))
  return [...new Set(raw.map((x) => String(x)).filter((x): x is NotifyTopicSlug => allowed.has(x as NotifyTopicSlug)))]
}

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'private, no-store')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const city = await resolveCityBySlug(event, slug)

  let userId: string
  try {
    userId = await resolveCustomerProfileId(event, null)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event).catch(() => ({}))
  const channel = detectSubscriptionChannel(event)
  const interestTags = Array.isArray(body?.interestTags)
    ? [...new Set(body.interestTags.map((x: unknown) => String(x || '').trim()).filter(Boolean))]
    : undefined
  const topics = parseTopics(body?.topics)
  const marketingOptOut = typeof body?.marketingOptOut === 'boolean' ? body.marketingOptOut : undefined

  const settings = await updateCitySubscriptionSettings({
    event,
    cityId: city.id,
    userId,
    channel,
    interestTags,
    topics: channel ? topics : undefined,
    marketingOptOut,
  })

  return {
    ok: true,
    city: { slug: city.slug, name: city.name },
    topicOptions: MVP_TOPICS,
    interestTags: settings.interestTags,
    topics: settings.topics,
    marketingOptOut: settings.marketingOptOut,
    messengerLinked: settings.messengerLinked,
    channel: settings.channel,
    telegramId: settings.telegramId,
    availableTags: settings.availableTags,
    message: 'Настройки уведомлений сохранены',
  }
})
