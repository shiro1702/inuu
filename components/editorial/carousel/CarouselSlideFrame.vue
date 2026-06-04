<template>
  <div
    ref="frameRef"
    class="relative overflow-hidden font-sans"
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
