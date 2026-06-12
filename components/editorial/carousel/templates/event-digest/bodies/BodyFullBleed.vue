<template>
  <div class="relative h-full w-full bg-black">
    <EventDigestBg
      :media-url="slide.media_url"
      :gradient-class="theme.gradientClass"
      show-image
      overlay="bg-gradient-to-t from-black via-black/70 to-black/20"
    />

    <div class="relative z-10 flex h-full flex-col justify-end px-10 pb-6 pt-32 carousel-slide-pad-bottom">
      <h2 class="text-[2.5rem] font-bold leading-[1.08] text-white">
        {{ headline }}
      </h2>

      <div class="mt-5 flex flex-wrap gap-2">
        <span
          v-for="(badge, index) in metaBadges"
          :key="`meta-${index}-${badge}`"
          class="inline-flex rounded-full px-4 py-2 text-xl font-semibold"
          :class="badgeClass(index)"
        >
          {{ badge }}
        </span>
      </div>

      <div v-if="theses.length" class="mt-5 space-y-2">
        <p
          v-for="(thesis, index) in theses"
          :key="`thesis-${index}-${thesis}`"
          class="text-[1.5rem] leading-snug text-white/92"
        >
          {{ thesis }}
        </p>
      </div>

      <div class="mt-8">
        <span class="inline-flex rounded-full border-2 border-white bg-black/30 px-7 py-3 text-xl font-bold text-white backdrop-blur-sm">
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

const metaBadges = computed(() => {
  const items: string[] = []
  if (meta.value.datetime) items.push(meta.value.datetime)
  if (meta.value.venue) items.push(meta.value.venue)
  if (meta.value.price) items.push(meta.value.price)
  return items
})

function badgeClass(index: number): string {
  if (index === 0) return 'bg-[#8A63D2] text-white'
  if (index === 2) return 'bg-white text-black'
  return 'border border-white/40 bg-white/10 text-white'
}
</script>
