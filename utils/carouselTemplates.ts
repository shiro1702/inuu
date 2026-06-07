import type { CarouselTemplateId } from '~/types/editorialCarousel'

export type CarouselTemplateOption = {
  id: CarouselTemplateId
  label: string
  description: string
}

export const CAROUSEL_TEMPLATE_OPTIONS: CarouselTemplateOption[] = [
  {
    id: 'minimal-ios',
    label: 'Minimal iOS',
    description: 'Градиент и крупный заголовок, фото на обложке',
  },
  {
    id: 'photo-card',
    label: 'Фото-карточка',
    description: 'Полноэкранное фото, текст в нижней плашке',
  },
  {
    id: 'editorial-bold',
    label: 'Редакционный',
    description: 'Светлый фон, крупная типографика, фото в рамке',
  },
  {
    id: 'city-poster',
    label: 'Городская афиша',
    description: 'Постер с рамкой и жирным uppercase',
  },
  {
    id: 'stockholm-calm',
    label: 'Stockholm Calm',
    description: 'Скандинавский минимализм: овсяный фон, воздух, мягкая типографика',
  },
  {
    id: 'kyoto-tea',
    label: 'Kyoto Tea',
    description: 'Японский ваби-саби: тонкие линии, serif, приглушённые тона',
  },
  {
    id: 'parisian-atelier',
    label: 'Parisian Atelier',
    description: 'Журнальный шик: паспарту, serif, элегантные акценты',
  },
  {
    id: 'event-digest',
    label: 'Дайджест афиши',
    description: 'Stories-стиль: фото сверху, чёрная плашка, фиолетовый бейдж даты',
  },
]

export const DEFAULT_CAROUSEL_TEMPLATE_ID: CarouselTemplateId = 'minimal-ios'

export function isCarouselTemplateId(value: unknown): value is CarouselTemplateId {
  return CAROUSEL_TEMPLATE_OPTIONS.some((t) => t.id === value)
}

export function normalizeCarouselTemplateId(value: unknown): CarouselTemplateId {
  return isCarouselTemplateId(value) ? value : DEFAULT_CAROUSEL_TEMPLATE_ID
}
