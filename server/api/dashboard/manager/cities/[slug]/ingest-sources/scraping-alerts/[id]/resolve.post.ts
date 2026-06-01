import { createError, defineEventHandler } from 'h3'
import { resolveScrapingAlert } from '~/server/utils/scrapingAlerts'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const alertId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)

  const ok = await resolveScrapingAlert({
    event,
    cityId: scope.cityId,
    alertId,
  })

  if (!ok) {
    throw createError({ statusCode: 404, statusMessage: 'Alert not found' })
  }

  return { ok: true as const }
})
