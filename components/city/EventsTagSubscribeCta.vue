<template>
  <div class="space-y-2" :class="compact ? '' : 'max-w-md'">
    <button
      type="button"
      class="w-full rounded-full border border-primary/30 bg-primary/5 px-4 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      :disabled="pending || subscribed"
      @click="emit('subscribe')"
    >
      <span v-if="pending">Сохраняем…</span>
      <span v-else-if="subscribed">Вы подписаны на эти теги</span>
      <span v-else>Подписаться на теги</span>
    </button>
    <p v-if="!subscribed" class="text-xs leading-snug text-gray-500">
      События по выбранным тегам будут приходить в бота, как только появятся на афише.
    </p>
    <NuxtLink
      v-if="subscribed && settingsHref"
      :to="settingsHref"
      class="inline-block text-sm text-primary hover:underline"
    >
      Настроить подписки
    </NuxtLink>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  subscribed: boolean
  pending: boolean
  error: string
  settingsHref?: string
  compact?: boolean
}>()

const emit = defineEmits<{ subscribe: [] }>()
</script>
