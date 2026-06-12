import type { CarouselSlide, EditorialCarouselMetadata } from '~/types/editorialCarousel'
import { buildCarouselFromEvents } from '~/utils/buildCarouselFromEvents'
import { resolveCarouselGradientFromTags } from '~/utils/carouselVibeTheme'
import { listMaterialCoverUrls } from '~/utils/resolveMaterialCoverUrl'

/** Убирает ведущий/замыкающий --- и нормализует переносы (импорт в карусель / Groq). */
export function normalizeCarouselImportText(raw: string): string {
  return raw
    .replace(/\r\n/g, '\n')
    .replace(/^-{3,}\s*\n+/, '')
    .replace(/\n+-{3,}\s*$/, '')
    .trim()
}

function stripDelimiterLines(block: string): string {
  return block
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !/^-{3,}$/.test(line) && !/^—{3,}$/.test(line))
    .join('\n')
    .trim()
}

function splitCarouselBlocks(raw: string): string[] {
  const normalized = normalizeCarouselImportText(raw)
  if (!normalized) return []

  const byDelimiter = normalized
    .split(/\n-{3,}\n|\n—{3,}\n/)
    .map((block) => stripDelimiterLines(block))
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
  mediaUrls?: string[] | null
  topicTags?: string[]
  aspect?: EditorialCarouselMetadata['aspect']
  fallback?: { title?: string; descriptionShort?: string }
}): EditorialCarouselMetadata | null {
  const slides = parseInstagramCarouselToSlides(args.instagramCarousel, args.fallback)
  if (slides.length < 2) return null

  const gradient = args.topicTags?.[0] || 'party'
  const gallery = listMaterialCoverUrls({
    coverMediaUrl: args.coverMediaUrl,
    sourceMetadata: { media_urls: args.mediaUrls || [] },
  })

  let bodyMediaIndex = 0
  const withMedia = slides.map((slide) => {
    if (slide.role === 'outro') {
      return { ...slide, gradient }
    }
    if (slide.role === 'cover') {
      const media_url = slide.media_url || gallery[0] || null
      return { ...slide, media_url, gradient }
    }
    bodyMediaIndex += 1
    const media_url =
      slide.media_url || gallery[bodyMediaIndex] || gallery[0] || null
    return { ...slide, media_url, gradient }
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

export type EditorialLinkedVenueInput = {
  slug: string
  title: string
  cover_media_url?: string | null
  address?: string | null
  editorial_quote?: string | null
  vibe_tags?: string[] | null
}

export type EditorialPostCarouselInput = {
  title: string
  excerpt?: string | null
  body?: string | null
  cover_media_url?: string | null
  topic_tags?: string[] | null
  metadata?: Record<string, unknown> | null
  linked_venues?: EditorialLinkedVenueInput[]
}

function editorialPostDescriptionShort(post: EditorialPostCarouselInput): string | undefined {
  const excerpt = post.excerpt?.trim()
  if (excerpt) return excerpt

  const body = post.body?.trim()
  if (!body) return undefined

  const firstParagraph = body.split(/\n{2,}/).map((p) => p.trim()).find(Boolean)
  const source = firstParagraph || body
  return source.length > 420 ? `${source.slice(0, 420).trim()}…` : source
}

function isValidCarouselMetadata(raw: unknown): raw is EditorialCarouselMetadata {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return false
  const slides = (raw as EditorialCarouselMetadata).slides
  return Array.isArray(slides) && slides.length >= 2
}

function excerptBullets(excerpt: string): string[] {
  return excerpt
    .split(/[.!?]\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 8)
    .slice(0, 4)
}

function buildCarouselFromLinkedVenues(
  post: EditorialPostCarouselInput,
  venues: EditorialLinkedVenueInput[],
): EditorialCarouselMetadata {
  const allTags = [
    ...(post.topic_tags || []),
    ...venues.flatMap((v) => v.vibe_tags || []),
  ]
  const gradient = resolveCarouselGradientFromTags(allTags)
  const carousel = buildCarouselFromEvents({
    events: venues.map((venue) => ({
      entityType: 'venue' as const,
      title: venue.title,
      slug: venue.slug,
      excerpt: venue.editorial_quote,
      address: venue.address,
      coverMediaUrl: venue.cover_media_url,
      topicTags: venue.vibe_tags || [],
    })),
    citySlug: '',
    cityName: '',
    timezone: 'Asia/Irkutsk',
    coverTitle: post.title,
    coverMediaUrl: post.cover_media_url,
    outroCta: 'Читать в INUU',
    vibe: gradient,
  })

  const excerpt = post.excerpt?.trim()
  if (!excerpt || venues.length === 0) return carousel

  const outro = carousel.slides.at(-1)
  const bodySlides = carousel.slides.slice(1, -1)
  const introSlide: CarouselSlide = {
    role: 'body',
    title: 'О маршруте',
    bullets: excerptBullets(excerpt),
    gradient,
  }

  return {
    ...carousel,
    slides: [carousel.slides[0]!, introSlide, ...bodySlides, outro!],
  }
}

/** Saved carousel → content_pack → venues → title/excerpt/body fallback for Carousel Studio. */
export function resolveCarouselFromEditorialPost(
  post: EditorialPostCarouselInput,
): EditorialCarouselMetadata | null {
  const metadata =
    post.metadata && typeof post.metadata === 'object' && !Array.isArray(post.metadata)
      ? post.metadata
      : null

  const saved = metadata?.carousel
  if (isValidCarouselMetadata(saved)) {
    return saved
  }

  const fallback = {
    title: post.title,
    descriptionShort: editorialPostDescriptionShort(post),
  }

  const pack = metadata?.content_pack as { instagram_carousel?: string } | undefined
  if (pack?.instagram_carousel?.trim()) {
    const fromPack = buildEditorialCarouselMetadata({
      instagramCarousel: pack.instagram_carousel,
      coverMediaUrl: post.cover_media_url,
      topicTags: post.topic_tags || undefined,
      fallback,
    })
    if (fromPack) return fromPack
  }

  const venues = (post.linked_venues || []).filter((v) => v.title?.trim())
  if (venues.length) {
    return buildCarouselFromLinkedVenues(post, venues)
  }

  const fromText = buildEditorialCarouselMetadata({
    instagramCarousel: '',
    coverMediaUrl: post.cover_media_url,
    topicTags: post.topic_tags || undefined,
    fallback,
  })
  if (fromText) {
    const outro = fromText.slides.at(-1)
    if (outro?.role === 'outro') {
      outro.cta_text = 'Читать в INUU'
    }
    return fromText
  }

  return null
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

  const mediaUrls = [
    typeof payload.cover_media_url === 'string' ? payload.cover_media_url : '',
    ...(Array.isArray(payload.media_urls) ? payload.media_urls.map((x) => String(x || '')) : []),
  ].map((x) => x.trim()).filter(Boolean)

  return buildEditorialCarouselMetadata({
    instagramCarousel,
    coverMediaUrl: mediaUrls[0] || null,
    mediaUrls,
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
