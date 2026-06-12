<template>
  <div class="absolute inset-0">
    <img
      v-if="showImage && mediaUrl"
      :src="mediaUrl"
      alt=""
      crossorigin="anonymous"
      class="h-full w-full object-cover"
    >
    <div
      v-else
      class="h-full w-full"
      :class="gradientClass"
    />
    <div v-if="overlay" class="absolute inset-0" :class="overlay" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  mediaUrl?: string | null
  gradientClass: string
  showImage?: boolean
  overlay?: string
}>()
</script>
