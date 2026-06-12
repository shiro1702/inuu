<template>
  <div class="relative flex h-full w-full flex-col bg-black px-10">
    <EventDigestBg
      :gradient-class="theme.gradientClass"
      :show-image="false"
      overlay="bg-black/20"
    />

    <div class="relative z-10 flex h-full flex-col items-center justify-center text-center carousel-slide-pad-bottom">
      <EventDigestTopHandle
        class="absolute left-0 right-0 top-28 px-10"
        :link-hint="linkHint"
        :city-name="cityName"
        :city-slug="citySlug"
      />

      <span
        v-if="weekBadge"
        class="mb-6 rounded-full bg-[#8A63D2] px-6 py-2 text-xl font-semibold text-white"
      >
        {{ weekBadge }}
      </span>

      <h1 class="max-w-[95%] space-y-2">
        <span
          v-for="(line, index) in titleLines"
          :key="index"
          class="block text-[3.1rem] font-black uppercase leading-[1.02] tracking-tight text-white"
        >
          {{ line }}
        </span>
      </h1>

      <p v-if="cityLabel" class="mt-8 text-3xl font-medium text-white/80">
        {{ cityLabel }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import EventDigestBg from '~/components/editorial/carousel/templates/event-digest/EventDigestBg.vue'
import EventDigestTopHandle from '~/components/editorial/carousel/templates/event-digest/EventDigestTopHandle.vue'
import { eventDigestCityInLabel, eventDigestTitleLines } from '~/utils/eventDigestSlide'
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
const cityLabel = computed(() => eventDigestCityInLabel(props.cityName))
</script>
