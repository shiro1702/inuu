export type IngestSourcesPayload = {
  contextTypes: string[]
  webSources: unknown[]
  telegramSources: unknown[]
  ingestSettings: {
    prefilter_enabled?: boolean
    reject_past_events_enabled?: boolean
  }
  alerts: unknown[]
}

const inflight = new Map<string, Promise<IngestSourcesPayload | null>>()

function normalizePayload(raw: Record<string, unknown>): IngestSourcesPayload {
  return {
    contextTypes: Array.isArray(raw.contextTypes) ? raw.contextTypes as string[] : [],
    webSources: Array.isArray(raw.webSources) ? raw.webSources : [],
    telegramSources: Array.isArray(raw.telegramSources) ? raw.telegramSources : [],
    ingestSettings: (raw.ingestSettings && typeof raw.ingestSettings === 'object')
      ? raw.ingestSettings as IngestSourcesPayload['ingestSettings']
      : {},
    alerts: Array.isArray(raw.alerts) ? raw.alerts : [],
  }
}

export function useContentAiIngestSources() {
  const { dashboardFetch } = useDashboardFetch()
  const cache = useState<Record<string, IngestSourcesPayload>>('dashboard-content-ai-ingest-sources-cache', () => ({}))

  function getCached(citySlug: string): IngestSourcesPayload | null {
    return cache.value[citySlug] ?? null
  }

  function setCached(citySlug: string, payload: IngestSourcesPayload) {
    cache.value = { ...cache.value, [citySlug]: payload }
  }

  function invalidate(citySlug: string) {
    const next = { ...cache.value }
    delete next[citySlug]
    cache.value = next
    inflight.delete(citySlug)
  }

  async function fetchIngestSources(
    citySlug: string,
    options?: { force?: boolean },
  ): Promise<IngestSourcesPayload | null> {
    if (!citySlug) return null

    if (!options?.force) {
      const cached = getCached(citySlug)
      if (cached) return cached
      const pending = inflight.get(citySlug)
      if (pending) return pending
    }

    const promise = (async () => {
      const res = await dashboardFetch(
        `/api/dashboard/manager/cities/${citySlug}/ingest-sources?shops=0`,
      )
      const raw = await res.json() as Record<string, unknown>
      if (!raw.ok) {
        throw new Error(String(raw.message || raw.statusMessage || 'Не удалось загрузить источники'))
      }
      const payload = normalizePayload(raw)
      setCached(citySlug, payload)
      return payload
    })()

    inflight.set(citySlug, promise)
    try {
      return await promise
    } finally {
      if (inflight.get(citySlug) === promise) {
        inflight.delete(citySlug)
      }
    }
  }

  function prefetchIngestSources(citySlug: string) {
    if (!import.meta.client || !citySlug) return
    if (getCached(citySlug) || inflight.has(citySlug)) return
    void fetchIngestSources(citySlug).catch(() => {})
  }

  return {
    getCached,
    fetchIngestSources,
    prefetchIngestSources,
    invalidate,
  }
}
