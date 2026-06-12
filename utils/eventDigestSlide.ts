import type { CarouselSlide } from '~/types/editorialCarousel'

const PRICE_RE = /₽|\bруб\.?\b/i
const MONTH_RE =
  /\b(?:январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр)/i
const DATE_RE =
  /\b\d{1,2}[.\-/]\d{1,2}(?:[.\-/]\d{2,4})?\b|\b\d{1,2}\s+(?:январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр)/i
const TIME_RE = /\b\d{1,2}:\d{2}\b|\b(?:с|до)\s+\d{1,2}(?::\d{2})?\b/i
const ADDRESS_RE =
  /\b(?:ул\.?|улица|пр\.?|проспект|пер\.?|переулок|бул\.?|бульвар|наб\.?|набережная|шоссе|пл\.?|площадь|д\.?|дом|строение|корп\.?|оф\.?|офис)\b/i
const WEEKDAY_RE =
  /(?:понедельник|вторник|сред[ау]|четверг|пятниц|суббот|воскресен)/i
const VENUE_HINT_RE =
  /(?:клуб|кафе|бар|ресторан|галере|театр|парк|центр|музей|«|»)/i
const ACTION_RE =
  /(?:бронь|звонит|запис|регистрац|по\s+телефон|на\s+сайт|в\s+директ|пишите|напишите|whatsapp|telegram)/i

export type EventDigestMetaKind = 'datetime' | 'venue' | 'price' | 'thesis' | 'cta'

export function isEventDigestActionLine(line: string): boolean {
  return ACTION_RE.test(line.trim())
}

export function isEventDigestVenueLine(line: string): boolean {
  const t = line.trim()
  if (ADDRESS_RE.test(t)) return true
  return (
    /^(?:клуб|кафе|бар|ресторан|галере|театр|парк|центр|музей)/i.test(t) &&
    t.length <= 60 &&
    !/[.!?…]$/.test(t)
  )
}

export function isEventDigestWeekdayLine(line: string): boolean {
  const t = line.trim()
  return (
    WEEKDAY_RE.test(t) ||
    /\b(?:ежедневно|круглосуточно|выходные?|будни)\b/i.test(t)
  )
}

/** Место для бейджа 📍 (не призыв к действию). */
export function isEventDigestPlaceLine(line: string): boolean {
  const t = line.trim()
  if (!t || isEventDigestActionLine(t)) return false
  return isEventDigestVenueLine(t)
}

function isPriceLine(line: string): boolean {
  const t = line.trim()
  return (
    PRICE_RE.test(t) ||
    /^бесплатно$/i.test(t) ||
    /^вход\s+свободн/i.test(t) ||
    /^вход\s*:/i.test(t)
  )
}

function classifySimple(t: string, index: number, total: number): EventDigestMetaKind {
  if (isPriceLine(t)) return 'price'
  if (isEventDigestWeekdayLine(t)) return 'datetime'
  if (MONTH_RE.test(t) || DATE_RE.test(t) || TIME_RE.test(t)) return 'datetime'
  if (isEventDigestActionLine(t)) return 'cta'
  if (isEventDigestVenueLine(t)) return 'venue'
  if (index === 1 && total >= 3 && isEventDigestVenueLine(t)) return 'venue'
  if (
    index === 1 &&
    total >= 3 &&
    t.length <= 80 &&
    !/[.!?…]$/.test(t) &&
    !isEventDigestActionLine(t) &&
    !isEventDigestWeekdayLine(t)
  ) {
    return 'venue'
  }
  return 'thesis'
}

/** Разбирает bullets на типизированные части (в т.ч. «19:00, от 500₽»). */
export function parseEventDigestBullets(bullets?: string[]): Array<{ kind: EventDigestMetaKind; text: string }> {
  const lines = (bullets || []).map((x) => x.trim()).filter(Boolean)
  const out: Array<{ kind: EventDigestMetaKind; text: string }> = []

  for (const [index, line] of lines.entries()) {
    const hasTime = TIME_RE.test(line)
    const hasPrice = isPriceLine(line)
    const parts =
      line.includes(',') && hasTime && hasPrice
        ? line.split(',').map((p) => p.trim()).filter(Boolean)
        : [line]

    for (const part of parts) {
      out.push({ kind: classifySimple(part, index, lines.length), text: part })
    }
  }

  return out
}

/** @deprecated Используйте parseEventDigestBullets / eventDigestDateTimeBadges */
export function isEventDigestMetaLine(line: string, index = 0, total = 1): boolean {
  return classifySimple(line.trim(), index, total) !== 'thesis'
}

export function eventDigestDateTimeBadges(bullets?: string[]): string[] {
  return parseEventDigestBullets(bullets)
    .filter((p) => p.kind === 'datetime')
    .map((p) => p.text)
}

