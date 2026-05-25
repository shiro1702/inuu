<template>
  <div v-if="pending" class="text-sm text-gray-500">Загрузка…</div>
  <div v-else-if="!event" class="text-sm text-gray-500">Событие не найдено.</div>
  <article v-else class="space-y-4">
    <NuxtLink :to="`${cityBasePath}/events`" class="text-sm text-primary hover:underline">← Афиша</NuxtLink>
    <h1 class="text-2xl font-bold text-gray-900">{{ event.title }}</h1>
    <p class="text-sm text-gray-500">{{ formattedDate }}</p>
    <p v-if="event.description" class="text-gray-700">{{ event.description }}</p>
    <p v-if="event.price > 0" class="font-medium">Билет: {{ event.price }} ₽</p>
    <p v-else class="font-medium text-emerald-700">Вход бесплатный</p>
    <p class="text-sm text-gray-500">Онлайн-запись и билеты — в следующем обновлении INUU.</p>
  </article>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'city' })

const route = useRoute()
const { slug: citySlug, cityBasePath } = useCity()
const eventSlug = computed(() => String(route.params.slug || ''))

const pending = ref(true)
const event = ref<Record<string, any> | null>(null)

const formattedDate = computed(() => {
  if (!event.value?.starts_at) return ''
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(event.value.starts_at))
  } catch {
    return ''
  }
})

watch([citySlug, eventSlug], async () => {
  pending.value = true
  try {
    const res = await $fetch<{ ok: boolean; event?: Record<string, any> }>(
      `/api/cities/${citySlug.value}/events/${eventSlug.value}`,
    )
    event.value = res?.event ?? null
  } catch {
    event.value = null
  } finally {
    pending.value = false
  }
}, { immediate: true })
</script>
