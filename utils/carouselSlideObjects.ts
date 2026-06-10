import type { CarouselCanvasObject, CarouselSlide } from '~/types/editorialCarousel'
import { isCarouselSlideV2 } from '~/types/editorialCarousel'

export function getSlideStickerObjects(slide: CarouselSlide | null): CarouselCanvasObject[] {
  if (!slide || !isCarouselSlideV2(slide)) return []
  return (slide.objects || []).filter((o) => o.kind === 'sticker' && o.image_url)
}
