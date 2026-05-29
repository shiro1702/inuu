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
