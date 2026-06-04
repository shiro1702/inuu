import { createError, defineEventHandler, readBody } from 'h3'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { saveEditorialPostCarouselMetadata } from '~/server/utils/editorialCarouselSave'
import type { EditorialCarouselMetadata } from '~/types/editorialCarousel'

type Body = {
  carousel?: EditorialCarouselMetadata
}

export default defineEventHandler(async (event) => {
  const slugParam = typeof event.context.params?.slug === 'string' ? event.context.params.slug : ''
  const postId = typeof event.context.params?.id === 'string' ? event.context.params.id.trim() : ''
  if (!postId) {
    throw createError({ statusCode: 400, statusMessage: 'Post id is required' })
  }

  const scope = await resolveManagerCityScopeOrThrow(event, slugParam)
  const body = await readBody<Body>(event)
  const carousel = body?.carousel
  if (!carousel?.slides?.length) {
    throw createError({ statusCode: 400, statusMessage: 'carousel.slides is required' })
  }

  await saveEditorialPostCarouselMetadata(event, {
    cityId: scope.cityId,
    postId,
    carousel: {
      template_id: 'minimal-ios',
      aspect: carousel.aspect === '9:16' ? '9:16' : '4:5',
      slides: carousel.slides,
    },
  })

  return { ok: true as const, postId }
})
