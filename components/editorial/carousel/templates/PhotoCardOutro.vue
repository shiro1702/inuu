<template>
  <div class="relative flex h-full w-full flex-col items-center justify-center gap-8 px-12 carousel-slide-pad-bottom pt-36" :class="theme.gradientClass">
    <CarouselOutroQr
      v-if="linkHint"
      :link-hint="linkHint"
      :size="840"
      frame-class="rounded-3xl border border-white/25 bg-white/95 p-4 shadow-xl"
      image-class="h-[30rem] w-[30rem] rounded-2xl"
      placeholder-class="flex h-[30rem] w-[30rem] items-center justify-center rounded-2xl bg-white/80"
    />
    <div class="rounded-3xl border border-white/25 bg-black/45 p-10 backdrop-blur-md">
      <p class="text-4xl font-bold leading-tight text-white">
        {{ slide.cta_text || slide.title || 'Смотреть афишу' }}
      </p>
      <p v-if="linkLabel" class="mt-4 text-xl text-white/75">
        {{ linkLabel }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import CarouselOutroQr from '~/components/editorial/carousel/CarouselOutroQr.vue'
import { carouselQrLinkLabel } from '~/utils/carouselQrCode'
import { resolveCarouselVibeTheme } from '~/utils/carouselVibeTheme'

const props = defineProps<{
  slide: CarouselSlide
  linkHint?: string | null
  topicTags?: string[]
}>()

const theme = computed(() => resolveCarouselVibeTheme(props.slide, props.topicTags))
const linkLabel = computed(() => carouselQrLinkLabel(props.linkHint))
</script>
