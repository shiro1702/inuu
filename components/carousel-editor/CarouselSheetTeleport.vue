<template>
  <ClientOnly>
    <Teleport v-if="open" to="body">
      <!-- Сброс text-white от тёмного shell редактора (Teleport может оставаться в дереве компонентов). -->
      <div class="text-gray-900">
        <slot />
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean
}>()
</script>
