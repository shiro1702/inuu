<template>
  <div v-if="pending" class="text-sm text-gray-500">Загрузка…</div>
  <div v-else-if="!organization" class="text-sm text-gray-500">Организатор не найден.</div>
  <article v-else class="space-y-8">
    <NuxtLink :to="`${cityBasePath}/events`" class="text-sm text-primary hover:underline">← Афиша</NuxtLink>

    <header class="space-y-3">
      <div v-if="organization.logoUrl" class="h-16 w-16 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <img :src="organization.logoUrl" :alt="organization.name" class="h-full w-full object-cover">
      </div>
      <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">{{ organization.name }}</h1>
      <p
        v-if="!organization.isClaimed"
        class="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900 ring-1 ring-amber-200"
      >
        Профиль создан из афиши
      </p>
      <p v-if="organization.description" class="max-w-2xl text-sm text-gray-600">
        {{ organization.description }}
      </p>
      <p v-else-if="organization.sourceHint" class="text-sm text-gray-500">
        Источник: {{ organization.sourceHint }}
      </p>
    </header>

    <section>
      <h2 class="text-lg font-semibold text-gray-900">Афиша</h2>
      <div v-if="upcomingEvents.length" class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <CityEventCard
          v-for="event in upcomingEvents"
          :key="event.id"
          :event="event"
          :sale-mode="event.saleMode"
          :cta="event.cta"
        />
      </div>
      <p v-else class="mt-4 text-sm text-gray-500">Скоро появятся события.</p>
    </section>

    <section class="rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
      <p class="font-medium text-gray-900">Вы владелец?</p>
      <p class="mt-1">Подключите организацию к INUU и управляйте афишей в личном кабинете.</p>
      <NuxtLink to="/partners" class="mt-3 inline-flex text-sm font-medium text-primary hover:underline">
        Узнать о партнёрстве →
      </NuxtLink>
    </section>
  </article>
</template>

<script setup lang="ts">
import type { EventCta, EventSaleMode } from '~/types/storefront'

definePageMeta({ layout: 'city' })

type OrganizationProfile = {
  id: string
  slug: string
  name: string
  description: string | null
  logoUrl: string | null
  isClaimed: boolean
  sourceHint: string | null
}

type UpcomingEvent = {
  id: string
  slug: string
  title: string
  starts_at: string
  price?: number
  description?: string | null
  excerpt?: string | null
  cover_media_url?: string | null
  series_date_count?: number
  saleMode?: EventSaleMode
  cta?: EventCta
}

const route = useRoute()
const { slug: citySlug, cityBasePath } = useCity()
const orgSlug = computed(() => String(route.params.slug || ''))

const pending = ref(true)
const organization = ref<OrganizationProfile | null>(null)
const upcomingEvents = ref<UpcomingEvent[]>([])

watch([citySlug, orgSlug], async () => {
  pending.value = true
  try {
    const res = await $fetch<{
      ok: boolean
      organization?: OrganizationProfile
      upcomingEvents?: UpcomingEvent[]
    }>(`/api/cities/${citySlug.value}/organizations/${orgSlug.value}`)

    organization.value = res?.organization ?? null
    upcomingEvents.value = res?.upcomingEvents ?? []
  } catch {
    organization.value = null
    upcomingEvents.value = []
  } finally {
    pending.value = false
  }
}, { immediate: true })

useHead({
  title: () => (organization.value?.name ? String(organization.value.name) : 'Организатор'),
})
</script>
