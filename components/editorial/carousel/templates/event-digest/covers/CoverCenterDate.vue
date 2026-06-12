<template>
  <div class="relative flex h-full w-full flex-col bg-black px-10">
    <EventDigestBg
      :media-url="slide.media_url"
      :gradient-class="theme.gradientClass"
      show-image
      overlay="bg-black/50"
    />

    <div class="relative z-10 flex h-full flex-col pt-28 carousel-slide-pad-bottom">
      <EventDigestTopHandle
        class="mb-auto"
        :link-hint="linkHint"
        :city-name="cityName"
        :city-slug="citySlug"
      />

      <div class="flex flex-1 flex-col items-center justify-center text-center">
        <h1 class="max-w-[95%] space-y-2">
          <span
            v-for="(line, index) in titleLines"
            :key="index"
            class="block text-[3rem] font-black uppercase leading-[1.02] tracking-tight text-white"
          >
            {{ line }}
          </span>
        </h1>
        <p
          v-if="subtitle"
          class="mt-8 text-3xl font-semibold text-white/90"
        >
          {{ subtitle }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import EventDigestBg from '~/components/editorial/carousel/templates/event-digest/EventDigestBg.vue'
import EventDigestTopHandle from '~/components/editorial/carousel/templates/event-digest/EventDigestTopHandle.vue'
import { eventDigestCoverSubtitle, eventDigestTitleLines } from '~/utils/eventDigestSlide'
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
const subtitle = computed(() => eventDigestCoverSubtitle(props.slide, formatDigestWeekRange()))
</script>
