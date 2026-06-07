<template>
  <div
    ref="frameRef"
    class="relative overflow-hidden font-sans"
    :class="{ 'carousel-slide-frame--9-16': aspect === '9:16' }"
    :style="frameStyle"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { CarouselAspect } from '~/types/editorialCarousel'
import { CAROUSEL_EXPORT_SIZES } from '~/types/editorialCarousel'

const props = defineProps<{
  aspect: CarouselAspect
}>()

const frameRef = ref<HTMLElement | null>(null)

const frameStyle = computed(() => {
  const { width, height } = CAROUSEL_EXPORT_SIZES[props.aspect]
  return {
    width: `${width}px`,
    height: `${height}px`,
  }
})

function getFrameElement(): HTMLElement | null {
  return frameRef.value
}

defineExpose({ frameRef, getFrameElement })
</script>

<style>
.carousel-slide-frame {
  text-rendering: geometricPrecision;
  -webkit-font-smoothing: antialiased;
}

.carousel-slide-frame,
.carousel-slide-frame * {
  hyphens: none !important;
  -webkit-hyphens: none !important;
  word-break: normal !important;
  overflow-wrap: normal !important;
}

.carousel-slide-pad-bottom {
  padding-bottom: 8rem;
}

.carousel-slide-frame--9-16 {
  --carousel-stories-safe-bottom: 280px;
}

.carousel-slide-frame--9-16 .carousel-slide-pad-bottom {
  padding-bottom: calc(8rem + var(--carousel-stories-safe-bottom));
}

.carousel-slide-safe-bottom {
  bottom: 8rem;
}

.carousel-slide-frame--9-16 .carousel-slide-safe-bottom {
  bottom: calc(8rem + var(--carousel-stories-safe-bottom));
}
</style>
