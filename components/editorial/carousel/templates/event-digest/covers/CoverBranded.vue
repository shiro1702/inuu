<template>
  <div class="relative h-full w-full bg-black">
    <EventDigestBg
      :media-url="slide.media_url"
      :gradient-class="theme.gradientClass"
      show-image
      overlay="bg-gradient-to-t from-black via-black/55 to-black/15"
    />

    <div class="relative z-10 flex h-full flex-col justify-end px-10 pt-36 carousel-slide-pad-bottom">
      <div class="mb-6 flex flex-wrap items-center gap-3">
        <div class="flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-[#F97316] text-sm text-white shadow-md">📍</span>
          <span class="text-3xl font-bold tracking-tight text-white">{{ cityHandle }}</span>
        </div>
        <span
          v-if="weekBadge"
          class="rounded-full bg-[#8A63D2] px-5 py-2 text-xl font-semibold text-white"
        >
          {{ weekBadge }}
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
import EventDigestBg from '~/components/editorial/carousel/templates/event-digest/EventDigestBg.vue'
import { eventDigestCityHandle, eventDigestTitleLines } from '~/utils/eventDigestSlide'
import { formatDigestWeekRange } from '~/utils/eventDigestWeek'
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
const weekBadge = computed(() => formatDigestWeekRange())
const cityHandle = computed(() =>
  eventDigestCityHandle(props.linkHint, props.cityName, props.citySlug),
)
</script>
