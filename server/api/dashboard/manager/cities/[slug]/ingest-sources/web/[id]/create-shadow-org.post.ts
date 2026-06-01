import { defineEventHandler } from 'h3'
import { getWebSourceById } from '~/server/utils/ingestSourcesDashboard'
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
    orgNameHint: source.displayName,
    webSourceId: source.id,
  })

  const item = await getWebSourceById({ event, cityId: scope.cityId, id: source.id })

  return {
    ok: true as const,
    created: shadow.created,
    organization: {
      id: shadow.shopId,
      slug: shadow.slug,
      name: shadow.name,
    },
    item,
  }
})
