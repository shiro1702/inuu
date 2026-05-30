<template>
  <Teleport to="body">
    <div
      v-if="toasts.length"
      class="pointer-events-none fixed inset-x-0 top-16 z-[100] flex flex-col items-center gap-2 px-4 sm:top-20"
      aria-live="polite"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto flex max-w-md items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur"
        :class="toastClass(toast.kind)"
      >
        <p class="min-w-0 flex-1 leading-snug">{{ toast.message }}</p>
        <button
          type="button"
          class="shrink-0 text-xs opacity-70 hover:opacity-100"
          aria-label="Закрыть"
          @click="dismissToast(toast.id)"
        >
          ✕
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { AppToastKind } from '~/composables/useAppToast'

const { toasts, dismissToast } = useAppToast()

function toastClass(kind: AppToastKind) {
  if (kind === 'error') return 'border-red-200 bg-red-50/95 text-red-900'
  if (kind === 'info') return 'border-indigo-200 bg-indigo-50/95 text-indigo-900'
  return 'border-emerald-200 bg-emerald-50/95 text-emerald-900'
}
</script>
