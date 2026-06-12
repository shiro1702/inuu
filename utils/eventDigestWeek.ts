const MONTHS_GENITIVE = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

function formatDayMonth(day: number, month: number): string {
  return `${day} ${MONTHS_GENITIVE[month - 1] || ''}`.trim()
}

function getZonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value || 0)
  return { year: get('year'), month: get('month'), day: get('day') }
}

function addDays(year: number, month: number, day: number, delta: number) {
  const d = new Date(Date.UTC(year, month - 1, day + delta))
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() }
}

/** Диапазон текущей недели: «3–9 июня» или «28 апреля – 4 мая». */
export function formatDigestWeekRange(refDate = new Date(), timeZone = 'Asia/Irkutsk'): string {
  const { year, month, day } = getZonedParts(refDate, timeZone)
  const d = new Date(Date.UTC(year, month - 1, day))
  const dayNum = d.getUTCDay() || 7
  const monday = addDays(year, month, day, -(dayNum - 1))
  const sunday = addDays(monday.year, monday.month, monday.day, 6)

  const start = formatDayMonth(monday.day, monday.month)
  const end = formatDayMonth(sunday.day, sunday.month)

  if (monday.month === sunday.month) {
    return `${monday.day}–${sunday.day} ${MONTHS_GENITIVE[monday.month - 1] || ''}`.trim()
  }
  return `${start} – ${end}`.trim()
}
