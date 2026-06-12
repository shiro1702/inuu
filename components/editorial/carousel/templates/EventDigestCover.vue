<template>
  <component
    :is="variantComponent"
    :slide="slide"
    :topic-tags="topicTags"
    :link-hint="linkHint"
    :city-name="cityName"
    :city-slug="citySlug"
  />
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { CarouselSlide } from '~/types/editorialCarousel'
import CoverBranded from '~/components/editorial/carousel/templates/event-digest/covers/CoverBranded.vue'
import CoverCenterCity from '~/components/editorial/carousel/templates/event-digest/covers/CoverCenterCity.vue'
import CoverCenterDate from '~/components/editorial/carousel/templates/event-digest/covers/CoverCenterDate.vue'
import CoverPhotoHero from '~/components/editorial/carousel/templates/event-digest/covers/CoverPhotoHero.vue'
import CoverTextStack from '~/components/editorial/carousel/templates/event-digest/covers/CoverTextStack.vue'
import { resolveEventDigestLayoutVariant } from '~/utils/eventDigestLayouts'

const props = defineProps<{
  slide: CarouselSlide
  topicTags?: string[]
  linkHint?: string | null
  cityName?: string | null
  citySlug?: string | null
}>()

const COVER_COMPONENTS: Record<string, Component> = {
  'digest-cover-branded': CoverBranded,
  'digest-cover-center-date': CoverCenterDate,
  'digest-cover-center-city': CoverCenterCity,
  'digest-cover-photo-hero': CoverPhotoHero,
  'digest-cover-text-stack': CoverTextStack,
}

const variantComponent = computed(() => {
  const id = resolveEventDigestLayoutVariant(props.slide, 'cover')
  return COVER_COMPONENTS[id] || CoverBranded
})
</script>
