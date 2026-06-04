import type { CarouselAspect, CarouselSlide, EditorialCarouselMetadata } from '~/types/editorialCarousel'
import { formatEventStartsAtRu } from '~/utils/formatEventStartsAtRu'

export type CarouselEventInput = {
  title: string
  slug: string
  startsAt: string | null
  excerpt?: string | null
  tldr?: string | null
  coverMediaUrl?: string | null
  price?: number | null
  currency?: string | null
  venueTitle?: string | null
  vibeEmoji?: string | null
}

function formatEventPriceLine(price: number | null | undefined, currency: string | null | undefined): string | null {
  if (price == null || Number.isNaN(price)) return null
  if (price <= 0) return 'Бесплатно'
  const cur = !currency || currency === 'RUB' ? '₽' : currency
  return `${Math.round(price)} ${cur}`
}

function eventBullets(event: CarouselEventInput, timezone: string): string[] {
  const lines: string[] = []
  const dateLine = formatEventStartsAtRu(event.startsAt, timezone)
  if (dateLine) lines.push(dateLine)
  if (event.venueTitle?.trim()) lines.push(event.venueTitle.trim())
  const priceLine = formatEventPriceLine(event.price ?? null, event.currency ?? null)
  if (priceLine) lines.push(priceLine)
  const blurb = (event.tldr || event.excerpt || '').trim()
  if (blurb) lines.push(blurb.length > 120 ? `${blurb.slice(0, 117)}…` : blurb)
  return lines.slice(0, 5)
}

export function buildCarouselFromEvents(options: {
  events: CarouselEventInput[]
  citySlug: string
  cityName: string
  timezone: string
  coverTitle?: string
  aspect?: CarouselAspect
  vibe?: string
}): EditorialCarouselMetadata {
  const { events, cityName, timezone } = options
  const vibe = options.vibe || 'party'
  const coverTitle = options.coverTitle?.trim() || `Афиша ${cityName}`

  const slides: CarouselSlide[] = []

  if (events.length) {
    const firstCover = events.find((e) => e.coverMediaUrl)?.coverMediaUrl ?? null
    slides.push({
      role: 'cover',
      title: coverTitle,
      media_url: firstCover,
      gradient: vibe,
    })
  } else {
    slides.push({
      role: 'cover',
      title: coverTitle,
      gradient: vibe,
    })
  }

  for (const event of events) {
    const title = [event.vibeEmoji, event.title].filter(Boolean).join(' ').trim() || 'Событие'
    slides.push({
      role: 'body',
      title,
      bullets: eventBullets(event, timezone),
      media_url: event.coverMediaUrl || null,
      gradient: vibe,
    })
  }

  slides.push({
    role: 'outro',
    cta_text: 'Вся афиша в INUU',
    gradient: vibe,
  })

  return {
    template_id: 'minimal-ios',
    aspect: options.aspect || '4:5',
    slides,
  }
}

export function carouselLinkHintForCity(citySlug: string, kind: 'events' | 'home' = 'events'): string {
  const city = citySlug.trim()
  if (!city) return '/'
  return kind === 'events' ? `/${city}/events` : `/${city}`
}
