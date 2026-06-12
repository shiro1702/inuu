<template>
  <div class="relative h-full w-full bg-black">
    <EventDigestBg
      :media-url="slide.media_url"
      :gradient-class="theme.gradientClass"
      show-image
      overlay="bg-gradient-to-t from-black via-black/25 to-transparent"
    />

    <div class="relative z-10 flex h-full flex-col justify-between px-10 pt-24 carousel-slide-pad-bottom">
      <div class="flex items-center justify-between gap-3">
        <span class="text-2xl font-bold text-white">{{ cityHandle }}</span>
        <span
          v-if="weekBadge"
          class="rounded-full bg-[#8A63D2] px-4 py-1.5 text-lg font-semibold text-white"
        >
          {{ weekBadge }}
        </span>
      </div>

      <div class="rounded-2xl border border-white/15 bg-black/55 p-8 backdrop-blur-md">
        <h1 class="space-y-1">
          <span
            v-for="(line, index) in titleLines"
            :key="index"
            class="block text-[2.75rem] font-black uppercase leading-[0.98] tracking-tight text-white"
          >
            {{ line }}
          </span>
        </h1>
        <p v-if="subtitle" class="mt-4 text-2xl text-white/85">
          {{ subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import EventDigestBg from '~/components/editorial/carousel/templates/event-digest/EventDigestBg.vue'
import {
  eventDigestCityHandle,
  eventDigestCityInLabel,
  eventDigestCoverSubtitle,
  eventDigestTitleLines,
} from '~/utils/eventDigestSlide'
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
const subtitle = computed(() =>
  eventDigestCoverSubtitle(props.slide, eventDigestCityInLabel(props.cityName)),
)
</script>
