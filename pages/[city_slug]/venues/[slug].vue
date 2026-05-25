<template>
  <div v-if="pending" class="text-sm text-gray-500">Загрузка…</div>
  <div v-else-if="!venue" class="text-sm text-gray-500">Место не найдено.</div>
  <article v-else class="space-y-4">
    <NuxtLink :to="`${cityBasePath}/venues`" class="text-sm text-primary hover:underline">← Места</NuxtLink>
    <h1 class="text-2xl font-bold text-gray-900">{{ venue.title }}</h1>
    <p v-if="venue.address" class="text-sm text-gray-600">{{ venue.address }}</p>
    <p v-if="venue.description" class="text-gray-700">{{ venue.description }}</p>
    <p v-if="venue.editorial_quote" class="italic text-gray-600">«{{ venue.editorial_quote }}»</p>
    <a
      v-if="venue.phone"
      :href="`tel:${venue.phone}`"
      class="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary"
    >
      Позвонить
    </a>
    <section v-if="upcomingEvents.length" class="pt-4">
      <h2 class="text-lg font-semibold text-gray-900">События здесь</h2>
      <ul class="mt-2 space-y-2">
        <li v-for="ev in upcomingEvents" :key="ev.id">
          <NuxtLink :to="`${cityBasePath}/events/${ev.slug}`" class="text-primary hover:underline">
            {{ ev.title }}
          </NuxtLink>
        </li>
      </ul>
    </section>
  </article>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'city' })

const route = useRoute()
const { slug: citySlug, cityBasePath } = useCity()
const venueSlug = computed(() => String(route.params.slug || ''))

const pending = ref(true)
const venue = ref<Record<string, any> | null>(null)
const upcomingEvents = ref<Array<Record<string, any>>>([])

watch([citySlug, venueSlug], async () => {
  pending.value = true
  try {
    const res = await $fetch<{
      ok: boolean
      venue?: Record<string, any>
      upcomingEvents?: Array<Record<string, any>>
    }>(`/api/cities/${citySlug.value}/venues/${venueSlug.value}`)
    venue.value = res?.venue ?? null
    upcomingEvents.value = res?.upcomingEvents ?? []
  } catch {
    venue.value = null
    upcomingEvents.value = []
  } finally {
    pending.value = false
  }
}, { immediate: true })
</script>
