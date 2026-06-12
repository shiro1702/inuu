<template>
  <div class="relative flex h-full w-full flex-col bg-[#5B3E96] px-10 pt-24 carousel-slide-pad-bottom">
    <div class="flex min-h-0 flex-1 flex-col items-center justify-center text-center">
      <p class="text-lg font-semibold uppercase tracking-[0.2em] text-white/75">
        Афиша города
      </p>
      <p class="mt-5 max-w-[92%] text-4xl font-black leading-tight text-white">
        {{ ctaText }}
      </p>

      <div class="mt-10 rounded-3xl bg-white/95 p-5 shadow-2xl">
        <CarouselOutroQr
          :link-hint="linkHint"
          :size="400"
          frame-class=""
          image-class="h-44 w-44"
          placeholder-class="flex h-44 w-44 items-center justify-center bg-gray-100"
        />
      </div>

      <p v-if="linkHint" class="mt-8 text-xl text-white/85">
        Наведите камеру на QR
      </p>
      <span
        v-if="linkLabel"
        class="mt-6 rounded-full border-2 border-white px-9 py-3 text-xl font-bold text-white"
      >
        {{ linkLabel }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import CarouselOutroQr from '~/components/editorial/carousel/CarouselOutroQr.vue'
import { carouselQrLinkLabel } from '~/utils/carouselQrCode'

const props = defineProps<{
  slide: CarouselSlide
  linkHint?: string | null
}>()

const ctaText = computed(() => props.slide.cta_text || props.slide.title || 'Читать в INUU')
const linkLabel = computed(() => carouselQrLinkLabel(props.linkHint))
</script>
