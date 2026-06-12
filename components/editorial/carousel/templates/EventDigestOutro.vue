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
import OutroCompact from '~/components/editorial/carousel/templates/event-digest/outros/OutroCompact.vue'
import OutroCtaOnly from '~/components/editorial/carousel/templates/event-digest/outros/OutroCtaOnly.vue'
import OutroPurple from '~/components/editorial/carousel/templates/event-digest/outros/OutroPurple.vue'
import OutroQrCenter from '~/components/editorial/carousel/templates/event-digest/outros/OutroQrCenter.vue'
import OutroSplit from '~/components/editorial/carousel/templates/event-digest/outros/OutroSplit.vue'
import { resolveEventDigestLayoutVariant } from '~/utils/eventDigestLayouts'

const props = defineProps<{
  slide: CarouselSlide
  topicTags?: string[]
  linkHint?: string | null
}>()

const OUTRO_COMPONENTS: Record<string, Component> = {
  'digest-outro-qr': OutroQrCenter,
  'digest-outro-compact': OutroCompact,
  'digest-outro-cta': OutroCtaOnly,
  'digest-outro-split': OutroSplit,
  'digest-outro-purple': OutroPurple,
}

const variantComponent = computed(() => {
  const id = resolveEventDigestLayoutVariant(props.slide, 'outro')
  return OUTRO_COMPONENTS[id] || OutroQrCenter
})
</script>
