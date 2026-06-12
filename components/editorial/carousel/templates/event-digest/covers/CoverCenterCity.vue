<template>
  <div class="relative flex h-full w-full flex-col bg-black px-10">
    <EventDigestBg
      :media-url="slide.media_url"
      :gradient-class="theme.gradientClass"
      show-image
      overlay="bg-black/45"
    />

    <div class="relative z-10 flex h-full flex-col pt-28 carousel-slide-pad-bottom">
      <EventDigestTopHandle
        class="mb-auto"
        :link-hint="linkHint"
        :city-name="cityName"
        :city-slug="citySlug"
      />

      <div class="flex flex-1 flex-col items-center justify-center text-center">
        <div class="rounded-2xl bg-[#8A63D2] px-8 py-6 shadow-lg">
          <h1 class="max-w-[90vw] space-y-1">
            <span
              v-for="(line, index) in titleLines"
              :key="index"
              class="block text-[2.5rem] font-black uppercase leading-[1.05] tracking-tight text-white"
            >
              {{ line }}
            </span>
          </h1>
        </div>
        <p
          v-if="cityLabel"
          class="mt-8 text-3xl font-semibold capitalize text-white/95"
        >
          {{ cityLabel }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import EventDigestBg from '~/components/editorial/carousel/templates/event-digest/EventDigestBg.vue'
import EventDigestTopHandle from '~/components/editorial/carousel/templates/event-digest/EventDigestTopHandle.vue'
import { eventDigestCityInLabel, eventDigestTitleLines } from '~/utils/eventDigestSlide'
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
const cityLabel = computed(() => eventDigestCityInLabel(props.cityName))
</script>
