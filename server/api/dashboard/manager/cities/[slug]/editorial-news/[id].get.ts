import { createError, defineEventHandler } from 'h3'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { editorialPublicPath, getEditorialPostForManager } from '~/server/utils/editorialDashboard'

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const postId = typeof event.context.params?.id === 'string' ? event.context.params.id.trim() : ''
  if (!postId) {
    throw createError({ statusCode: 400, statusMessage: 'Post id is required' })
  }

  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  const item = await getEditorialPostForManager(event, scope.cityId, postId)

  return {
    ok: true as const,
    city: {
      id: scope.cityId,
      slug: scope.citySlug,
      name: scope.cityName,
    },
    item,
    publicPath: item.is_published ? editorialPublicPath(scope.citySlug, item.slug) : null,
  }
})
