<template>
  <div class="flex h-full w-full flex-col items-center justify-center bg-[#F4F0EA] px-12 carousel-slide-pad-bottom pt-36 font-sans text-[#3E332E]">
    <div class="flex max-w-[85%] flex-col items-center space-y-10 text-center">
      <CarouselOutroQr
        :link-hint="linkHint"
        :size="960"
        frame-class="rounded-[2.5rem] border border-[#3E332E]/5 bg-white p-6 shadow-xl"
        image-class="h-[33rem] w-[33rem] rounded-[1.75rem]"
        placeholder-class="flex h-[33rem] w-[33rem] items-center justify-center rounded-[1.75rem] bg-slate-100"
      />
      <div class="space-y-4">
        <p class="text-4xl font-light leading-snug tracking-tight">
          {{ slide.cta_text || slide.title || 'Больше мест на нашем сайте' }}
        </p>
        <p v-if="linkHint" class="text-2xl font-light text-[#3E332E]/50">
          Наведите камеру на QR-код
        </p>
      </div>
      <p
        v-if="linkLabel"
        class="rounded-full bg-[#3E332E] px-10 py-4 text-2xl font-light tracking-widest text-[#F4F0EA]"
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
