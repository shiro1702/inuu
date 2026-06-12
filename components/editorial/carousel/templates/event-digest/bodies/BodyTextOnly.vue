<template>
  <div class="relative flex h-full w-full flex-col bg-black px-10">
    <EventDigestBg
      :gradient-class="theme.gradientClass"
      :show-image="false"
    />

    <div class="relative z-10 flex min-h-0 flex-1 flex-col justify-center carousel-slide-pad-bottom">
      <h2 class="text-center text-[2.6rem] font-bold leading-[1.08] text-white">
        {{ headline }}
      </h2>

      <div class="mt-8 flex flex-col items-center gap-4">
        <span
          v-if="meta.datetime"
          class="rounded-full bg-[#8A63D2] px-6 py-2.5 text-2xl font-semibold text-white"
        >
          {{ meta.datetime }}
        </span>
        <span
          v-if="meta.venue"
          class="inline-flex items-center gap-2 rounded-full border-2 border-white/35 bg-white/10 px-6 py-2 text-xl font-semibold text-white"
        >
          <span class="text-base">📍</span>
          {{ meta.venue }}
        </span>
        <span
          v-if="meta.price"
          class="rounded-full bg-white px-6 py-2 text-xl font-bold text-black"
        >
          {{ meta.price }}
        </span>
      </div>

      <div v-if="theses.length" class="mt-8 space-y-3 text-center">
        <p
          v-for="(thesis, index) in theses"
          :key="`thesis-${index}-${thesis}`"
          class="text-[1.55rem] leading-snug text-white/92"
        >
          {{ thesis }}
        </p>
      </div>

      <div class="mt-10 flex justify-center">
        <span class="inline-flex rounded-full border-2 border-white px-8 py-3 text-xl font-bold text-white">
          {{ ctaLabel }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import EventDigestBg from '~/components/editorial/carousel/templates/event-digest/EventDigestBg.vue'
import { eventDigestCtaLabelFromVenue, eventDigestHeadline } from '~/utils/eventDigestSlide'
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
const ctaLabel = computed(() => eventDigestCtaLabelFromVenue(meta.value.venue, props.linkHint))
</script>
