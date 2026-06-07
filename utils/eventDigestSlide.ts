const PRICE_RE = /₽|\bруб\.?\b/i
const MONTH_RE =
  /\b(?:январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр)/i
const DATE_RE =
  /\b\d{1,2}[.\-/]\d{1,2}(?:[.\-/]\d{2,4})?\b|\b\d{1,2}\s+(?:январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр)/i
const TIME_RE = /\b\d{1,2}:\d{2}\b|\b(?:с|до)\s+\d{1,2}(?::\d{2})?\b/i
const ADDRESS_RE =
  /\b(?:ул\.?|улица|пр\.?|проспект|пер\.?|переулок|бул\.?|бульвар|наб\.?|набережная|шоссе|пл\.?|площадь|д\.?|дом|строение|корп\.?|оф\.?|офис)\b/i

function isPriceLine(line: string): boolean {
  const t = line.trim()
  return PRICE_RE.test(t) || /^бесплатно$/i.test(t)
}

/** Дата, время или адрес — фиолетовый бейдж; остальное — тезисы. */
export function isEventDigestMetaLine(line: string, index = 0, total = 1): boolean {
  const t = line.trim()
  if (!t || isPriceLine(t)) return false
  if (MONTH_RE.test(t) || DATE_RE.test(t) || TIME_RE.test(t) || ADDRESS_RE.test(t)) return true
  if (index === 0 && /\d/.test(t)) return true
  if (index === 1 && total >= 3) {
    if (t.length > 80 || /[.!?…]$/.test(t)) return false
    return true
  }
  return false
}

export function eventDigestMetaBadges(bullets?: string[]): string[] {
  const lines = (bullets || []).map((x) => x.trim()).filter(Boolean)
  return lines.filter((line, index) => isEventDigestMetaLine(line, index, lines.length))
}

export function eventDigestTheses(bullets?: string[]): string[] {
  const lines = (bullets || []).map((x) => x.trim()).filter(Boolean)
  return lines.filter(
    (line, index) => !isEventDigestMetaLine(line, index, lines.length) && !isPriceLine(line),
  )
}

export function eventDigestCityHandle(linkHint?: string | null, cityName?: string | null): string {
  const hint = String(linkHint || '').trim()
  const slugMatch = hint.match(/\/([a-z0-9-]+)(?:\/|$)/i)
  if (slugMatch?.[1]) {
    return `in.${slugMatch[1].replace(/-/g, '')}`
  }
  const city = String(cityName || '').trim()
  if (city) {
    const latin = city
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9а-яё]/gi, '')
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
  return eventDigestMetaBadges(bullets)[0] || ''
}

export function eventDigestDescription(bullets?: string[]): string {
  return eventDigestTheses(bullets).join(' ')
}

export function eventDigestVenueLine(bullets?: string[]): string {
  const lines = (bullets || []).map((x) => x.trim()).filter(Boolean)
  const venue = lines[1]
  if (venue && isEventDigestMetaLine(venue, 1, lines.length) && !isPriceLine(venue)) {
    return venue
  }
  return ''
}

export function eventDigestCtaLabel(bullets?: string[], linkHint?: string | null): string {
  const venue = eventDigestVenueLine(bullets)
  if (venue) return `Подробнее у ${venue}`
  if (linkHint?.trim()) return 'Подробнее на сайте'
  return 'Подробнее'
}
