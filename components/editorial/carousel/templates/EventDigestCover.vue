<template>
  <div class="relative h-full w-full bg-black">
    <img
      v-if="slide.media_url"
      :src="slide.media_url"
      alt=""
      crossorigin="anonymous"
      class="absolute inset-0 h-full w-full object-cover"
    >
    <div
      v-else
      class="absolute inset-0"
      :class="theme.gradientClass"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15" />

    <div class="relative z-10 flex h-full flex-col justify-end px-10 pt-36 carousel-slide-pad-bottom">
      <div class="mb-6 flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#F97316] text-sm text-white shadow-md">📍</span>
          <span class="text-3xl font-bold tracking-tight text-white">{{ cityHandle }}</span>
        </div>
        <span
          v-if="dateBadge"
          class="rounded-full bg-[#8A63D2] px-5 py-2 text-xl font-semibold text-white"
        >
          {{ dateBadge }}
        </span>
      </div>

      <h1 class="space-y-1">
        <span
          v-for="(line, index) in titleLines"
          :key="index"
          class="block text-[3.25rem] font-black uppercase leading-[0.95] tracking-tight text-white"
        >
          {{ line }}
        </span>
      </h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import { eventDigestCityHandle, eventDigestTitleLines } from '~/utils/eventDigestSlide'
import { resolveSlideEventMeta } from '~/utils/carouselSlideEventMeta'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{
  slide: CarouselSlide
  topicTags?: string[]
  linkHint?: string | null
  cityName?: string | null
  citySlug?: string | null
}>()

const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
const titleLines = computed(() => eventDigestTitleLines(props.slide.title))
const dateBadge = computed(() => {
  const fromMeta = resolveSlideEventMeta(props.slide).datetime
  if (fromMeta) return fromMeta
  const cta = props.slide.cta_text?.trim() || ''
  return cta && !/[.!?…]$/.test(cta) ? cta : ''
})
const cityHandle = computed(() =>
  eventDigestCityHandle(props.linkHint, props.cityName, props.citySlug),
)
</script>
