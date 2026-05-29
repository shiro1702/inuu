import { countSeriesDates, dedupeEventsListForDisplay } from '~/utils/eventSeriesDisplay'

export type EventListRow = {
  id: string
  series_slug?: string | null
  is_promoted?: boolean | null
  starts_at: string
  source_metadata?: unknown
}

function parseTopicTags(raw: unknown): string[] {
  if (!raw || typeof raw !== 'object') return []
  const tags = (raw as Record<string, unknown>).topic_tags
  if (!Array.isArray(tags)) return []
  return tags.map((x) => String(x || '').trim()).filter(Boolean)
}

export function parseTagSlugsFromQuery(value: unknown): string[] {
  if (!value) return []
  const list = Array.isArray(value) ? value : [value]
  return [...new Set(list.map((x) => String(x || '').trim()).filter(Boolean))]
}

export function filterEventsByTags<T extends EventListRow>(rows: T[], tagSlugs: string[]): T[] {
  if (!tagSlugs.length) return rows
  const wanted = new Set(tagSlugs)
  return rows.filter((row) => {
    const eventTags = parseTopicTags(row.source_metadata)
    return eventTags.some((tag) => wanted.has(tag))
  })
}

/** @deprecated use filterEventsByTags */
export function filterEventsByTag<T extends EventListRow>(rows: T[], tagSlug: string): T[] {
  return filterEventsByTags(rows, tagSlug ? [tagSlug] : [])
}

export function sortEventsByImportance<T extends EventListRow>(rows: T[]): T[] {
  return [...rows].sort((a, b) => {
    const promoA = a.is_promoted ? 1 : 0
    const promoB = b.is_promoted ? 1 : 0
    if (promoB !== promoA) return promoB - promoA
    return new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
  })
}

export function sortEventsByDate<T extends EventListRow>(rows: T[]): T[] {
  return [...rows].sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
}

export function prepareEventsListForDisplay<T extends EventListRow>(
  rows: T[],
  limit: number,
  options?: { sortByImportance?: boolean },
): Array<T & { series_date_count: number }> {
  const sorted = options?.sortByImportance ? sortEventsByImportance(rows) : sortEventsByDate(rows)
  const seriesCounts = countSeriesDates(sorted)
  const deduped = dedupeEventsListForDisplay(sorted).slice(0, limit)
  return deduped.map((row) => ({
    ...row,
    series_date_count: row.series_slug ? seriesCounts.get(String(row.series_slug)) || 1 : 1,
  }))
}
