<template>
  <CarouselSlideFrame ref="frameComponent" :aspect="aspect">
    <CarouselSlideChrome
      :slide-index="slideIndex"
      :total-slides="totalSlides"
      :aspect="aspect"
      :brand-name="brandName"
      :city-name="cityName"
      :logo-url="logoUrl"
      :variant="chromeVariant"
    >
      <component
        :is="templateComponent"
        :slide="slide"
        :aspect="aspect"
        :topic-tags="topicTags"
        :link-hint="linkHint"
        :city-name="cityName"
        :brand-name="brandName"
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
import EventDigestBody from '~/components/editorial/carousel/templates/EventDigestBody.vue'
import EventDigestCover from '~/components/editorial/carousel/templates/EventDigestCover.vue'
import EventDigestOutro from '~/components/editorial/carousel/templates/EventDigestOutro.vue'
import EditorialBoldBody from '~/components/editorial/carousel/templates/EditorialBoldBody.vue'
import EditorialBoldCover from '~/components/editorial/carousel/templates/EditorialBoldCover.vue'
import EditorialBoldOutro from '~/components/editorial/carousel/templates/EditorialBoldOutro.vue'
import KyotoTeaBody from '~/components/editorial/carousel/templates/KyotoTeaBody.vue'
import KyotoTeaCover from '~/components/editorial/carousel/templates/KyotoTeaCover.vue'
import KyotoTeaOutro from '~/components/editorial/carousel/templates/KyotoTeaOutro.vue'
import MinimalIosBody from '~/components/editorial/carousel/templates/MinimalIosBody.vue'
import MinimalIosCover from '~/components/editorial/carousel/templates/MinimalIosCover.vue'
import MinimalIosOutro from '~/components/editorial/carousel/templates/MinimalIosOutro.vue'
import ParisianAtelierBody from '~/components/editorial/carousel/templates/ParisianAtelierBody.vue'
import ParisianAtelierCover from '~/components/editorial/carousel/templates/ParisianAtelierCover.vue'
import ParisianAtelierOutro from '~/components/editorial/carousel/templates/ParisianAtelierOutro.vue'
import PhotoCardBody from '~/components/editorial/carousel/templates/PhotoCardBody.vue'
import PhotoCardCover from '~/components/editorial/carousel/templates/PhotoCardCover.vue'
import PhotoCardOutro from '~/components/editorial/carousel/templates/PhotoCardOutro.vue'
import StockholmCalmBody from '~/components/editorial/carousel/templates/StockholmCalmBody.vue'
import StockholmCalmCover from '~/components/editorial/carousel/templates/StockholmCalmCover.vue'
import StockholmCalmOutro from '~/components/editorial/carousel/templates/StockholmCalmOutro.vue'
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
  'stockholm-calm': {
    cover: StockholmCalmCover,
    body: StockholmCalmBody,
    outro: StockholmCalmOutro,
    chromeVariant: 'light',
  },
  'kyoto-tea': {
    cover: KyotoTeaCover,
    body: KyotoTeaBody,
    outro: KyotoTeaOutro,
    chromeVariant: 'light',
  },
  'parisian-atelier': {
    cover: ParisianAtelierCover,
    body: ParisianAtelierBody,
    outro: ParisianAtelierOutro,
    chromeVariant: 'light',
  },
  'event-digest': {
    cover: EventDigestCover,
    body: EventDigestBody,
    outro: EventDigestOutro,
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