export function eventDigestVenueBadges(bullets?: string[]): string[] {
  return parseEventDigestBullets(bullets)
    .filter((p) => p.kind === 'venue')
    .map((p) => p.text)
}

export function eventDigestPriceBadges(bullets?: string[]): string[] {
  return parseEventDigestBullets(bullets)
    .filter((p) => p.kind === 'price')
    .map((p) => p.text)
}

/** Все meta-бейджи подряд (дата → место → цена) — для обратной совместимости. */
export function eventDigestMetaBadges(bullets?: string[]): string[] {
  return [
    ...eventDigestDateTimeBadges(bullets),
    ...eventDigestVenueBadges(bullets),
    ...eventDigestPriceBadges(bullets),
  ]
}

export function eventDigestTheses(bullets?: string[]): string[] {
  return parseEventDigestBullets(bullets)
    .filter((p) => p.kind === 'thesis')
    .map((p) => p.text)
}

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya',
}

function cityHandleFromSlug(slug: string): string {
  const normalized = slug.trim().toLowerCase().replace(/-/g, '')
  return normalized ? `in.${normalized}` : ''
}

function transliterateCityHandle(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .split('')
    .map((ch) => CYRILLIC_TO_LATIN[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '')
}

/** «в Улан-Удэ» для подзаголовков обложки. */
export function eventDigestCityInLabel(cityName?: string | null): string {
  const city = String(cityName || '').trim()
  if (!city) return ''
  const lower = city.charAt(0).toLowerCase() + city.slice(1)
  return `в ${lower}`
}

export function eventDigestCoverSubtitle(slide: CarouselSlide, weekFallback?: string): string {
  const cta = slide.cta_text?.trim()
  if (cta) return cta
  const dt = slide.event_datetime?.trim()
  if (dt) return dt
  return weekFallback || ''
}

export function eventDigestCityHandle(
  linkHint?: string | null,
  cityName?: string | null,
  citySlug?: string | null,
): string {
  const hint = String(linkHint || '').trim()
  const slugMatch = hint.match(/\/([a-z0-9-]+)(?:\/|$)/i)
  if (slugMatch?.[1]) {
    return cityHandleFromSlug(slugMatch[1])
  }

  const slug = String(citySlug || '').trim()
  if (slug) {
    return cityHandleFromSlug(slug)
  }

  const city = String(cityName || '').trim()
  if (city) {
    const latin = transliterateCityHandle(city)
    if (latin) return `in.${latin}`
  }
  return 'inuu'
}

export function eventDigestTitleLines(title: string | undefined): string[] {
  const raw = String(title || '').trim()
  if (!raw) return ['Заголовок']
  if (raw.includes('\n')) {
    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
  }
  const words = raw.split(/\s+/)
  if (words.length >= 5) {
    const mid = Math.ceil(words.length / 2)
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')]
  }
  return [raw]
}

export function eventDigestHeadline(title: string | undefined): string {
  const raw = String(title || 'Событие').trim()
  const withoutEmoji = raw.replace(/^[^\p{L}\p{N}]+/u, '').trim() || raw
  if (/^на\s/i.test(withoutEmoji)) return withoutEmoji
  const lower = withoutEmoji.charAt(0).toLowerCase() + withoutEmoji.slice(1)
  return `На ${lower}`
}

export function eventDigestDateBadge(bullets?: string[]): string {
  return eventDigestDateTimeBadges(bullets)[0] || ''
}

export function eventDigestDescription(bullets?: string[]): string {
  return eventDigestTheses(bullets).join(' ')
}

export function eventDigestVenueLine(bullets?: string[]): string {
  return eventDigestVenueBadges(bullets)[0] || ''
}

export function eventDigestCtaLabelFromVenue(venue: string, linkHint?: string | null): string {
  const v = venue.trim()
  if (v && isEventDigestActionLine(v)) return v
  if (linkHint?.trim()) return 'Подробнее на сайте'
  return 'Подробнее'
}

/** Текст кнопки на контентном слайде event-digest. */
export function eventDigestBodyCtaLabel(
  slide: CarouselSlide,
  linkHint?: string | null,
): string {
  const explicit = slide.cta_text?.trim()
  if (explicit) return explicit
  return eventDigestCtaLabelFromVenue(String(slide.event_venue || ''), linkHint)
}

/** @deprecated Используйте eventDigestCtaLabelFromVenue + resolveSlideEventMeta */
export function eventDigestCtaLabel(bullets?: string[], linkHint?: string | null): string {
  return eventDigestCtaLabelFromVenue(eventDigestVenueLine(bullets), linkHint)
}
