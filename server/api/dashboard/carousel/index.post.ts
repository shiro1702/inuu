import { createError, defineEventHandler, readBody } from 'h3'
import { resolveCityIdForCarouselCreate } from '~/server/utils/generatedCarouselAccess'
import { createGeneratedCarousel, type GeneratedCarouselPayload } from '~/server/utils/generatedCarouselWrite'

type Body = GeneratedCarouselPayload & {
  city_slug?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  const citySlug = typeof body?.city_slug === 'string' ? body.city_slug.trim() : ''
  if (!citySlug) {
    throw createError({ statusCode: 400, statusMessage: 'city_slug is required' })
  }

  const scope = await resolveCityIdForCarouselCreate(event, citySlug)
  const project = await createGeneratedCarousel(event, {
    userId: scope.userId,
    cityId: scope.cityId,
    payload: { ...body, city_slug: scope.citySlug },
  })

  return {
    ok: true as const,
    project: {
      ...project,
      city_slug: scope.citySlug,
      city_name: scope.cityName,
    },
  }
})
