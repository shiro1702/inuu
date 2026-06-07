<template>
  <div class="flex h-full w-full flex-col bg-black">
    <div class="relative min-h-0 shrink-0" style="height: 42%">
      <img
        v-if="slide.media_url"
        :src="slide.media_url"
        alt=""
        crossorigin="anonymous"
        class="h-full w-full object-cover"
      >
      <div
        v-else
        class="h-full w-full"
        :class="theme.gradientClass"
      />
    </div>

    <div class="flex min-h-0 flex-1 flex-col px-10 pb-4 pt-8 carousel-slide-pad-bottom">
      <h2 class="text-[2.35rem] font-bold leading-[1.1] text-white">
        {{ headline }}
      </h2>

      <div v-if="metaBadges.length" class="mt-5 flex flex-wrap gap-3">
        <span
          v-for="(badge, index) in metaBadges"
          :key="`meta-${index}-${badge}`"
          class="inline-flex w-fit rounded-full bg-[#8A63D2] px-5 py-2.5 text-2xl font-semibold text-white"
        >
          {{ badge }}
        </span>
      </div>

      <div v-if="theses.length" class="mt-6 space-y-3">
        <p
          v-for="(thesis, index) in theses"
          :key="`thesis-${index}-${thesis}`"
          class="text-[1.65rem] font-normal leading-snug text-white/95"
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
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import {
  eventDigestCtaLabel,
  eventDigestHeadline,
  eventDigestMetaBadges,
  eventDigestTheses,
} from '~/utils/eventDigestSlide'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{
  slide: CarouselSlide
  topicTags?: string[]
  linkHint?: string | null
}>()

const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
const headline = computed(() => eventDigestHeadline(props.slide.title))
const metaBadges = computed(() => eventDigestMetaBadges(props.slide.bullets))
const theses = computed(() => eventDigestTheses(props.slide.bullets))
const ctaLabel = computed(() => eventDigestCtaLabel(props.slide.bullets, props.linkHint))
</script>
