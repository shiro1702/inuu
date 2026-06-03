import { defineEventHandler, getQuery } from 'h3'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { listEditorialPostsForManager } from '~/server/utils/editorialDashboard'

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  const query = getQuery(event)

  const status = typeof query.status === 'string' ? query.status : 'all'
  const page = Math.max(1, Number(query.page) || 1)
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 20))

  const list = await listEditorialPostsForManager(event, scope.cityId, { status, page, limit })

  return {
    ok: true as const,
    city: {
      id: scope.cityId,
      slug: scope.citySlug,
      name: scope.cityName,
    },
    ...list,
  }
})
