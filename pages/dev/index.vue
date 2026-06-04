<template>
  <div class="sr-only">Redirecting…</div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

if (import.meta.server) {
  await navigateTo('/dashboard/carousel-studio', { redirectCode: 302 })
} else {
  await navigateTo('/dashboard/carousel-studio')
}
</script>
