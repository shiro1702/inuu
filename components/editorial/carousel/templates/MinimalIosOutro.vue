<template>
  <div
    class="relative flex h-full w-full flex-col items-center justify-center gap-8 p-12 text-center"
    :class="[theme.gradientClass, theme.textClass]"
  >
    <div
      class="rounded-3xl border px-10 py-8 backdrop-blur-sm"
      :class="theme.accentClass"
    >
      <p class="text-4xl font-bold leading-tight">
        {{ slide.cta_text || slide.title || 'Читать в приложении' }}
      </p>
      <p
        v-if="linkHint"
        class="mt-4 text-lg text-white/70"
      >
        {{ linkHint }}
      </p>
    </div>
    <p class="text-sm font-medium text-white/60">
      {{ brandHandle }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import { carouselBrandHandle, resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{
  slide: CarouselSlide
  brandName?: string
  linkHint?: string | null
  topicTags?: string[]
}>()

const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
const brandHandle = computed(() => carouselBrandHandle(props.brandName || 'INUU'))
</script>
