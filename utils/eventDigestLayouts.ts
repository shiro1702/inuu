import type { CarouselSlide, CarouselSlideRole } from '~/types/editorialCarousel'
import { isCarouselSlideV2 } from '~/types/editorialCarousel'

export type EventDigestLayoutRole = 'cover' | 'body' | 'outro'

export type EventDigestLayoutOption = {
  id: string
  role: EventDigestLayoutRole
  label: string
  description: string
  textOnly?: boolean
}

export const EVENT_DIGEST_COVER_LAYOUTS: EventDigestLayoutOption[] = [
  {
    id: 'digest-cover-branded',
    role: 'cover',
    label: 'Бренд + неделя',
    description: 'Хэндл и заголовок снизу, фиолетовый бейдж недели',
  },
  {
    id: 'digest-cover-center-date',
    role: 'cover',
    label: 'Центр + дата',
    description: 'Заголовок по центру, дата под ним, хэндл сверху',
  },
  {
    id: 'digest-cover-center-city',
    role: 'cover',
    label: 'Центр + город',
    description: 'Заголовок в фиолетовом бейдже, город под ним',
  },
  {
    id: 'digest-cover-photo-hero',
    role: 'cover',
    label: 'Фото-герой',
    description: 'Крупное фото, текст в нижней плашке',
  },
  {
    id: 'digest-cover-text-stack',
    role: 'cover',
    label: 'Только текст',
    description: 'Градиент, крупная типографика по центру',
    textOnly: true,
  },
]

export const EVENT_DIGEST_BODY_LAYOUTS: EventDigestLayoutOption[] = [
  {
    id: 'digest-body-split',
    role: 'body',
    label: 'Фото сверху',
    description: 'Классический split: фото 42%, текст снизу',
  },
  {
    id: 'digest-body-fullbleed',
    role: 'body',
    label: 'Фото на весь экран',
    description: 'Фото с затемнением, текст поверх внизу',
  },
  {
    id: 'digest-body-text',
    role: 'body',
    label: 'Только текст',
    description: 'Без фото, акцент на мета-бейджах',
    textOnly: true,
  },
  {
    id: 'digest-body-side',
    role: 'body',
    label: 'Фото слева',
    description: 'Колонка: фото 44% слева, детали справа',
  },
  {
    id: 'digest-body-compact',
    role: 'body',
    label: 'Карточка',
    description: 'Мини-превью и заголовок в одной строке',
  },
]

export const EVENT_DIGEST_OUTRO_LAYOUTS: EventDigestLayoutOption[] = [
  {
    id: 'digest-outro-qr',
    role: 'outro',
    label: 'QR центр',
    description: 'Крупный QR по центру и CTA',
  },
  {
    id: 'digest-outro-compact',
    role: 'outro',
    label: 'QR компакт',
    description: 'CTA сверху, небольшой QR снизу',
  },
  {
    id: 'digest-outro-cta',
    role: 'outro',
    label: 'Только CTA',
    description: 'Крупный призыв без QR',
    textOnly: true,
  },
  {
    id: 'digest-outro-split',
    role: 'outro',
    label: 'QR + текст',
    description: 'QR слева, текст и кнопка справа',
  },
  {
    id: 'digest-outro-purple',
    role: 'outro',
    label: 'Фиолетовый',
    description: 'Фиолетовый фон, белая рамка QR',
  },
]

export const EVENT_DIGEST_ALL_LAYOUTS: EventDigestLayoutOption[] = [
  ...EVENT_DIGEST_COVER_LAYOUTS,
  ...EVENT_DIGEST_BODY_LAYOUTS,
  ...EVENT_DIGEST_OUTRO_LAYOUTS,
]

const DEFAULT_BY_ROLE: Record<EventDigestLayoutRole, string> = {
  cover: 'digest-cover-branded',
  body: 'digest-body-split',
  outro: 'digest-outro-qr',
}

export function eventDigestLayoutsForRole(role: CarouselSlideRole): EventDigestLayoutOption[] {
  if (role === 'cover') return EVENT_DIGEST_COVER_LAYOUTS
  if (role === 'outro') return EVENT_DIGEST_OUTRO_LAYOUTS
  return EVENT_DIGEST_BODY_LAYOUTS
}

export function resolveEventDigestLayoutVariant(
  slide: CarouselSlide,
  role: CarouselSlideRole = slide.role,
): string {
  const variant = slide.layout_variant?.trim()
  if (variant && EVENT_DIGEST_ALL_LAYOUTS.some((l) => l.id === variant)) return variant
  if (isCarouselSlideV2(slide) && slide.layout_variant?.trim()) {
    return slide.layout_variant.trim()
  }
  return DEFAULT_BY_ROLE[role === 'outro' ? 'outro' : role === 'cover' ? 'cover' : 'body']
}

export function assignEventDigestLayoutVariants(slides: CarouselSlide[]): CarouselSlide[] {
  let coverIdx = 0
  let bodyIdx = 0
  let outroIdx = 0

  return slides.map((slide) => {
    if (slide.role === 'cover') {
      const layout_variant =
        EVENT_DIGEST_COVER_LAYOUTS[coverIdx % EVENT_DIGEST_COVER_LAYOUTS.length]?.id
        || DEFAULT_BY_ROLE.cover
      coverIdx += 1
      return { ...slide, layout_variant }
    }
    if (slide.role === 'body') {
      const layout_variant =
        EVENT_DIGEST_BODY_LAYOUTS[bodyIdx % EVENT_DIGEST_BODY_LAYOUTS.length]?.id
        || DEFAULT_BY_ROLE.body
      bodyIdx += 1
      return { ...slide, layout_variant }
    }
    if (slide.role === 'outro') {
      const layout_variant =
        EVENT_DIGEST_OUTRO_LAYOUTS[outroIdx % EVENT_DIGEST_OUTRO_LAYOUTS.length]?.id
        || DEFAULT_BY_ROLE.outro
      outroIdx += 1
      return { ...slide, layout_variant }
    }
    return slide
  })
}
