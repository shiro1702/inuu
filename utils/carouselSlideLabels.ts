import type { CarouselSlide, CarouselSlideRole } from '~/types/editorialCarousel'

export function carouselSlideRoleLabel(
  slide: CarouselSlide,
  index: number,
  slides: CarouselSlide[],
): string {
  if (slide.role === 'cover') return 'Обложка'
  if (slide.role === 'outro') return 'Финал / CTA'
  const bodyTotal = slides.filter((s) => s.role === 'body').length
  const bodyIdx = slides.slice(0, index + 1).filter((s) => s.role === 'body').length
  if (bodyTotal > 1) return `Контент ${bodyIdx}`
  return 'Контент'
}

export function carouselSlidePreviewText(slide: CarouselSlide): string {
  if (slide.role === 'outro') return slide.cta_text || slide.title || 'CTA'
  if (slide.title) return slide.title
  const bullets = slide.bullets || []
  if (bullets.length) return bullets[0]!
  return 'Пустой слайд'
}

export function defaultSlideForRole(role: CarouselSlideRole, vibe = 'party'): CarouselSlide {
  if (role === 'cover') {
    return { role, title: 'Заголовок обложки', media_url: null, gradient: vibe }
  }
  if (role === 'outro') {
    return { role, cta_text: 'Читать в INUU', gradient: vibe }
  }
  return { role: 'body', title: 'Новый слайд', bullets: ['Тезис'], gradient: vibe }
}
