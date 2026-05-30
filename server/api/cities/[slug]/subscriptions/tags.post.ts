import { createError, defineEventHandler, readBody, setResponseHeader } from 'h3'
import { resolveCustomerProfileId } from '~/server/utils/customerProfile'
import { resolveCityBySlug } from '~/server/utils/inuuCity'
import { notifyTelegramUserAboutTagSubscription, resolveProfileTelegramId } from '~/server/utils/cityNotifySubscriptions'
import {
  detectSubscriptionChannel,
  subscribeToCityEventTags,
} from '~/server/utils/cityTagSubscriptions'
import { tagsCoverSelection } from '~/utils/cityTagSubscriptions'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'private, no-store')
  const config = useRuntimeConfig()
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const city = await resolveCityBySlug(event, slug)

  let userId: string
  try {
    userId = await resolveCustomerProfileId(event, null)
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const body = await readBody(event).catch(() => ({}))
  const rawTags = Array.isArray(body?.tags) ? body.tags : []
  const tags = [...new Set(rawTags.map((x: unknown) => String(x || '').trim()).filter(Boolean))]
  if (!tags.length) {
    throw createError({ statusCode: 400, statusMessage: 'tags array is required' })
  }

  const channel = detectSubscriptionChannel(event)
  const result = await subscribeToCityEventTags({
    event,
    cityId: city.id,
    userId,
    tags,
    channel,
  })

  const botToken = String(config.botToken || '')
  const appUrlBase = String(config.appUrl || '').replace(/\/$/, '')
  const telegramId = await resolveProfileTelegramId(event, userId)
  if (botToken && telegramId) {
    try {
      await notifyTelegramUserAboutTagSubscription({
        event,
        botToken,
        userId,
        cityId: city.id,
        citySlug: city.slug,
        cityName: city.name,
        appUrlBase,
        addedTags: tags,
      })
    } catch (err) {
      console.error('[subscriptions/tags.post] telegram notify failed:', err)
    }
  }

  return {
    ok: true,
    interestTags: result.interestTags,
    hasEventsTopic: result.hasEventsTopic,
    subscribedToSelection: tagsCoverSelection(result.interestTags, tags),
    messengerLinked: result.messengerLinked,
    channel: result.channel,
    message: result.messengerLinked
      ? 'Подписка сохранена. Новые события по выбранным тегам будут приходить в бот.'
      : 'Интересы сохранены. Чтобы получать пуши, откройте афишу в Telegram-боте INUU.',
  }
})
