<template>
  <div class="flex h-full w-full flex-col bg-black px-10 pt-10 carousel-slide-pad-bottom">
    <div class="flex items-start gap-7">
      <div class="aspect-[4/5] w-[50%] shrink-0 overflow-hidden rounded-3xl border-2 border-white/25 shadow-lg">
        <img
          v-if="slide.media_url"
          :src="slide.media_url"
          alt=""
          crossorigin="anonymous"
          class="h-full w-full object-cover"
        >
        <div v-else class="h-full w-full" :class="theme.gradientClass" />
      </div>

      <div class="min-w-0 flex-1 pt-2">
        <h2 class="text-[2.35rem] font-bold leading-[1.08] text-white">
          {{ headline }}
        </h2>
        <span
          v-if="meta.datetime"
          class="mt-5 inline-flex rounded-full bg-[#8A63D2] px-5 py-2.5 text-2xl font-semibold text-white"
        >
          {{ meta.datetime }}
        </span>
      </div>
    </div>

    <div class="mt-7 flex flex-wrap gap-3">
      <span
        v-if="showVenue"
        class="inline-flex items-center gap-2 rounded-full border-2 border-white/35 bg-white/10 px-5 py-2.5 text-xl font-semibold text-white"
      >
        <span class="text-lg">📍</span>
        {{ meta.venue }}
      </span>
      <span
        v-if="meta.price"
        class="rounded-full bg-white px-5 py-2.5 text-xl font-bold text-black"
      >
        {{ meta.price }}
      </span>
    </div>

    <div v-if="theses.length" class="mt-7 flex-1 space-y-4">
      <p
        v-for="(thesis, index) in theses"
        :key="index"
        class="text-[1.65rem] leading-snug text-white/95"
      >
        {{ thesis }}
      </p>
    </div>

    <div class="mt-auto pt-8">
      <span class="inline-flex rounded-full border-2 border-white px-8 py-3 text-2xl font-bold text-white">
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
