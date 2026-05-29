import { slugifyTaxonomy } from '~/server/utils/cityContentTaxonomy'

export function buildEventSeriesSlug(title: string, venueName?: string | null): string {
  const titlePart = slugifyTaxonomy(title)
  const venuePart = venueName ? slugifyTaxonomy(venueName) : ''
  const combined = venuePart ? `${titlePart}-${venuePart}` : titlePart
  return combined.slice(0, 72) || `series-${Date.now()}`
}

export function buildEventSessionSlug(seriesSlug: string, startsAtIso: string): string {
  const d = new Date(startsAtIso)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${seriesSlug}-${y}${m}${day}`.slice(0, 100)
}

export function isMissingEventsSeriesSlugColumnError(
  error: { code?: string; message?: string } | null,
): boolean {
  if (!error) return false
  if (error.code === 'PGRST204') return true
  const msg = String(error.message || '').toLowerCase()
  return msg.includes('series_slug')
}

type EventListRow = {
  id: string
  series_slug?: string | null
}

export function dedupeEventsListForDisplay<T extends EventListRow>(rows: T[]): T[] {
  const seen = new Set<string>()
  const out: T[] = []
  for (const row of rows) {
    const key = row.series_slug ? String(row.series_slug) : String(row.id)
    if (seen.has(key)) continue
    seen.add(key)
    out.push(row)
  }
  return out
}

export function countSeriesDates<T extends { series_slug?: string | null }>(rows: T[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const row of rows) {
    if (!row.series_slug) continue
    const key = String(row.series_slug)
    counts.set(key, (counts.get(key) || 0) + 1)
  }
  return counts
}
