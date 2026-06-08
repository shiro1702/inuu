import { defineEventHandler, getQuery } from 'h3'
import { loadCityIngestSettings } from '~/server/utils/cityIngestSettings'
import {
  listCityShopsForPicker,
  listTelegramSources,
  listWebSourcesForDashboard,
} from '~/server/utils/ingestSourcesDashboard'
import { INGEST_CONTEXT_TYPES } from '~/server/utils/ingestSourcesDashboardShared'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { listOpenScrapingAlerts } from '~/server/utils/scrapingAlerts'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const query = getQuery(event)
  const includeAlerts = query.alerts !== '0'
  const includeShops = query.shops === '1'

  const [webSources, telegramSources, ingestSettings, alerts, shops] = await Promise.all([
    listWebSourcesForDashboard(event, scope.cityId),
    listTelegramSources(event, scope.cityId),
    loadCityIngestSettings(event, scope.cityId),
    includeAlerts ? listOpenScrapingAlerts(event, scope.cityId) : Promise.resolve([]),
    includeShops ? listCityShopsForPicker(event, scope.cityId) : Promise.resolve([]),
  ])

  return {
    ok: true as const,
    city: {
      id: scope.cityId,
      slug: scope.citySlug,
      name: scope.cityName,
    },
    contextTypes: [...INGEST_CONTEXT_TYPES],
    ingestSettings,
    webSources,
    telegramSources,
    alerts,
    shops,
  }
})
