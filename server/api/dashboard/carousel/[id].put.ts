import { createError, defineEventHandler, readBody } from 'h3'
import { fetchGeneratedCarouselOrThrow } from '~/server/utils/generatedCarouselAccess'
import { resolveCitySlugAndName } from '~/server/utils/generatedCarouselCity'
import { updateGeneratedCarousel, type GeneratedCarouselPayload } from '~/server/utils/generatedCarouselWrite'

export default defineEventHandler(async (event) => {
  const id = typeof event.context.params?.id === 'string' ? event.context.params.id.trim() : ''
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Carousel id is required' })
  }

  await fetchGeneratedCarouselOrThrow(event, id)
  const body = await readBody<GeneratedCarouselPayload>(event)

  const project = await updateGeneratedCarousel(event, id, body || {})
  const city = await resolveCitySlugAndName(event, project.city_id)
  return { ok: true as const, project: { ...project, city_slug: city.city_slug, city_name: city.city_name } }
})
