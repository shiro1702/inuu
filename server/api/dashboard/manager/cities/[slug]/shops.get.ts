import { defineEventHandler } from 'h3'
import { listCityShopsForPicker } from '~/server/utils/ingestSourcesDashboard'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'

export default defineEventHandler(async (event) => {
  const slug = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slug)
  const items = await listCityShopsForPicker(event, scope.cityId)
  return { ok: true as const, items }
})
