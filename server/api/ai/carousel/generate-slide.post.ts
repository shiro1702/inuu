import { createError, defineEventHandler, readBody } from 'h3'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { applyPresetUrlsToSlides } from '~/server/utils/carouselImageMatcher'
import {
  generateSlideWithGroq,
  localFallbackSlideFromText,
  mapGroqSlideToCarousel,
} from '~/server/utils/ai/groqCarouselGenerate'
import { matchStickerIntents } from '~/server/utils/carouselStickerMatcher'
import { normalizeSlideToV2 } from '~/utils/carouselSlideAdapter'
import type { CarouselSlide, CarouselSlideRole, CarouselSlideV2 } from '~/types/editorialCarousel'
import { groqErrorHint } from '~/server/utils/ai/groqParseErrors'
import { reconcileSlideWithSourceText } from '~/utils/parseSlideEventText'

type Body = {
  text?: string
  city_slug?: string
  slide_role?: CarouselSlideRole
  vibe_key?: string
  carousel_title?: string
  slide_index?: number
  total_slides?: number
}

function isSlideRole(value: unknown): value is CarouselSlideRole {
  return value === 'cover' || value === 'body' || value === 'outro'
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  const rawText = typeof body?.text === 'string' ? body.text.trim() : ''
  const slideRole = body?.slide_role
  const vibeKey = body?.vibe_key || 'party'

  if (!rawText) {
    throw createError({ statusCode: 400, statusMessage: 'text required' })
  }
  if (!isSlideRole(slideRole)) {
    throw createError({ statusCode: 400, statusMessage: 'slide_role must be cover, body or outro' })
  }

  const citySlug = typeof body?.city_slug === 'string' ? body.city_slug.trim() : ''
  let cityId: string | null = null
  let cityName = ''
  if (citySlug) {
    const scope = await resolveManagerCityScopeOrThrow(event, citySlug)
    cityId = scope.cityId
    cityName = scope.cityName
  }

  if (!process.env.NUXT_GROQ_API_KEY?.trim()) {
    return {
      ok: true as const,
      source: 'local_fallback' as const,
      slide: localFallbackSlideFromText(rawText, slideRole, vibeKey),
    }
  }

  try {
    const { slide: groqSlide, sticker_intents, model, latencyMs } = await generateSlideWithGroq({
      text: rawText,
      slideRole,
      cityName,
      citySlug,
      carouselTitle: body?.carousel_title,
      slideIndex: typeof body?.slide_index === 'number' ? body.slide_index : undefined,
      totalSlides: typeof body?.total_slides === 'number' ? body.total_slides : undefined,
    })

    let slide = reconcileSlideWithSourceText(
      mapGroqSlideToCarousel(groqSlide, slideRole, vibeKey),
      rawText,
      slideRole,
    )
    const [withImage] = await applyPresetUrlsToSlides(event, [slide], {
      cityId,
      vibeKey,
    })
    slide = withImage || slide

    const stickerObjects = await matchStickerIntents(event, sticker_intents || [])
    if (stickerObjects.length) {
      const v2 = normalizeSlideToV2(slide) as CarouselSlideV2
      slide = { ...v2, objects: [...(v2.objects || []), ...stickerObjects] }
    }

    return {
      ok: true as const,
      source: 'groq' as const,
      model,
      latency_ms: latencyMs,
      sticker_intents: sticker_intents || [],
      slide,
    }
  } catch (err: unknown) {
    return {
      ok: true as const,
      source: 'local_fallback' as const,
      fallback_reason: groqErrorHint(err),
      slide: localFallbackSlideFromText(rawText, slideRole, vibeKey),
    }
  }
})
