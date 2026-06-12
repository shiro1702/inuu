export type CarouselSlideRole = 'cover' | 'body' | 'outro'

export type CarouselAspect = '1:1' | '4:5' | '9:16' | '16:9'

export type CarouselProjectType = 'carousel' | 'post' | 'story' | 'cover'

export type CarouselTemplateId =
  | 'minimal-ios'
  | 'photo-card'
  | 'editorial-bold'
  | 'city-poster'
  | 'stockholm-calm'
  | 'kyoto-tea'
  | 'parisian-atelier'
  | 'event-digest'

export type CarouselFlowBlock = {
  id: string
  kind: 'text' | 'media'
  role?: string
  content?: string
  url?: string | null
  layout?: string
}

export type CarouselCanvasObject = {
  id: string
  kind: 'sticker' | 'text' | 'logo'
  sticker_id?: string
  image_url?: string
  content?: string
  anchor: 'canvas' | 'flow'
  anchor_target?: string
  x: number
  y: number
  scale?: number
  rotation?: number
  zIndex?: number
}

/** Дата/место/цена для event-digest (отдельно от тезисов в bullets). */
export type CarouselSlideEventFields = {
  event_datetime?: string | null
  event_venue?: string | null
  event_price?: string | null
}

export type CarouselSlideV1 = CarouselSlideEventFields & {
  schema_version?: 1
  role: CarouselSlideRole
  title?: string
  bullets?: string[]
  media_url?: string | null
  cta_text?: string
  gradient?: string
  image_tags?: string[]
  /** Подшаблон внутри темы (напр. event-digest cover/body variants). */
  layout_variant?: string | null
}

export type CarouselSlideV2 = CarouselSlideEventFields & {
  schema_version: 2
  role: CarouselSlideRole
  type?: 'first' | 'middle' | 'last'
  layout_variant?: string
  theme_id?: string
  title?: string
  bullets?: string[]
  media_url?: string | null
  cta_text?: string
  gradient?: string
  background?: {
    type: 'image' | 'gradient'
    url?: string | null
    overlay?: string
  }
  flow?: CarouselFlowBlock[]
  objects?: CarouselCanvasObject[]
}

export type CarouselSlide = CarouselSlideV1 | CarouselSlideV2

export function isCarouselSlideV2(slide: CarouselSlide): slide is CarouselSlideV2 {
  return (slide as CarouselSlideV2).schema_version === 2
}

export type EditorialCarouselMetadata = {
  template_id: CarouselTemplateId
  aspect: CarouselAspect
  slides: CarouselSlide[]
}

export const CAROUSEL_EXPORT_SIZES: Record<CarouselAspect, { width: number; height: number }> = {
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
  '9:16': { width: 1080, height: 1920 },
  '16:9': { width: 1920, height: 1080 },
}

export const CAROUSEL_VIRTUAL_SIZES: Record<CarouselAspect, { width: number; height: number }> = {
  '1:1': { width: 1000, height: 1000 },
  '4:5': { width: 1000, height: 1250 },
  '9:16': { width: 1000, height: 1778 },
  '16:9': { width: 1778, height: 1000 },
}
