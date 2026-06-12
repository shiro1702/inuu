<template>
  <div class="flex h-full w-full flex-col justify-center bg-black px-10 carousel-slide-pad-bottom">
    <div class="flex flex-row items-center justify-center gap-8">
      <CarouselOutroQr
        v-if="linkHint"
        :link-hint="linkHint"
        :size="480"
        frame-class="rounded-2xl border-2 border-white/20 bg-white p-4 shrink-0"
        image-class="h-48 w-48 rounded-xl"
        placeholder-class="flex h-48 w-48 items-center justify-center rounded-xl bg-white/90"
      />

      <div class="max-w-[52%] text-left">
        <p class="text-4xl font-bold leading-tight text-white">
          {{ ctaText }}
        </p>
        <p v-if="linkHint" class="mt-4 text-xl text-white/70">
          Наведите камеру или перейдите по ссылке
        </p>
        <span
          v-if="linkLabel"
          class="mt-8 inline-flex rounded-full bg-white px-8 py-3 text-xl font-bold text-black"
        >
          {{ linkLabel }}
        </span>
      </div>
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

const ctaText = computed(() => props.slide.cta_text || props.slide.title || 'Вся афиша в городе')
const linkLabel = computed(() => carouselQrLinkLabel(props.linkHint))
</script>
