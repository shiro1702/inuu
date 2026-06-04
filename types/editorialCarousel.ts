export type CarouselSlideRole = 'cover' | 'body' | 'outro'

export type CarouselAspect = '4:5' | '9:16'

export type CarouselTemplateId = 'minimal-ios' | 'photo-card' | 'editorial-bold' | 'city-poster'

export type CarouselSlide = {
  role: CarouselSlideRole
  title?: string
  bullets?: string[]
  media_url?: string | null
  cta_text?: string
  gradient?: string
}

export type EditorialCarouselMetadata = {
  template_id: CarouselTemplateId
  aspect: CarouselAspect
  slides: CarouselSlide[]
}

export const CAROUSEL_EXPORT_SIZES: Record<CarouselAspect, { width: number; height: number }> = {
  '4:5': { width: 1080, height: 1350 },
  '9:16': { width: 1080, height: 1920 },
}
