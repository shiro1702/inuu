import { createError, defineEventHandler, readBody } from 'h3'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { updateEditorialPost, type EditorialDashboardInput } from '~/server/utils/editorialDashboard'

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const postId = typeof event.context.params?.id === 'string' ? event.context.params.id.trim() : ''
  if (!postId) {
    throw createError({ statusCode: 400, statusMessage: 'Post id is required' })
  }

  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  const body = await readBody<EditorialDashboardInput>(event).catch(() => ({}))
  const { item, publicPath } = await updateEditorialPost(event, scope, postId, body)

  return {
    ok: true as const,
    city: {
      id: scope.cityId,
      slug: scope.citySlug,
      name: scope.cityName,
    },
    item,
    publicPath,
  }
})
