<template>
  <CarouselSlideFrame ref="frameComponent" :aspect="aspect">
    <CarouselSlideChrome
      :slide-index="slideIndex"
      :total-slides="totalSlides"
      :brand-name="brandName"
      :city-name="cityName"
      :logo-url="logoUrl"
      :variant="chromeVariant"
    >
      <component
        :is="templateComponent"
        :slide="slide"
        :topic-tags="topicTags"
        :link-hint="linkHint"
      />
    </CarouselSlideChrome>
  </CarouselSlideFrame>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { CarouselAspect, CarouselSlide, CarouselTemplateId } from '~/types/editorialCarousel'
import CarouselSlideChrome from '~/components/editorial/carousel/CarouselSlideChrome.vue'
import CarouselSlideFrame from '~/components/editorial/carousel/CarouselSlideFrame.vue'
import CityPosterBody from '~/components/editorial/carousel/templates/CityPosterBody.vue'
import CityPosterCover from '~/components/editorial/carousel/templates/CityPosterCover.vue'
import CityPosterOutro from '~/components/editorial/carousel/templates/CityPosterOutro.vue'
import EditorialBoldBody from '~/components/editorial/carousel/templates/EditorialBoldBody.vue'
import EditorialBoldCover from '~/components/editorial/carousel/templates/EditorialBoldCover.vue'
import EditorialBoldOutro from '~/components/editorial/carousel/templates/EditorialBoldOutro.vue'
import MinimalIosBody from '~/components/editorial/carousel/templates/MinimalIosBody.vue'
import MinimalIosCover from '~/components/editorial/carousel/templates/MinimalIosCover.vue'
import MinimalIosOutro from '~/components/editorial/carousel/templates/MinimalIosOutro.vue'
import PhotoCardBody from '~/components/editorial/carousel/templates/PhotoCardBody.vue'
import PhotoCardCover from '~/components/editorial/carousel/templates/PhotoCardCover.vue'
import PhotoCardOutro from '~/components/editorial/carousel/templates/PhotoCardOutro.vue'
import { DEFAULT_CAROUSEL_TEMPLATE_ID, normalizeCarouselTemplateId } from '~/utils/carouselTemplates'

type TemplateSet = {
  cover: Component
  body: Component
  outro: Component
  chromeVariant: 'dark' | 'light'
}

const TEMPLATE_SETS: Record<CarouselTemplateId, TemplateSet> = {
  'minimal-ios': {
    cover: MinimalIosCover,
    body: MinimalIosBody,
    outro: MinimalIosOutro,
    chromeVariant: 'dark',
  },
  'photo-card': {
    cover: PhotoCardCover,
    body: PhotoCardBody,
    outro: PhotoCardOutro,
    chromeVariant: 'dark',
  },
  'editorial-bold': {
    cover: EditorialBoldCover,
    body: EditorialBoldBody,
    outro: EditorialBoldOutro,
    chromeVariant: 'light',
  },
  'city-poster': {
    cover: CityPosterCover,
    body: CityPosterBody,
    outro: CityPosterOutro,
    chromeVariant: 'dark',
  },
}

const props = withDefaults(
  defineProps<{
    slide: CarouselSlide
    aspect: CarouselAspect
    templateId?: CarouselTemplateId
    brandName?: string
    cityName?: string
    logoUrl?: string
    topicTags?: string[]
    linkHint?: string | null
    slideIndex?: number
    totalSlides?: number
  }>(),
  {
    templateId: DEFAULT_CAROUSEL_TEMPLATE_ID,
    brandName: 'INUU',
    slideIndex: 1,
    totalSlides: 1,
  },
)

const frameComponent = ref<{ frameRef: HTMLElement | null } | null>(null)

const resolvedTemplateId = computed(() => normalizeCarouselTemplateId(props.templateId))

const templateSet = computed(() => TEMPLATE_SETS[resolvedTemplateId.value])

const templateComponent = computed(() => {
  if (props.slide.role === 'cover') return templateSet.value.cover
  if (props.slide.role === 'outro') return templateSet.value.outro
  return templateSet.value.body
})

const chromeVariant = computed(() => templateSet.value.chromeVariant)

function getFrameElement(): HTMLElement | null {
  return frameComponent.value?.getFrameElement?.() ?? frameComponent.value?.frameRef ?? null
}

defineExpose({ getFrameElement })
</script>
