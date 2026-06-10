<template>
  <header class="flex items-center gap-2 border-b border-gray-200 bg-white px-3 py-2 safe-top">
    <button
      type="button"
      class="shrink-0 rounded-lg p-2 text-gray-600 hover:bg-gray-100"
      aria-label="Назад"
      @click="$emit('back')"
    >
      ←
    </button>
    <input
      :value="title"
      type="text"
      class="min-w-0 flex-1 truncate rounded-lg border-0 bg-transparent text-sm font-semibold text-gray-900 focus:ring-1 focus:ring-primary"
      placeholder="Название проекта"
      @input="$emit('update:title', ($event.target as HTMLInputElement).value)"
    >
    <button
      type="button"
      class="shrink-0 rounded-lg px-2 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100"
      @click="$emit('styles')"
    >
      Стили
    </button>
    <button
      type="button"
      class="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
      :disabled="saving"
      @click="$emit('save')"
    >
      {{ saving ? '…' : '💾' }}
    </button>
    <button
      type="button"
      class="shrink-0 rounded-lg border border-gray-300 px-2 py-1.5 text-xs font-medium disabled:opacity-50"
      :disabled="saving"
      @click="$emit('share')"
    >
      🔗
    </button>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  saving?: boolean
}>()

defineEmits<{
  back: []
  'update:title': [value: string]
  styles: []
  save: []
  share: []
}>()
</script>
