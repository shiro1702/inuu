import type { CarouselSlide, EditorialCarouselMetadata } from '~/types/editorialCarousel'

function splitCarouselBlocks(raw: string): string[] {
  const normalized = raw.replace(/\r\n/g, '\n').trim()
  if (!normalized) return []

  const byDelimiter = normalized
    .split(/\n-{3,}\n|\n—{3,}\n/)
    .map((b) => b.trim())
    .filter(Boolean)
  if (byDelimiter.length > 1) return byDelimiter

  const numbered = [...normalized.matchAll(/(?:^|\n)\s*(?:слайд\s*)?(\d+)[.)]\s*([^\n]+(?:\n(?!\s*(?:слайд\s*)?\d+[.)])[^\n]*)*)/gi)]
  if (numbered.length >= 2) {
    return numbered.map((m) => m[2]?.trim() || '').filter(Boolean)
  }

  const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean)
  if (lines.length >= 3) return lines

  return [normalized]
}

function parseBlockToSlide(block: string, index: number, total: number): CarouselSlide {
  const lines = block
    .split('\n')
    .map((l) => l.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)

  const title = lines[0] || `Слайд ${index + 1}`
  const bullets = lines.slice(1).filter((l) => l.length > 2)

  const role: CarouselSlide['role'] =
    index === 0 ? 'cover' : index === total - 1 ? 'outro' : 'body'

  if (role === 'outro') {
    return {
      role,
      cta_text: title,
      title: bullets.length ? bullets.join(' ') : undefined,
    }
  }

  if (role === 'cover') {
    return { role, title, bullets: bullets.length ? bullets : undefined }
  }

  return {
    role: 'body',
    title: bullets.length ? title : undefined,
    bullets: bullets.length ? bullets : [title],
  }
}

export function parseInstagramCarouselToSlides(
  instagramCarousel: string,
  fallback?: { title?: string; descriptionShort?: string },
): CarouselSlide[] {
  const blocks = splitCarouselBlocks(instagramCarousel)
  if (blocks.length) {
    return blocks.map((block, index) => parseBlockToSlide(block, index, blocks.length))
  }

  const title = fallback?.title?.trim()
  const short = fallback?.descriptionShort?.trim()
  if (!title && !short) return []

  const bullets =
    short
      ?.split(/[.!?]\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 8)
      .slice(0, 4) || []

  const slides: CarouselSlide[] = []
  if (title) slides.push({ role: 'cover', title })
  if (bullets.length) {
    slides.push({ role: 'body', title: 'Главное', bullets })
  } else if (short) {
    slides.push({ role: 'body', bullets: [short] })
  }
  slides.push({ role: 'outro', cta_text: 'Читать в приложении' })
  return slides
}

export function buildEditorialCarouselMetadata(args: {
  instagramCarousel: string
  coverMediaUrl?: string | null
  topicTags?: string[]
  aspect?: EditorialCarouselMetadata['aspect']
  fallback?: { title?: string; descriptionShort?: string }
}): EditorialCarouselMetadata | null {
  const slides = parseInstagramCarouselToSlides(args.instagramCarousel, args.fallback)
  if (slides.length < 2) return null

  const gradient = args.topicTags?.[0] || 'party'
  const withMedia = slides.map((slide, index) => {
    if (index === 0 && args.coverMediaUrl && !slide.media_url) {
      return { ...slide, media_url: args.coverMediaUrl, gradient }
    }
    return slide.gradient ? slide : { ...slide, gradient }
  })

  return {
    template_id: 'minimal-ios',
    aspect: args.aspect || '4:5',
    slides: withMedia,
  }
}

export function mergeEditorialPostMetadata(
  existing: unknown,
  carousel: EditorialCarouselMetadata | null,
  extra?: Record<string, unknown>,
): Record<string, unknown> {
  const base =
    existing && typeof existing === 'object' && !Array.isArray(existing)
      ? { ...(existing as Record<string, unknown>) }
      : {}
  if (carousel) base.carousel = carousel
  if (extra) Object.assign(base, extra)
  return base
}

export function resolveCarouselFromPayload(
  payload: Record<string, unknown>,
): EditorialCarouselMetadata | null {
  const prebuilt = payload.carousel_metadata
  if (prebuilt && typeof prebuilt === 'object' && !Array.isArray(prebuilt)) {
    return prebuilt as EditorialCarouselMetadata
  }

  const pack = payload.content_pack as { instagram_carousel?: string } | undefined
  const instagramCarousel = pack?.instagram_carousel
  if (!instagramCarousel?.trim()) return null

  return buildEditorialCarouselMetadata({
    instagramCarousel,
    coverMediaUrl:
      typeof payload.cover_media_url === 'string' ? payload.cover_media_url : null,
    topicTags: Array.isArray(payload.topic_tags)
      ? payload.topic_tags.map((t) => String(t))
      : [],
    fallback: {
      title: typeof payload.title === 'string' ? payload.title : undefined,
      descriptionShort:
        typeof payload.description_short === 'string' ? payload.description_short : undefined,
    },
  })
}
