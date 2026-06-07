<template>
  <div class="flex h-full w-full items-center justify-center px-8 pt-36 carousel-slide-pad-bottom">
    <div
      class="flex h-full w-full flex-col items-center justify-center border-[10px] border-white p-10 text-center shadow-2xl"
      :class="theme.gradientClass"
    >
      <CarouselOutroQr
        v-if="linkHint"
        :link-hint="linkHint"
        :size="780"
        frame-class="mb-8 rounded-2xl border-4 border-white/30 bg-white p-4"
        image-class="h-[27rem] w-[27rem] rounded-xl"
        placeholder-class="flex h-[27rem] w-[27rem] items-center justify-center rounded-xl bg-white/80"
      />
      <p class="text-5xl font-black uppercase leading-none tracking-tight text-white">
        {{ slide.cta_text || 'INUU' }}
      </p>
      <p v-if="linkLabel" class="mt-6 max-w-[90%] text-xl font-semibold uppercase tracking-wider text-white/80">
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
