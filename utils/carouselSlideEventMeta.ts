import type { CarouselSlide } from '~/types/editorialCarousel'
import {
  eventDigestDateTimeBadges,
  eventDigestPriceBadges,
  eventDigestTheses,
  eventDigestVenueBadges,
} from '~/utils/eventDigestSlide'

export type ResolvedSlideEventMeta = {
  datetime: string
  venue: string
  price: string
  theses: string[]
}

export function hasStructuredEventMeta(slide: CarouselSlide): boolean {
  const s = slide as CarouselSlide & CarouselSlideEventFields
  return Boolean(s.event_datetime?.trim() || s.event_venue?.trim() || s.event_price?.trim())
}

/** Поля слайда + fallback на разбор bullets (старые проекты). */
export function resolveSlideEventMeta(slide: CarouselSlide | null | undefined): ResolvedSlideEventMeta {
  if (!slide) {
    return { datetime: '', venue: '', price: '', theses: [] }
  }

  const s = slide as CarouselSlide & CarouselSlideEventFields

  if (hasStructuredEventMeta(slide)) {
    return {
      datetime: s.event_datetime?.trim() || '',
      venue: s.event_venue?.trim() || '',
      price: s.event_price?.trim() || '',
      theses: (slide.bullets || []).map((b) => b.trim()).filter(Boolean),
    }
  }

  return {
    datetime: eventDigestDateTimeBadges(slide.bullets)[0] || '',
    venue: eventDigestVenueBadges(slide.bullets)[0] || '',
    price: eventDigestPriceBadges(slide.bullets)[0] || '',
    theses: eventDigestTheses(slide.bullets),
  }
}
