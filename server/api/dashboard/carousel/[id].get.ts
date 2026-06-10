import { createError, defineEventHandler } from 'h3'
import { fetchGeneratedCarouselOrThrow } from '~/server/utils/generatedCarouselAccess'
import { resolveCitySlugAndName } from '~/server/utils/generatedCarouselCity'
import { rowToCarouselResponse } from '~/server/utils/generatedCarouselWrite'

export default defineEventHandler(async (event) => {
  const id = typeof event.context.params?.id === 'string' ? event.context.params.id.trim() : ''
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Carousel id is required' })
  }

  const row = await fetchGeneratedCarouselOrThrow(event, id)
  const city = await resolveCitySlugAndName(event, row.city_id)
  return { ok: true as const, project: rowToCarouselResponse(row, city) }
})
