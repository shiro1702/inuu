<template>
  <CarouselSlideFrame ref="frameComponent" :aspect="aspect">
    <component
      :is="templateComponent"
      :slide="slide"
      :brand-name="brandName"
      :topic-tags="topicTags"
      :link-hint="linkHint"
    />
  </CarouselSlideFrame>
</template>

<script setup lang="ts">
import type { CarouselAspect, CarouselSlide, CarouselTemplateId } from '~/types/editorialCarousel'
import CarouselSlideFrame from '~/components/editorial/carousel/CarouselSlideFrame.vue'
import MinimalIosBody from '~/components/editorial/carousel/templates/MinimalIosBody.vue'
import MinimalIosCover from '~/components/editorial/carousel/templates/MinimalIosCover.vue'
import MinimalIosOutro from '~/components/editorial/carousel/templates/MinimalIosOutro.vue'

const props = defineProps<{
  slide: CarouselSlide
  aspect: CarouselAspect
  templateId?: CarouselTemplateId
  brandName?: string
  topicTags?: string[]
  linkHint?: string | null
}>()

const frameComponent = ref<{ frameRef: HTMLElement | null } | null>(null)

const templateComponent = computed(() => {
  if (props.slide.role === 'cover') return MinimalIosCover
  if (props.slide.role === 'outro') return MinimalIosOutro
  return MinimalIosBody
})

function getFrameElement(): HTMLElement | null {
  return frameComponent.value?.getFrameElement?.() ?? frameComponent.value?.frameRef ?? null
}

defineExpose({ getFrameElement })
</script>
