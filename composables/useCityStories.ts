import { ref, watch, type Ref } from 'vue'
import { $fetch } from 'ofetch'
import type { StoryCampaignDto } from '~/types/stories'
import { getStoriesFromCache, setStoriesCache } from '~/utils/storiesCache'

const FETCH_TIMEOUT_MS = 12_000

function cacheKey(citySlug: string): string {
  return `city:${citySlug}`
}

export type CityStoriesApiResponse = {
  ok: boolean
  cityId: string
  topBar: StoryCampaignDto[]
  campaigns: StoryCampaignDto[]
}

export function useCityStories(citySlugRef: Ref<string | null | undefined>) {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const topBar = ref<StoryCampaignDto[]>([])

  let loadGeneration = 0

  async function load() {
    const slug = citySlugRef.value?.trim()
    if (!slug) {
      topBar.value = []
      loading.value = false
      error.value = null
      return
    }

    const key = cacheKey(slug)
    const cached = getStoriesFromCache(key)
    if (cached) {
      topBar.value = cached.topBar
      loading.value = false
      error.value = null
      return
    }

    const myGen = ++loadGeneration
    topBar.value = []
    loading.value = true
    error.value = null
    try {
      const res = await $fetch<CityStoriesApiResponse>(`/api/cities/${slug}/stories`, {
        timeout: FETCH_TIMEOUT_MS,
      })
      if (myGen !== loadGeneration) return

      if (res?.ok) {
        const tb = res.topBar ?? []
        topBar.value = tb
        setStoriesCache(key, tb, [])
      } else {
        topBar.value = []
      }
    } catch (e: unknown) {
      if (myGen !== loadGeneration) return
      error.value = e instanceof Error ? e.message : 'Failed to load stories'
      topBar.value = []
    } finally {
      if (myGen === loadGeneration) {
        loading.value = false
      }
    }
  }

  watch(citySlugRef, () => {
    void load()
  }, { immediate: true })

  return {
    loading,
    error,
    topBar,
    load,
  }
}
