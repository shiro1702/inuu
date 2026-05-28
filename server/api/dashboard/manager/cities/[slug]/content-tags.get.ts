import { defineEventHandler, getQuery } from 'h3'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { listCityContentTags } from '~/server/utils/cityContentTaxonomy'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const query = getQuery(event)
  const q = typeof query.q === 'string' ? query.q : ''
  const items = await listCityContentTags(event, scope.cityId, q)
  return { ok: true as const, items }
})
