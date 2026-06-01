import { createError, defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import {
  getWebSourceById,
  mapWebSourceRow,
  updateWebSourceReturning,
} from '~/server/utils/ingestSourcesDashboard'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const sourceId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  await getWebSourceById({ event, cityId: scope.cityId, id: sourceId })

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await updateWebSourceReturning(
    client,
    { cityId: scope.cityId, id: sourceId },
    {
      parsing_strategy: null,
      parsing_rules: null,
      rules_validated_at: null,
      updated_at: new Date().toISOString(),
    },
  )

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  if (!data?.id) {
    throw createError({ statusCode: 404, statusMessage: 'Web source not found' })
  }

  return { ok: true as const, item: mapWebSourceRow(data) }
})
