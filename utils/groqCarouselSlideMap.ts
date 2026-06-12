import type { CarouselSlide, CarouselSlideRole } from '~/types/editorialCarousel'

export type GroqCarouselSlidePayload = {
  type?: 'first' | 'middle' | 'last'
  title?: string
  subtitle?: string
  text?: string
  badge?: string
  /** CTA на body-слайде или финальный призыв на outro. */
  cta_text?: string
  image_tags?: string[]
  event_datetime?: string
  event_venue?: string
  event_price?: string
}

const GROQ_EVENT_FIELDS_HINT = [
  'Для middle-слайдов события обязательно заполни отдельные поля:',
  'title — название («Дегустационный сет из 5 блюд»); первая строка без меток — заголовок.',
  'event_datetime — дата, время или дни («7 июня, 19:00», «Пятница–воскресенье»);',
  'event_venue — только место (кафе, клуб, адрес), не бронь и не призыв;',
  'cta_text — текст кнопки «Подробнее» («Бронь по телефону», «Записаться»);',
  'event_price — цена («от 500₽», «Бесплатно», «Вход свободный»);',
  'text — только описание/тезис, без даты, цены, адреса и призыва.',
  'Пример: «Начало в 19:00\\nАдрес: ул. Ленина, 12\\nВход свободный» →',
  'event_datetime=«19:00», event_venue=«ул. Ленина, 12», event_price=«Вход свободный», text=null.',
  'Пример: «Дегустационный сет\\nБронь по телефону\\nПятница–воскресенье» →',
  'title=«Дегустационный сет», cta_text=«Бронь по телефону», event_datetime=«Пятница–воскресенье».',
  'Не выдумывай место и цену, если их нет в исходном тексте.',
].join('\n')

export function groqCarouselEventFieldsPrompt(): string {
  return GROQ_EVENT_FIELDS_HINT
}

export function groqCarouselSlideJsonShape(): Record<string, unknown> {
  return {
    type: 'first | middle | last',
    title: 'string',
    event_datetime: 'string | null — дата и время события',
    event_venue: 'string | null — место (кафе, адрес)',
    cta_text: 'string | null — текст кнопки «Подробнее»',
    event_price: 'string | null — цена',
    text: 'string | null — описание (только тезис)',
    subtitle: 'string | null — legacy, не дублировать event_*',
    badge: 'string | null — legacy',
    image_tags: ['english tags for stock photos'],
  }
}

function pickStr(...values: Array<string | undefined | null>): string | undefined {
  for (const v of values) {
    const t = String(v || '').trim()
    if (t) return t
  }
  return undefined
}

export function mapGroqPayloadToCarouselSlide(
  s: GroqCarouselSlidePayload,
  role: CarouselSlideRole,
  vibe = 'party',
): CarouselSlide {
  if (role === 'cover') {
    return {
      role,
      title: pickStr(s.title, s.subtitle) || 'Обложка',
      event_datetime: pickStr(s.event_datetime, s.badge),
      media_url: null,
      gradient: vibe,
      image_tags: s.image_tags,
    } as CarouselSlide
  }

  if (role === 'outro') {
    return {
      role,
      title: pickStr(s.title) || undefined,
      cta_text: pickStr(s.cta_text, s.title) || 'Открыть в INUU',
      gradient: vibe,
      image_tags: s.image_tags,
    } as CarouselSlide
  }

  const event_datetime = pickStr(s.event_datetime, s.badge)
  const event_venue = pickStr(s.event_venue, s.subtitle)
  const event_price = pickStr(s.event_price)
  const thesis = pickStr(s.text)

  const bullets: string[] = []
  if (thesis) bullets.push(thesis)

  if (!event_datetime && !event_venue && !event_price && !thesis) {
    const legacy = [s.text, s.badge, s.subtitle].map((x) => String(x || '').trim()).filter(Boolean)
    if (legacy.length) bullets.push(...legacy)
    else bullets.push('Детали скоро')
  }

  return {
    role: 'body',
    title: pickStr(s.title) || 'Слайд',
    event_datetime: event_datetime || null,
    event_venue: event_venue || null,
    event_price: event_price || null,
    cta_text: pickStr(s.cta_text) || undefined,
    bullets: bullets.length ? bullets : undefined,
    gradient: vibe,
    image_tags: s.image_tags,
  } as CarouselSlide
}
