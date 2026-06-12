<template>
  <p class="text-center text-2xl font-bold tracking-tight text-white/95">
    {{ handle }}
  </p>
</template>

<script setup lang="ts">
import { eventDigestCityHandle } from '~/utils/eventDigestSlide'

const props = defineProps<{
  linkHint?: string | null
  cityName?: string | null
  citySlug?: string | null
}>()

const handle = computed(() =>
  eventDigestCityHandle(props.linkHint, props.cityName, props.citySlug),
)
</script>
