<template>
  <div class="flex h-full w-full flex-col items-center bg-black px-10 pt-28 text-center carousel-slide-pad-bottom">
    <p class="max-w-[90%] text-4xl font-black uppercase leading-tight text-white">
      {{ ctaText }}
    </p>
    <p v-if="linkHint" class="mt-4 text-xl text-white/65">
      Сканируйте QR — вся афиша в одном месте
    </p>

    <div class="mt-10">
      <CarouselOutroQr
        :link-hint="linkHint"
        :size="520"
        frame-class="rounded-2xl border border-white/25 bg-white p-4"
        image-class="h-52 w-52 rounded-xl"
        placeholder-class="flex h-52 w-52 items-center justify-center rounded-xl bg-white/90"
      />
    </div>

    <span
      v-if="linkLabel"
      class="mt-10 rounded-full bg-[#8A63D2] px-8 py-3 text-xl font-bold text-white"
    >
      {{ linkLabel }}
    </span>
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
