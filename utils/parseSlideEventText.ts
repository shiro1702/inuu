import type { CarouselSlide, CarouselSlideRole } from '~/types/editorialCarousel'
import {
  parseEventDigestBullets,
  type EventDigestMetaKind,
} from '~/utils/eventDigestSlide'

export type ParsedSlideEventText = {
  title?: string
  event_datetime: string
  event_venue: string
  event_price: string
  theses: string[]
  /** В тексте есть явные метки «Начало», «Адрес:», «Вход» и т.п. */
  isStructured: boolean
}

const DATETIME_LINE =
  /^(?:начало(?:\s+в)?|время|дата(?:\s+и\s+время)?)\s*[:—-]?\s*(.*)$/i
const VENUE_LINE = /^(?:адрес|место|локация|где)\s*[:—-]?\s*(.*)$/i
const PRICE_LINE = /^(?:цена|вход|стоимость|билет(?:ы)?)\s*[:—-]?\s*(.*)$/i

function parseLabeledLine(line: string): { kind: EventDigestMetaKind; text: string } | null {
  const trimmed = line.trim()
  if (!trimmed) return null

  if (/^вход\s+свободн/i.test(trimmed) || /^бесплатн/i.test(trimmed)) {
    return { kind: 'price', text: trimmed }
  }

  let match = trimmed.match(DATETIME_LINE)
  if (match) {
    const value = (match[1] || '').trim()
    return { kind: 'datetime', text: value || trimmed }
  }

  match = trimmed.match(VENUE_LINE)
  if (match) {
    const value = (match[1] || '').trim()
    return { kind: 'venue', text: value || trimmed }
  }

  match = trimmed.match(PRICE_LINE)
  if (match) {
    const value = (match[1] || '').trim()
    return { kind: 'price', text: value || trimmed }
  }

  return null
}

function assignMeta(
  parsed: ParsedSlideEventText,
  kind: EventDigestMetaKind,
  text: string,
  fallbackLine: string,
) {
  const value = text || fallbackLine
  if (kind === 'datetime' && !parsed.event_datetime) parsed.event_datetime = value
  else if (kind === 'venue' && !parsed.event_venue) parsed.event_venue = value
  else if (kind === 'price' && !parsed.event_price) parsed.event_price = value
  else parsed.theses.push(fallbackLine)
}

/** Разбирает сырой текст слайда на поля события. */
export function parseSlideEventText(text: string): ParsedSlideEventText {
  const lines = text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)

  const parsed: ParsedSlideEventText = {
    event_datetime: '',
    event_venue: '',
    event_price: '',
    theses: [],
    isStructured: false,
  }

  for (const line of lines) {
    const labeled = parseLabeledLine(line)
    if (labeled) {
      parsed.isStructured = true
      assignMeta(parsed, labeled.kind, labeled.text, line)
    }
  }

  if (parsed.isStructured) {
    for (const part of parseEventDigestBullets(lines)) {
      if (part.kind === 'datetime' && !parsed.event_datetime) parsed.event_datetime = part.text
      else if (part.kind === 'venue' && !parsed.event_venue) parsed.event_venue = part.text
      else if (part.kind === 'price' && !parsed.event_price) parsed.event_price = part.text
      else if (part.kind === 'thesis') parsed.theses.push(part.text)
    }
    return parsed
  }

  const parts = parseEventDigestBullets(lines)
  const datetimes: string[] = []
  const venues: string[] = []
  const prices: string[] = []
  const theses: string[] = []

  for (const part of parts) {
    if (part.kind === 'datetime') datetimes.push(part.text)
    else if (part.kind === 'venue') venues.push(part.text)
    else if (part.kind === 'price') prices.push(part.text)
    else theses.push(part.text)
  }

  let title: string | undefined
  if (parts[0]?.kind === 'thesis' && lines.length > 1) {
    title = parts[0].text
    theses.shift()
  } else if (theses.length === lines.length && theses.length > 1) {
    title = theses.shift()
  }

  return {
    title,
    event_datetime: datetimes[0] || '',
    event_venue: venues[0] || '',
    event_price: prices[0] || '',
    theses,
    isStructured: false,
  }
}

/** Заголовок похож на строку метаданных (время, адрес, цена), а не на название события. */
export function isMetaLikeSlideTitle(title: string, sourceText?: string): boolean {
  const trimmed = title.trim()
  if (!trimmed) return false

  const labeled = parseLabeledLine(trimmed)
  if (labeled) return true

  const kind = parseEventDigestBullets([trimmed])[0]?.kind
  if (kind && kind !== 'thesis') return true

  if (sourceText) {
    const lines = sourceText
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean)
    if (lines.includes(trimmed) && kind !== 'thesis') return true
  }

  return false
}

/** Подставляет разбор исходного текста поверх ответа Groq (убирает сдвиг полей и галлюцинации). */
export function reconcileSlideWithSourceText(
  slide: CarouselSlide,
  sourceText: string,
  role: CarouselSlideRole,
): CarouselSlide {
  if (role !== 'body') return slide

  const parsed = parseSlideEventText(sourceText)
  if (!parsed.isStructured) return slide

  const merged: CarouselSlide = {
    ...slide,
    event_datetime: parsed.event_datetime || null,
    event_venue: parsed.event_venue || null,
    event_price: parsed.event_price || null,
    bullets: parsed.theses.length ? parsed.theses : undefined,
  }

  if (parsed.title) {
    merged.title = parsed.title
  } else if (isMetaLikeSlideTitle(String(slide.title || ''), sourceText)) {
    merged.title = undefined
  }

  return merged
}
