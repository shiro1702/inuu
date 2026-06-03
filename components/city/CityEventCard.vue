<template>
  <article
    class="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md"
  >
    <NuxtLink
      :to="`${cityBasePath}/events/${event.slug}`"
      class="block"
    >
      <div class="relative w-full overflow-hidden" :style="posterFrameStyle">
        <img
          v-if="event.cover_media_url"
          :src="event.cover_media_url"
          :alt="event.title"
          class="absolute inset-0 h-full w-full object-cover object-center"
          loading="lazy"
        />
        <div v-else class="absolute inset-0 bg-gradient-to-br from-indigo-100 to-violet-50" />
      </div>
      <div class="p-4">
        <p class="text-xs font-medium uppercase tracking-wide text-indigo-600">
          <span v-if="event.vibe_emoji" class="mr-1 normal-case">{{ event.vibe_emoji }}</span>
          {{ formattedDate }}
          <span v-if="seriesDateCount > 1" class="normal-case text-indigo-500">
            · ещё {{ seriesDateCount - 1 }} {{ datesLabel }}
          </span>
        </p>
        <h3 class="mt-1 text-lg font-semibold text-gray-900 group-hover:text-primary">
          {{ event.title }}
        </h3>
        <p v-if="cardDescription" class="mt-2 line-clamp-2 text-sm text-gray-600">
          {{ cardDescription }}
        </p>
        <p v-if="event.price > 0" class="mt-3 text-sm font-medium text-gray-900">
          от {{ event.price }} ₽
        </p>
        <p v-else class="mt-3 text-sm font-medium text-emerald-700">Бесплатно</p>
      </div>
    </NuxtLink>

    <div v-if="cta?.url" class="border-t border-gray-100 px-4 pb-4 pt-0">
      <a
        :href="cta.url"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-3 flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition"
        :class="ctaButtonClass"
        @click.stop
      >
        {{ cta.emoji }} {{ cta.label }}
      </a>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { EventCta, EventSaleMode } from '~/types/storefront'

const posterFrameStyle = { aspectRatio: '768 / 480' } as const

const props = defineProps<{
  event: {
    slug: string
    title: string
    description?: string | null
    excerpt?: string | null
    tldr?: string | null
    vibe_emoji?: string | null
    starts_at: string
    price?: number
    cover_media_url?: string | null
    series_date_count?: number
  }
  saleMode?: EventSaleMode
  cta?: EventCta | null
}>()

const { cityBasePath } = useCity()

const cardDescription = computed(() =>
  String(props.event.tldr || props.event.excerpt || props.event.description || '').trim(),
)

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

const cta = computed(() => props.cta ?? null)

const ctaButtonClass = computed(() => {
  if (props.saleMode === 'parsed') {
    return 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
  }
  return 'bg-primary text-white hover:opacity-90'
})
</script>
