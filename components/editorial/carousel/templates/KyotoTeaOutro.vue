<template>
  <div class="relative flex h-full w-full flex-col overflow-hidden bg-[#FAF9F6] px-12 carousel-slide-pad-bottom pt-36 font-serif text-[#1A1A1A]">
    <div class="absolute carousel-slide-safe-bottom left-12 top-36 w-px bg-[#1A1A1A]/10" />

    <div class="relative z-10 flex min-h-0 flex-1 flex-col justify-center pl-8">
      <div class="max-w-[90%] space-y-10">
        <div v-if="linkHint" class="flex justify-center">
          <CarouselOutroQr
            :link-hint="linkHint"
            :size="840"
            frame-class="rounded-3xl border border-[#1A1A1A]/10 bg-white p-4 shadow-sm"
            image-class="h-[30rem] w-[30rem] rounded-2xl"
            placeholder-class="flex h-[30rem] w-[30rem] items-center justify-center rounded-2xl bg-gray-100"
          />
        </div>

        <h3 class="text-4xl font-light tracking-tight">
          {{ slide.cta_text || slide.title || 'Вместо заключения' }}
        </h3>
        <ul v-if="bullets.length" class="space-y-5 font-sans text-2xl font-light text-gray-600">
          <li v-for="(item, index) in bullets" :key="index" class="flex items-start gap-4">
            <span class="font-serif text-2xl font-bold text-[#1A1A1A]">✓</span>
            <span>{{ item }}</span>
          </li>
        </ul>
        <div v-if="linkLabel" class="space-y-4 border-t border-[#1A1A1A]/10 pt-8">
          <p class="font-mono text-lg tracking-wide text-gray-400 uppercase">Исследуйте на нашем сайте</p>
          <p class="text-3xl font-light underline decoration-1 underline-offset-8">
            {{ linkLabel }}
          </p>
        </div>
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

const bullets = computed(() => (props.slide.bullets || []).filter(Boolean).slice(0, 3))
const linkLabel = computed(() => carouselQrLinkLabel(props.linkHint))
</script>
