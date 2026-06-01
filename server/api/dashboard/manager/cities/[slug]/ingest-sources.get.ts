import { defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { loadCityIngestSettings } from '~/server/utils/cityIngestSettings'
import {
  INGEST_CONTEXT_TYPES,
  listTelegramSources,
  listWebSources,
} from '~/server/utils/ingestSourcesDashboard'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)

  const [webSources, telegramSources, ingestSettings] = await Promise.all([
    listWebSources(event, scope.cityId),
    listTelegramSources(event, scope.cityId),
    loadCityIngestSettings(event, scope.cityId),
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
  }
})
