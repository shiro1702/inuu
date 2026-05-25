<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900">Карта</h1>
    <p class="mt-2 text-sm text-gray-600">Места и события с координатами в {{ displayName }}</p>
    <p v-if="pending" class="mt-6 text-sm text-gray-500">Загрузка точек…</p>
    <ul v-else class="mt-6 space-y-3">
      <li
        v-for="point in mapPoints"
        :key="point.id"
        class="rounded-xl border border-gray-200 bg-white p-4"
      >
        <NuxtLink :to="point.href" class="font-medium text-primary hover:underline">
          {{ point.title }}
        </NuxtLink>
        <p v-if="point.subtitle" class="text-sm text-gray-500">{{ point.subtitle }}</p>
        <p v-if="point.lat != null" class="mt-1 text-xs text-gray-400">
          {{ point.lat.toFixed(4) }}, {{ point.lon.toFixed(4) }}
        </p>
      </li>
    </ul>
    <p v-if="!pending && !mapPoints.length" class="mt-6 text-sm text-gray-500">
      Нет точек с адресом на карте.
    </p>
  </div>
</template>

<script setup lang="ts">
import { geocodeMarkers, type MapPointInput } from '~/composables/useGeocodedMarkers'

definePageMeta({ layout: 'city' })

const { slug, cityBasePath, displayName, city } = useCity()
const pending = ref(true)
const mapPoints = ref<Array<{ id: string; title: string; subtitle?: string; lat: number; lon: number; href: string }>>([])

watch(slug, async () => {
  pending.value = true
  try {
    const [venuesRes, eventsRes] = await Promise.all([
      $fetch<{ ok: boolean; items?: Array<Record<string, any>> }>(`/api/cities/${slug.value}/venues`),
      $fetch<{ ok: boolean; items?: Array<Record<string, any>> }>(`/api/cities/${slug.value}/events`),
    ])
    const inputs: MapPointInput[] = []
    for (const v of venuesRes?.items ?? []) {
      inputs.push({
        id: `venue-${v.id}`,
        title: v.title,
        subtitle: v.address || 'Место',
        address: v.address || v.title,
        lat: v.lat,
        lon: v.lng,
      })
    }
    const { resolved } = await geocodeMarkers(inputs, city.value?.name || displayName.value)
    mapPoints.value = resolved.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      lat: p.lat,
      lon: p.lon,
      href: p.id.startsWith('venue-')
        ? `${cityBasePath.value}/venues/${(venuesRes?.items ?? []).find((v) => `venue-${v.id}` === p.id)?.slug || ''}`
        : cityBasePath.value,
    })).filter((p) => p.href && !p.href.endsWith('/venues/'))
  } finally {
    pending.value = false
  }
}, { immediate: true })

useHead({ title: () => `Карта — ${displayName.value}` })
</script>
