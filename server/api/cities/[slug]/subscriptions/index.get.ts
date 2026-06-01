import { createError, defineEventHandler, setResponseHeader } from 'h3'
import { resolveCustomerProfileId } from '~/server/utils/customerProfile'
import { resolveCityBySlug } from '~/server/utils/inuuCity'
import { detectSubscriptionChannel } from '~/server/utils/cityTagSubscriptions'
import { loadCitySubscriptionSettings, MVP_TOPICS } from '~/server/utils/cityNotifySubscriptions'

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

  const channel = detectSubscriptionChannel(event)
  const settings = await loadCitySubscriptionSettings({
    event,
    cityId: city.id,
    userId,
    channel,
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
  }
})
