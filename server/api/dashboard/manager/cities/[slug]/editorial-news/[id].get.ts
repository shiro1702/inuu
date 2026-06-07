import { createError, defineEventHandler } from 'h3'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { editorialPublicPath, getEditorialPostForManager } from '~/server/utils/editorialDashboard'
import {
  enrichEditorialBodyBlocks,
  enrichEditorialLinkedVenue,
} from '~/server/utils/editorialPublic'

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const postId = typeof event.context.params?.id === 'string' ? event.context.params.id.trim() : ''
  if (!postId) {
    throw createError({ statusCode: 400, statusMessage: 'Post id is required' })
  }

  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  const item = await getEditorialPostForManager(event, scope.cityId, postId)
  const { placeEmbeds } = await enrichEditorialBodyBlocks(event, scope.cityId, item.body_json)
  const allEmbeds = await enrichEditorialLinkedVenue(
    event,
    scope.cityId,
    item.linked_entity_type,
    item.linked_entity_id,
    placeEmbeds,
  )

  return {
    ok: true as const,
    city: {
      id: scope.cityId,
      slug: scope.citySlug,
      name: scope.cityName,
    },
    item: {
      ...item,
      linked_venues: Object.values(allEmbeds),
    },
    publicPath: item.is_published ? editorialPublicPath(scope.citySlug, item.slug) : null,
  }
})
