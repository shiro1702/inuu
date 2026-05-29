import type { EventParseResult } from '~/server/utils/ai/eventParseSchema'

const DEFAULT_LOCAL_HOUR = 18
const MIN_LEAD_MS = 30 * 60 * 1000

/** Map local wall-clock in IANA timezone to UTC. */
function zonedLocalToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
): Date {
  let utcMs = Date.UTC(year, month - 1, day, hour, minute, 0)
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  for (let i = 0; i < 4; i++) {
    const parts = fmt.formatToParts(new Date(utcMs))
    const got: Record<string, string> = {}
    for (const p of parts) {
      if (p.type !== 'literal') got[p.type] = p.value
    }
    const gotH = Number(got.hour)
    const gotM = Number(got.minute)
    const diffMin = (hour * 60 + minute) - (gotH * 60 + gotM)
    if (diffMin === 0) break
    utcMs += diffMin * 60 * 1000
  }

  return new Date(utcMs)
}

function parseEventDate(raw: string, timeZone: string): Date | null {
  const s = raw.trim()
  if (!s) return null

  const dateOnly = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (dateOnly) {
    return zonedLocalToUtc(
      Number(dateOnly[1]),
      Number(dateOnly[2]),
      Number(dateOnly[3]),
      DEFAULT_LOCAL_HOUR,
      0,
      timeZone,
    )
  }

  const d = new Date(s)
  return Number.isNaN(d.getTime()) ? null : d
}

function uniqueSortedEventDates(dates: Date[]): Date[] {
  const byDay = new Map<string, Date>()
  for (const d of dates) {
    const key = d.toISOString().slice(0, 10)
    const prev = byDay.get(key)
    if (!prev || d.getTime() < prev.getTime()) byDay.set(key, d)
  }
  return [...byDay.values()].sort((a, b) => a.getTime() - b.getTime())
}

/** All upcoming starts_at values from parse payload (one per calendar day). */
export function listEventStartsAtFromPayload(
  payload: EventParseResult,
  timeZone = 'Asia/Irkutsk',
): string[] {
  const rawDates = Array.isArray(payload.recurrence?.dates) ? payload.recurrence.dates : []
  const parsed = uniqueSortedEventDates(
    rawDates
      .map((d) => parseEventDate(d, timeZone))
      .filter((d): d is Date => d !== null),
  )

  const minStart = Date.now() + MIN_LEAD_MS
  const future = parsed.filter((d) => d.getTime() >= minStart)
  if (future.length > 0) {
    return future.map((d) => d.toISOString())
  }

  return [resolveEventStartsAt(payload, timeZone)]
}

/** Pick a future starts_at for the city afisha (never in the past). */
export function resolveEventStartsAt(
  payload: EventParseResult,
  timeZone = 'Asia/Irkutsk',
): string {
  const dates = Array.isArray(payload.recurrence?.dates) ? payload.recurrence.dates : []
  const parsed = dates
    .map((d) => parseEventDate(d, timeZone))
    .filter((d): d is Date => d !== null)
    .sort((a, b) => a.getTime() - b.getTime())

  const now = Date.now()
  const minStart = now + MIN_LEAD_MS
  const future = parsed.find((d) => d.getTime() >= minStart)
  if (future) return future.toISOString()

  if (parsed.length) {
    const last = parsed[parsed.length - 1]
    const bumped = new Date(last.getTime() + 7 * 24 * 60 * 60 * 1000)
    if (bumped.getTime() < minStart) return new Date(minStart).toISOString()
    return bumped.toISOString()
  }

  return new Date(minStart).toISOString()
}
