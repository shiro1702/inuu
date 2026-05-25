import { computed, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'

export type CityDto = {
  id: string
  name: string
  slug: string
  timezone: string
  editorialName: string | null
}

const cityCache = new Map<string, CityDto>()

export function useCity(citySlugRef?: Ref<string | undefined>) {
  const route = useRoute()
  const config = useRuntimeConfig()
  const loading = ref(false)
  const error = ref<string | null>(null)
  const city = ref<CityDto | null>(null)

  const slug = computed(() => {
    const fromRef = citySlugRef?.value
    if (typeof fromRef === 'string' && fromRef.trim()) return fromRef.trim()
    const param = route.params.city_slug
    if (typeof param === 'string' && param.trim()) return param.trim()
    if (Array.isArray(param) && typeof param[0] === 'string') return param[0].trim()
    const fallback = config.public.defaultCitySlug
    return typeof fallback === 'string' && fallback.trim() ? fallback.trim() : 'ulan-ude'
  })

  const cityBasePath = computed(() => `/${slug.value}`)
  const displayName = computed(() => city.value?.editorialName || city.value?.name || 'INUU')

  async function load() {
    const key = slug.value
    const cached = cityCache.get(key)
    if (cached) {
      city.value = cached
      error.value = null
      return cached
    }

    loading.value = true
    error.value = null
    try {
      const res = await $fetch<{
        ok: boolean
        city: {
          id: string
          name: string
          slug: string
          timezone?: string
          editorialName?: string | null
        } | null
      }>('/api/cities', { query: { slug: key } })

      if (!res?.ok || !res.city) {
        city.value = null
        error.value = 'Город не найден'
        return null
      }

      const dto: CityDto = {
        id: res.city.id,
        name: res.city.name,
        slug: res.city.slug,
        timezone: res.city.timezone || 'Asia/Irkutsk',
        editorialName: res.city.editorialName ?? null,
      }
      city.value = dto
      cityCache.set(key, dto)
      return dto
    } catch (e: unknown) {
      city.value = null
      error.value = e instanceof Error ? e.message : 'Failed to load city'
      return null
    } finally {
      loading.value = false
    }
  }

  watch(slug, () => {
    void load()
  }, { immediate: true })

  return {
    slug,
    city,
    cityId: computed(() => city.value?.id ?? null),
    cityBasePath,
    displayName,
    loading,
    error,
    load,
  }
}
