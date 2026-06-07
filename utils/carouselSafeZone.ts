import type { CarouselAspect } from '~/types/editorialCarousel'

/** Нижняя safe zone Stories (1080×1920): reply / share / DM UI Instagram. */
export const CAROUSEL_STORIES_SAFE_BOTTOM_PX = 280

/** Отступ контента под футер chrome (pb-32). */
export const CAROUSEL_CHROME_CONTENT_BOTTOM_PX = 128

export function isCarouselStoriesAspect(aspect: CarouselAspect): boolean {
  return aspect === '9:16'
}

export function carouselStoriesExtraBottomPaddingPx(aspect: CarouselAspect): number {
  return isCarouselStoriesAspect(aspect) ? CAROUSEL_STORIES_SAFE_BOTTOM_PX : 0
}

export function carouselChromeFooterBottomStyle(
  aspect: CarouselAspect,
): Record<string, string> | undefined {
  const extra = carouselStoriesExtraBottomPaddingPx(aspect)
  if (!extra) return undefined
  return { bottom: `${extra}px` }
}
