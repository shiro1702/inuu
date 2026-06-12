<template>
  <div class="relative flex h-full w-full flex-col bg-black px-10">
    <div
      class="absolute inset-0 opacity-90"
      :class="theme.gradientClass"
    />
    <div class="absolute inset-0 bg-black/35" />

    <div class="relative z-10 flex h-full flex-col items-center justify-center text-center carousel-slide-pad-bottom">
      <p class="text-2xl font-semibold uppercase tracking-widest text-white/70">
        INUU
      </p>
      <p class="mt-6 max-w-[92%] text-[3.25rem] font-black leading-[1.02] text-white">
        {{ ctaText }}
      </p>
      <p v-if="subtitle" class="mt-8 max-w-[85%] text-2xl text-white/80">
        {{ subtitle }}
      </p>
      <span
        v-if="linkLabel"
        class="mt-12 rounded-full border-2 border-white px-10 py-4 text-2xl font-bold text-white"
      >
        {{ linkLabel }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import { carouselQrLinkLabel } from '~/utils/carouselQrCode'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{
  slide: CarouselSlide
  topicTags?: string[]
  linkHint?: string | null
}>()

const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
const ctaText = computed(() => props.slide.cta_text || props.slide.title || 'Вся афиша в городе')
const subtitle = computed(() => {
  const bullets = props.slide.bullets || []
  return bullets[0] || (props.linkHint ? 'Откройте ссылку в профиле' : '')
})
const linkLabel = computed(() => carouselQrLinkLabel(props.linkHint))
</script>
