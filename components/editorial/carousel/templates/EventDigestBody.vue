<template>
  <component
    :is="variantComponent"
    :slide="slide"
    :topic-tags="topicTags"
    :link-hint="linkHint"
  />
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import type { CarouselSlide } from '~/types/editorialCarousel'
import BodyCompactCard from '~/components/editorial/carousel/templates/event-digest/bodies/BodyCompactCard.vue'
import BodyFullBleed from '~/components/editorial/carousel/templates/event-digest/bodies/BodyFullBleed.vue'
import BodySideBySide from '~/components/editorial/carousel/templates/event-digest/bodies/BodySideBySide.vue'
import BodySplit from '~/components/editorial/carousel/templates/event-digest/bodies/BodySplit.vue'
import BodyTextOnly from '~/components/editorial/carousel/templates/event-digest/bodies/BodyTextOnly.vue'
import { resolveEventDigestLayoutVariant } from '~/utils/eventDigestLayouts'

const props = defineProps<{
  slide: CarouselSlide
  topicTags?: string[]
  linkHint?: string | null
}>()

const BODY_COMPONENTS: Record<string, Component> = {
  'digest-body-split': BodySplit,
  'digest-body-fullbleed': BodyFullBleed,
  'digest-body-text': BodyTextOnly,
  'digest-body-side': BodySideBySide,
  'digest-body-compact': BodyCompactCard,
}

const variantComponent = computed(() => {
  const id = resolveEventDigestLayoutVariant(props.slide, 'body')
  return BODY_COMPONENTS[id] || BodySplit
})
</script>
