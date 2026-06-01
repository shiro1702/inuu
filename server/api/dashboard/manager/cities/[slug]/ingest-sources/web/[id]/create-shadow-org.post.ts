import { createError, defineEventHandler } from 'h3'
import { serverSupabaseServiceRole } from '#supabase/server'
import { getWebSourceById, mapWebSourceRow, WEB_SOURCE_SELECT } from '~/server/utils/ingestSourcesDashboard'
import { resolveOrCreateShadowOrg } from '~/server/utils/ingestShadowOrg'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const sourceId = typeof event.context.params?.id === 'string' ? event.context.params.id : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const source = await getWebSourceById({ event, cityId: scope.cityId, id: sourceId })

  if (source.organizationId) {
    return {
      ok: true as const,
      alreadyLinked: true,
      item: source,
    }
  }

  const shadow = await resolveOrCreateShadowOrg({
    event,
    cityId: scope.cityId,
    sourceUrl: source.url,
    webSourceId: source.id,
  })

  const client = await serverSupabaseServiceRole(event)
  const { data, error } = await client
    .from('city_web_sources')
    .select(WEB_SOURCE_SELECT)
    .eq('id', source.id)
    .maybeSingle()

  if (error || !data?.id) {
    throw createError({ statusCode: 500, statusMessage: error?.message || 'Failed to reload source' })
  }

  return {
    ok: true as const,
    created: shadow.created,
    organization: {
      id: shadow.shopId,
      slug: shadow.slug,
      name: shadow.name,
    },
    item: mapWebSourceRow(data),
  }
})
