import { defineEventHandler, getQuery, setResponseHeader } from 'h3'
import { resolveCustomerProfileId } from '~/server/utils/customerProfile'
import { resolveCityBySlug } from '~/server/utils/inuuCity'
import {
  detectSubscriptionChannel,
  loadCityTagSubscriptionState,
} from '~/server/utils/cityTagSubscriptions'
import { tagsCoverSelection } from '~/utils/cityTagSubscriptions'
import { parseTagSlugsFromQuery } from '~/server/utils/eventListDisplay'

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Cache-Control', 'private, no-store')
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const city = await resolveCityBySlug(event, slug)
  const query = getQuery(event)
  const selectedTags = parseTagSlugsFromQuery(query.tag)

  let userId: string | null = null
  try {
    userId = await resolveCustomerProfileId(event, null)
  } catch {
    return {
      ok: true,
      authenticated: false,
      interestTags: [],
      hasEventsTopic: false,
      subscribedToSelection: false,
      messengerLinked: false,
    }
  }

  const channel = detectSubscriptionChannel(event)
  const state = await loadCityTagSubscriptionState({
    event,
    cityId: city.id,
    userId,
    channel,
  })

  return {
    ok: true,
    authenticated: true,
    interestTags: state.interestTags,
    hasEventsTopic: state.hasEventsTopic,
    subscribedToSelection: tagsCoverSelection(state.interestTags, selectedTags),
    messengerLinked: !!channel,
    channel: state.channel,
  }
})
