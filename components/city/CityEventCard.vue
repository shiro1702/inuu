<template>
  <NuxtLink
    :to="`${cityBasePath}/events/${event.slug}`"
    class="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md"
  >
    <div
      v-if="event.cover_media_url"
      class="aspect-[16/9] bg-cover bg-center"
      :style="{ backgroundImage: `url(${event.cover_media_url})` }"
    />
    <div v-else class="aspect-[16/9] bg-gradient-to-br from-indigo-100 to-violet-50" />
    <div class="p-4">
      <p class="text-xs font-medium uppercase tracking-wide text-indigo-600">
        {{ formattedDate }}
        <span v-if="seriesDateCount > 1" class="normal-case text-indigo-500">
          · ещё {{ seriesDateCount - 1 }} {{ datesLabel }}
        </span>
      </p>
      <h3 class="mt-1 text-lg font-semibold text-gray-900 group-hover:text-primary">
        {{ event.title }}
      </h3>
      <p v-if="event.description" class="mt-2 line-clamp-2 text-sm text-gray-600">
        {{ event.description }}
      </p>
      <p v-if="event.price > 0" class="mt-3 text-sm font-medium text-gray-900">
        от {{ event.price }} ₽
      </p>
      <p v-else class="mt-3 text-sm font-medium text-emerald-700">Бесплатно</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  event: {
    slug: string
    title: string
    description?: string | null
    starts_at: string
    price?: number
    cover_media_url?: string | null
    series_date_count?: number
  }
}>()

const { cityBasePath } = useCity()

const seriesDateCount = computed(() => Math.max(1, Number(props.event.series_date_count) || 1))

const datesLabel = computed(() => {
  const n = seriesDateCount.value - 1
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'дата'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'даты'
  return 'дат'
})

const formattedDate = computed(() => {
  try {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(props.event.starts_at))
  } catch {
    return ''
  }
})
</script>
