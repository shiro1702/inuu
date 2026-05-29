import { slugifyTaxonomy } from '~/server/utils/cityContentTaxonomy'

export { countSeriesDates, dedupeEventsListForDisplay } from '~/utils/eventSeriesDisplay'

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

export function isMissingEventsExcerptColumnError(
  error: { code?: string; message?: string } | null,
): boolean {
  if (!error) return false
  if (error.code === 'PGRST204') return true
  const msg = String(error.message || '').toLowerCase()
  return msg.includes('excerpt')
}

export function isMissingEventsSeriesSlugColumnError(
  error: { code?: string; message?: string } | null,
): boolean {
  if (!error) return false
  if (error.code === 'PGRST204') return true
  const msg = String(error.message || '').toLowerCase()
  return msg.includes('series_slug')
}

