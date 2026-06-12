<template>
  <div class="flex h-full w-full bg-black">
    <div class="relative w-[44%] shrink-0">
      <img
        v-if="slide.media_url"
        :src="slide.media_url"
        alt=""
        crossorigin="anonymous"
        class="h-full w-full object-cover"
      >
      <div v-else class="h-full w-full" :class="theme.gradientClass" />
    </div>

    <div class="flex min-w-0 flex-1 flex-col justify-center px-8 py-10 carousel-slide-pad-bottom">
      <h2 class="text-[2rem] font-bold leading-[1.1] text-white">
        {{ headline }}
      </h2>

      <div v-if="meta.datetime" class="mt-4 inline-flex w-fit rounded-full bg-[#8A63D2] px-4 py-2 text-lg font-semibold text-white">
        {{ meta.datetime }}
      </div>
      <p v-if="showVenue" class="mt-3 text-lg font-semibold text-white/90">
        📍 {{ meta.venue }}
      </p>
      <p v-if="meta.price" class="mt-2 text-lg font-bold text-white">
        {{ meta.price }}
      </p>

      <div v-if="theses.length" class="mt-4 space-y-2">
        <p
          v-for="(thesis, index) in theses"
          :key="index"
          class="text-base leading-snug text-white/90"
        >
          {{ thesis }}
        </p>
      </div>

      <span class="mt-6 inline-flex w-fit rounded-full border border-white px-5 py-2 text-base font-bold text-white">
        {{ ctaLabel }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import {
  eventDigestBodyCtaLabel,
  eventDigestHeadline,
  isEventDigestPlaceLine,
} from '~/utils/eventDigestSlide'
import { resolveSlideEventMeta } from '~/utils/carouselSlideEventMeta'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{
  slide: CarouselSlide
  topicTags?: string[]
  linkHint?: string | null
}>()

const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
const meta = computed(() => resolveSlideEventMeta(props.slide))
const headline = computed(() => eventDigestHeadline(props.slide.title))
const theses = computed(() => meta.value.theses)
const showVenue = computed(() => isEventDigestPlaceLine(meta.value.venue))
const ctaLabel = computed(() => eventDigestBodyCtaLabel(props.slide, props.linkHint))
</script>
