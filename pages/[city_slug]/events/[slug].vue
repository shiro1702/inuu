<template>
  <div v-if="pending" class="text-sm text-gray-500">Загрузка…</div>
  <div v-else-if="!event" class="text-sm text-gray-500">Событие не найдено.</div>
  <article v-else class="space-y-4">
    <NuxtLink :to="`${cityBasePath}/events`" class="text-sm text-primary hover:underline">← Афиша</NuxtLink>
    <h1 class="text-2xl font-bold text-gray-900">{{ event.title }}</h1>
    <p class="text-sm text-gray-500">{{ formattedDate }}</p>

    <section v-if="otherSessions.length" class="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
      <h2 class="text-sm font-semibold text-indigo-900">Другие даты</h2>
      <ul class="mt-2 space-y-2">
        <li v-for="session in otherSessions" :key="session.slug">
          <NuxtLink
            :to="`${cityBasePath}/events/${session.slug}`"
            class="text-sm text-primary hover:underline"
          >
            {{ formatSessionDate(session.starts_at) }}
          </NuxtLink>
        </li>
      </ul>
    </section>

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
const seriesSessions = ref<Array<{ slug: string; starts_at: string }>>([])

const formattedDate = computed(() => formatSessionDate(event.value?.starts_at))

const otherSessions = computed(() =>
  seriesSessions.value.filter((s) => s.slug !== eventSlug.value),
)

function formatSessionDate(value: string | undefined | null) {
  if (!value) return ''
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(new Date(value))
  } catch {
    return ''
  }
}

watch([citySlug, eventSlug], async () => {
  pending.value = true
  try {
    const res = await $fetch<{
      ok: boolean
      event?: Record<string, any>
      seriesSessions?: Array<{ slug: string; starts_at: string }>
    }>(
      `/api/cities/${citySlug.value}/events/${eventSlug.value}`,
    )
    event.value = res?.event ?? null
    seriesSessions.value = res?.seriesSessions ?? []
  } catch {
    event.value = null
    seriesSessions.value = []
  } finally {
    pending.value = false
  }
}, { immediate: true })
</script>
