export type PrefilterResult = {
  pass: boolean
  reason?: string
  signals: string[]
}

const DATE_PATTERNS = [
  /\d{1,2}[./]\d{1,2}(?:[./]\d{2,4})?/,
  /\d{1,2}\s+(?:январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр)/i,
  /\d{4}-\d{2}-\d{2}/,
]

const PRICE_PATTERNS = [
  /₽/,
  /\bруб(?:\.|лей|ля)?\b/i,
  /\bбесплатн/i,
  /\bот\s+\d{2,5}\b/i,
  /\b\d{2,5}\s*₽/,
]

const EVENT_KEYWORDS = [
  'афиша',
  'билет',
  'билеты',
  'концерт',
  'спектакль',
  'фестиваль',
  'выставк',
  'мастер-класс',
  'мастеркласс',
  'лекци',
  'отмена',
  'перенос',
  'sold out',
  'sold-out',
  'распродан',
  'вход',
  'регистрац',
  'событие',
  'мероприят',
  'stand-up',
  'стендап',
  'open mic',
  'open-mic',
  'line-up',
  'lineup',
  'кино',
  'фильм',
  'сеанс',
]

const JUNK_PATTERNS = [
  /^поздравля/i,
  /^с дн[её]м/i,
  /^скидк/i,
  /^акци[яи]/i,
  /^реклам/i,
  /^подпис/i,
  /^розыгрыш/i,
]

function matchAny(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    if (pattern.test(text)) return pattern.source
  }
  return null
}

function matchKeyword(text: string): string | null {
  const lower = text.toLowerCase()
  for (const kw of EVENT_KEYWORDS) {
    if (lower.includes(kw)) return kw
  }
  return null
}

export function evaluateContentPrefilter(rawText: string): PrefilterResult {
  const text = rawText.trim()
  const signals: string[] = []

  if (text.length < 8) {
    return { pass: false, reason: 'too_short', signals: ['too_short'] }
  }

  const dateHit = matchAny(text, DATE_PATTERNS)
  if (dateHit) signals.push(`date:${dateHit}`)

  const priceHit = matchAny(text, PRICE_PATTERNS)
  if (priceHit) signals.push(`price:${priceHit}`)

  const keywordHit = matchKeyword(text)
  if (keywordHit) signals.push(`keyword:${keywordHit}`)

  const junkHit = matchAny(text, JUNK_PATTERNS)
  if (junkHit && !dateHit && !keywordHit) {
    return { pass: false, reason: 'junk_pattern', signals: [...signals, `junk:${junkHit}`] }
  }

  if (dateHit || priceHit || keywordHit) {
    return { pass: true, signals }
  }

  return { pass: false, reason: 'no_event_signals', signals }
}
