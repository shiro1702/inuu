import { createError, defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { getWebSourceById } from '~/server/utils/ingestSourcesDashboard'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const sourceId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  await getWebSourceById({ event, cityId: scope.cityId, id: sourceId })

  const client = await serverSupabaseServiceRole(event)
  const { error } = await client
    .from('city_web_sources')
    .delete()
    .eq('city_id', scope.cityId)
    .eq('id', sourceId)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { ok: true as const }
})
