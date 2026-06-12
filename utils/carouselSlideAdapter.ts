import type {
  CarouselFlowBlock,
  CarouselSlide,
  CarouselSlideRole,
  CarouselSlideV1,
  CarouselSlideV2,
} from '~/types/editorialCarousel'
import { isCarouselSlideV2 as checkV2 } from '~/types/editorialCarousel'

function roleToType(role: CarouselSlideRole): 'first' | 'middle' | 'last' {
  if (role === 'cover') return 'first'
  if (role === 'outro') return 'last'
  return 'middle'
}

export function normalizeSlideToV2(slide: CarouselSlide): CarouselSlideV2 {
  if (checkV2(slide)) {
    return {
      ...slide,
      flow: slide.flow?.length ? slide.flow : buildFlowFromV1(slide),
      objects: slide.objects || [],
    }
  }
  return {
    schema_version: 2,
    role: slide.role,
    type: roleToType(slide.role),
    title: slide.title,
    bullets: slide.bullets,
    event_datetime: slide.event_datetime,
    event_venue: slide.event_venue,
    event_price: slide.event_price,
    media_url: slide.media_url,
    cta_text: slide.cta_text,
    gradient: slide.gradient,
    layout_variant: slide.layout_variant,
    background: slide.media_url
      ? { type: 'image', url: slide.media_url, overlay: 'rgba(0,0,0,0.35)' }
      : { type: 'gradient' },
    flow: buildFlowFromV1(slide),
    objects: [],
  }
}

function buildFlowFromV1(slide: CarouselSlideV1): CarouselFlowBlock[] {
  const flow: CarouselFlowBlock[] = []
  if (slide.role === 'cover') {
    if (slide.title) flow.push({ id: 'title', kind: 'text', role: 'title', content: slide.title })
    if (slide.media_url) flow.push({ id: 'hero', kind: 'media', role: 'hero_image', url: slide.media_url, layout: 'inset' })
  } else if (slide.role === 'body') {
    if (slide.title) flow.push({ id: 'title', kind: 'text', role: 'title', content: slide.title })
    for (const [i, bullet] of (slide.bullets || []).entries()) {
      flow.push({ id: `bullet_${i}`, kind: 'text', role: 'description', content: bullet })
    }
    if (slide.media_url) flow.push({ id: 'media', kind: 'media', role: 'hero_image', url: slide.media_url, layout: 'inset' })
  } else {
    if (slide.cta_text) flow.push({ id: 'cta', kind: 'text', role: 'cta', content: slide.cta_text })
  }
  return flow
}

export function slideV2ToV1(slide: CarouselSlideV2): CarouselSlideV1 {
  const titleBlock = slide.flow?.find((b) => b.role === 'title' || b.id === 'title')
  const mediaBlock = slide.flow?.find((b) => b.kind === 'media')
  const bullets = slide.flow
    ?.filter((b) => b.role === 'description' || b.id.startsWith('bullet'))
    .map((b) => b.content || '')
    .filter(Boolean)

  return {
    schema_version: 1,
    role: slide.role,
    title: slide.title || titleBlock?.content,
    bullets: slide.bullets?.length ? slide.bullets : bullets,
    event_datetime: slide.event_datetime ?? null,
    event_venue: slide.event_venue ?? null,
    event_price: slide.event_price ?? null,
    media_url: slide.media_url ?? mediaBlock?.url ?? slide.background?.url ?? null,
    cta_text: slide.cta_text || slide.flow?.find((b) => b.role === 'cta')?.content,
    gradient: slide.gradient,
    layout_variant: slide.layout_variant,
  }
}

export function normalizeSlidesForRender(slides: CarouselSlide[]): CarouselSlideV1[] {
  return slides.map((s) => (checkV2(s) ? slideV2ToV1(s) : s))
}
