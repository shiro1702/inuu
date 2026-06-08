import { computed, watch } from 'vue'

export type ContentAiManagerCity = {
  citySlug: string
  cityName: string
}

export function useContentAiCity() {
  const { dashboardFetch } = useDashboardFetch()

  const managerCities = useState<ContentAiManagerCity[]>('dashboard-content-ai-cities', () => [])
  const citiesLoaded = useState('dashboard-content-ai-cities-loaded', () => false)
  const citiesPending = useState('dashboard-content-ai-cities-pending', () => false)
  const selectedCitySlug = useState('dashboard-content-ai-city-slug', () => '')

  if (import.meta.client && !citiesLoaded.value) {
    void callOnce('dashboard-content-ai-cities-fetch', async () => {
      citiesPending.value = true
      try {
        const res = await dashboardFetch('/api/dashboard/manager/cities')
        const payload = await res.json() as { ok: boolean; items: ContentAiManagerCity[] }
        managerCities.value = payload.ok ? payload.items : []
        citiesLoaded.value = true
      } finally {
        citiesPending.value = false
      }
    })
  }

  const loadingCities = computed(() => citiesPending.value && !citiesLoaded.value)

  const selectedCityName = computed(
    () => managerCities.value.find((c) => c.citySlug === selectedCitySlug.value)?.cityName || 'INUU',
  )

  const route = useRoute()

  function applyCityFromQuery() {
    const raw = route.query.city
    const fromQuery = typeof raw === 'string' ? raw.trim() : ''
    if (!fromQuery) return
    if (!managerCities.value.length || managerCities.value.some((c) => c.citySlug === fromQuery)) {
      selectedCitySlug.value = fromQuery
    }
  }

  watch(managerCities, (cities) => {
    applyCityFromQuery()
    if (!selectedCitySlug.value && cities.length) {
      selectedCitySlug.value = cities[0].citySlug
    }
  }, { immediate: true })

  watch(() => route.query.city, () => {
    applyCityFromQuery()
  })

  const { prefetchIngestSources } = useContentAiIngestSources()

  watch([citiesLoaded, selectedCitySlug], ([loaded, slug]) => {
    if (loaded && slug) prefetchIngestSources(slug)
  }, { immediate: true })

  return {
    managerCities,
    selectedCitySlug,
    selectedCityName,
    loadingCities,
  }
}
