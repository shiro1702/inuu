import { defineEventHandler } from 'h3'
import { listOpenScrapingAlerts } from '~/server/utils/scrapingAlerts'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const alerts = await listOpenScrapingAlerts(event, scope.cityId)
  return { ok: true as const, alerts }
})
