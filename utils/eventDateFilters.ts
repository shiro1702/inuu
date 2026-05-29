const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function parseIsoDateParam(value: string): string | null {
  const trimmed = value.trim().slice(0, 10)
  return ISO_DATE_RE.test(trimmed) ? trimmed : null
}

export function formatZonedIsoDate(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

export function addCalendarDays(isoDate: string, delta: number): string {
  const [y, m, d] = isoDate.split('-').map(Number)
  const next = new Date(Date.UTC(y, m - 1, d + delta))
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, '0')}-${String(next.getUTCDate()).padStart(2, '0')}`
}

export function getWeekRangeIsoDates(refDate: Date, timeZone: string): { from: string; to: string } {
  const today = formatZonedIsoDate(refDate, timeZone)
  const [y, m, d] = today.split('-').map(Number)
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay() || 7
  const monday = addCalendarDays(today, -(weekday - 1))
  const sunday = addCalendarDays(monday, 6)
  return { from: monday, to: sunday }
}

export function filterEventsByDateRange<T extends { starts_at: string }>(
  rows: T[],
  from: string | null,
  to: string | null,
  timeZone: string,
): T[] {
  if (!from && !to) return rows
  return rows.filter((row) => {
    const day = formatZonedIsoDate(new Date(row.starts_at), timeZone)
    if (from && day < from) return false
    if (to && day > to) return false
    return true
  })
}
