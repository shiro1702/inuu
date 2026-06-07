<template>
  <div class="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#FFFDF9] px-10 carousel-slide-pad-bottom pt-36 font-serif text-[#2D362E]">
    <div class="pointer-events-none absolute inset-6 rounded-2xl border border-[#2D362E]/10" />

    <div class="relative z-10 flex max-w-[90%] flex-col items-center space-y-10 text-center">
      <CarouselOutroQr
        :link-hint="linkHint"
        :size="900"
        frame-class="rounded-3xl border border-[#2D362E]/20 bg-[#FFFDF9] p-5 shadow-md"
        image-class="h-[33rem] w-[33rem] rounded-2xl"
        placeholder-class="flex h-[33rem] w-[33rem] items-center justify-center rounded-2xl bg-zinc-100"
      />

      <div class="space-y-4">
        <p class="text-4xl font-normal leading-snug tracking-tight">
          {{ slide.cta_text || slide.title || 'Подробнее на сайте' }}
        </p>
        <p v-if="linkHint" class="font-sans text-2xl font-light text-[#2D362E]/60">
          Наведите камеру на QR-код
        </p>
      </div>

      <p
        v-if="linkLabel"
        class="border-b-2 border-[#2D362E]/40 pb-1 text-2xl italic tracking-wider"
      >
        {{ linkLabel }}
      </p>
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

const linkLabel = computed(() => carouselQrLinkLabel(props.linkHint))
</script>
