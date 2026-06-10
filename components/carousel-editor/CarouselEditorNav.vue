<template>
  <div class="grid grid-cols-2 gap-2 px-3 py-2">
    <button
      type="button"
      class="rounded-xl bg-white/10 py-3 text-sm font-medium text-white disabled:opacity-40"
      :disabled="!canPrev"
      @click="$emit('prev')"
    >
      ← Назад
    </button>
    <button
      type="button"
      class="rounded-xl bg-white/10 py-3 text-sm font-medium text-white disabled:opacity-40"
      :disabled="!canNext"
      @click="$emit('next')"
    >
      Далее →
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  canPrev: boolean
  canNext: boolean
}>()

defineEmits<{
  prev: []
  next: []
}>()
</script>
