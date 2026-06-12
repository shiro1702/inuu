import type { CarouselAspect, CarouselSlide, CarouselTemplateId, EditorialCarouselMetadata } from '~/types/editorialCarousel'
import { assignEventDigestLayoutVariants } from '~/utils/eventDigestLayouts'
import { DEFAULT_CAROUSEL_TEMPLATE_ID } from '~/utils/carouselTemplates'
import { formatEventStartsAtRu } from '~/utils/formatEventStartsAtRu'
import { resolveMaterialCoverUrl } from '~/utils/resolveMaterialCoverUrl'

export type CarouselMaterialInput = {
  id?: string
  entityType?: 'event' | 'venue'
  title: string
  slug: string
  topicTags?: string[]
  startsAt?: string | null
  excerpt?: string | null
  tldr?: string | null
  coverMediaUrl?: string | null
  sourceMetadata?: unknown
  source_metadata?: unknown
  price?: number | null
  currency?: string | null
  venueTitle?: string | null
  address?: string | null
  vibeEmoji?: string | null
  listNote?: string | null
}

/** @deprecated use CarouselMaterialInput */
export type CarouselEventInput = CarouselMaterialInput

function resolvedCover(material: CarouselMaterialInput): string | null {
  return (
    resolveMaterialCoverUrl({
      coverMediaUrl: material.coverMediaUrl,
      sourceMetadata: material.sourceMetadata,
      source_metadata: material.source_metadata,
    }) || null
  )
}

function formatEventPriceLine(price: number | null | undefined, currency: string | null | undefined): string | null {
  if (price == null || Number.isNaN(price)) return null
  if (price <= 0) return 'Бесплатно'
  const cur = !currency || currency === 'RUB' ? '₽' : currency
  return `${Math.round(price)} ${cur}`
}

function materialThesisBullets(material: CarouselMaterialInput): string[] {
  const lines: string[] = []

  if (material.entityType === 'venue') {
    const blurb = (material.excerpt || '').trim()
    if (blurb) lines.push(blurb.length > 120 ? `${blurb.slice(0, 117)}…` : blurb)
  } else {
    const blurb = (material.tldr || material.excerpt || '').trim()
    if (blurb) lines.push(blurb.length > 120 ? `${blurb.slice(0, 117)}…` : blurb)
  }

  if (material.listNote?.trim()) {
    const note = material.listNote.trim()
    lines.unshift(note.length > 140 ? `${note.slice(0, 137)}…` : note)
  }

  return lines.slice(0, 3)
}

function materialEventFields(
  material: CarouselMaterialInput,
  timezone: string,
): { event_datetime: string | null; event_venue: string | null; event_price: string | null } {
  if (material.entityType === 'venue') {
    return {
      event_datetime: null,
      event_venue: material.address?.trim() || material.title?.trim() || null,
      event_price: null,
    }
  }

  return {
    event_datetime: formatEventStartsAtRu(material.startsAt ?? null, timezone) || null,
    event_venue: material.venueTitle?.trim() || null,
    event_price: formatEventPriceLine(material.price ?? null, material.currency ?? null),
  }
}

export function buildCarouselFromEvents(options: {
  events: CarouselMaterialInput[]
  citySlug: string
  cityName: string
  timezone: string
  coverTitle?: string
  coverMediaUrl?: string | null
  outroCta?: string
  aspect?: CarouselAspect
  vibe?: string
  templateId?: CarouselTemplateId
}): EditorialCarouselMetadata {
  const materials = options.events
  const { cityName, timezone } = options
  const vibe = options.vibe || 'party'
  const coverTitle = options.coverTitle?.trim() || `Афиша ${cityName}`

  const slides: CarouselSlide[] = []

  const firstCover =
    options.coverMediaUrl?.trim() ||
    materials.map((m) => resolvedCover(m)).find(Boolean) ||
    null
  slides.push({
    role: 'cover',
    title: coverTitle,
    media_url: firstCover,
    gradient: vibe,
  })

  for (const material of materials) {
    const title = [material.vibeEmoji, material.title].filter(Boolean).join(' ').trim() || 'Событие'
    const cover = resolvedCover(material)
    const eventFields = materialEventFields(material, timezone)
    const bullets = materialThesisBullets(material)
    slides.push({
      role: 'body',
      title,
      ...eventFields,
      bullets: bullets.length ? bullets : undefined,
      media_url: cover,
      gradient: vibe,
    })
  }

  slides.push({
    role: 'outro',
    cta_text: options.outroCta?.trim() || 'Вся афиша в INUU',
    gradient: vibe,
  })

  const templateId = options.templateId || DEFAULT_CAROUSEL_TEMPLATE_ID
  const finalSlides = templateId === 'event-digest' ? assignEventDigestLayoutVariants(slides) : slides

  return {
    template_id: templateId,
    aspect: options.aspect || '4:5',
    slides: finalSlides,
  }
}

export function carouselLinkHintForCity(
  citySlug: string,
  kind: 'events' | 'home' | 'list' = 'events',
  listSlug?: string,
): string {
  const city = citySlug.trim()
  if (!city) return '/'
  if (kind === 'list' && listSlug?.trim()) return `/${city}/lists/${listSlug.trim()}`
  return kind === 'events' ? `/${city}/events` : `/${city}`
}
