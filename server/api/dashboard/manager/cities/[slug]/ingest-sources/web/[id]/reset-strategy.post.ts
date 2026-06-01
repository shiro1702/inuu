import { createError, defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  getWebSourceById,
  mapWebSourceRow,
  WEB_SOURCE_SELECT,
} from '~/server/utils/ingestSourcesDashboard'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const sourceId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  await getWebSourceById({ event, cityId: scope.cityId, id: sourceId })

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('city_web_sources')
    .update({
      parsing_strategy: null,
      parsing_rules: null,
      rules_validated_at: null,
      updated_at: new Date().toISOString(),
    } as any)
    .eq('city_id', scope.cityId)
    .eq('id', sourceId)
    .select(WEB_SOURCE_SELECT)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  if (!data?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Web source not found' })
  }

  return { ok: true as const, item: mapWebSourceRow(data) }
})
