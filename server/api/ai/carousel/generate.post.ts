import { createError, defineEventHandler, readBody } from 'h3'
import { resolveManagerCityScopeOrThrow } from '~/server/utils/managerCityAccess'
import { applyPresetUrlsToSlides } from '~/server/utils/carouselImageMatcher'
import {
  generateCarouselWithGroq,
  mapGroqSlidesToCarousel,
  type CarouselGenerateMode,
} from '~/server/utils/ai/groqCarouselGenerate'
import { buildCarouselFromEvents, type CarouselEventInput } from '~/utils/buildCarouselFromEvents'
import { resolveCarouselGradientFromTags } from '~/utils/carouselVibeTheme'
import { matchStickerIntents } from '~/server/utils/carouselStickerMatcher'
import { normalizeSlideToV2 } from '~/utils/carouselSlideAdapter'
import type { CarouselSlideV2 } from '~/types/editorialCarousel'
import {
  normalizeCarouselImportText,
  parseInstagramCarouselToSlides,
} from '~/utils/parseInstagramCarousel'
import { groqErrorHint } from '~/server/utils/ai/groqParseErrors'

type Body = {
  mode?: CarouselGenerateMode
  text?: string
  city_slug?: string
  events?: CarouselEventInput[]
  cover_title?: string
  timezone?: string
  vibe_key?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  const mode = (body?.mode || 'raw') as CarouselGenerateMode
  const citySlug = typeof body?.city_slug === 'string' ? body.city_slug.trim() : ''

  let cityId: string | null = null
  let cityName = ''
  if (citySlug) {
    const scope = await resolveManagerCityScopeOrThrow(event, citySlug)
    cityId = scope.cityId
    cityName = scope.cityName
  }

  const vibeKey = body?.vibe_key || 'party'
  const rawText =
    typeof body?.text === 'string' ? normalizeCarouselImportText(body.text) : ''

  function localSplitFallback(reason?: string) {
    if (!rawText) return null
    const slides = parseInstagramCarouselToSlides(rawText)
    if (!slides.length) return null
    return {
      ok: true as const,
      source: 'local_split' as const,
      fallback_reason: reason,
      title: slides[0]?.title,
      slides: slides.map((s) => ({ ...s, gradient: vibeKey })),
    }
  }

  if (!process.env.NUXT_GROQ_API_KEY?.trim()) {
    if (mode === 'events' && body?.events?.length) {
      const gradient = resolveCarouselGradientFromTags(
        body.events.flatMap((e) => e.topicTags || []),
      )
      const carousel = buildCarouselFromEvents({
        events: body.events,
        citySlug: citySlug || 'city',
        cityName: cityName || 'INUU',
        timezone: body.timezone || 'Asia/Irkutsk',
        coverTitle: body.cover_title || `Афиша ${cityName}`,
        vibe: gradient,
      })
      return {
        ok: true as const,
        source: 'deterministic' as const,
        title: body.cover_title || carousel.slides[0]?.title,
        slides: carousel.slides,
        template_id: carousel.template_id,
        aspect: carousel.aspect,
      }
    }
    const local = localSplitFallback('NUXT_GROQ_API_KEY not set')
    if (local) return local
    throw createError({ statusCode: 500, statusMessage: 'NUXT_GROQ_API_KEY is not configured' })
  }

  try {
    const { result, model, latencyMs } = await generateCarouselWithGroq({
      mode,
      text: body?.text,
      cityName,
      citySlug,
      events: body?.events?.map((e) => ({
        title: e.title,
        excerpt: e.excerpt,
        tldr: e.tldr,
        startsAt: e.startsAt,
        venueTitle: e.venueTitle,
        price: e.price != null ? String(e.price) : null,
        coverMediaUrl: e.coverMediaUrl,
      })),
    })

    let slides = mapGroqSlidesToCarousel(result.slides, vibeKey)
    const eventCovers = (body?.events || [])
      .map((e) => e.coverMediaUrl?.trim())
      .filter(Boolean) as string[]

    slides = await applyPresetUrlsToSlides(event, slides, {
      cityId,
      vibeKey,
      eventCoverUrls: eventCovers,
    })

    const stickerObjects = await matchStickerIntents(event, result.sticker_intents || [])
    if (stickerObjects.length) {
      slides = slides.map((s, i) => {
        if (i !== 0) return s
        const v2 = normalizeSlideToV2(s) as CarouselSlideV2
        return { ...v2, objects: [...(v2.objects || []), ...stickerObjects] }
      })
    }

    return {
      ok: true as const,
      source: 'groq' as const,
      model,
      latency_ms: latencyMs,
      title: result.carousel_title,
      telegram_post_text: result.telegram_post_text,
      sticker_intents: result.sticker_intents || [],
      slides,
    }
  } catch (err: unknown) {
    if (mode === 'events' && body?.events?.length) {
      const gradient = resolveCarouselGradientFromTags(
        body.events.flatMap((e) => e.topicTags || []),
      )
      const carousel = buildCarouselFromEvents({
        events: body.events,
        citySlug: citySlug || 'city',
        cityName: cityName || 'INUU',
        timezone: body.timezone || 'Asia/Irkutsk',
        coverTitle: body.cover_title || `Афиша ${cityName}`,
        vibe: gradient,
      })
      return {
        ok: true as const,
        source: 'fallback' as const,
        title: body.cover_title,
        slides: carousel.slides,
        template_id: carousel.template_id,
        aspect: carousel.aspect,
      }
    }

    const local = localSplitFallback(groqErrorHint(err))
    if (local) return local

    throw createError({
      statusCode: 502,
      statusMessage: groqErrorHint(err),
    })
  }
})
