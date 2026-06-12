<template>
  <div class="space-y-1.5">
    <p v-if="showLabel" class="text-xs font-medium text-gray-500">
      Подшаблон слайда
    </p>
    <div
      class="flex gap-2 overflow-x-auto pb-1"
      :class="dense ? '-mx-1 px-1' : ''"
    >
      <button
        v-for="opt in options"
        :key="opt.id"
        type="button"
        class="shrink-0 rounded-full border px-3 py-1.5 text-left transition-colors"
        :class="opt.id === activeId
          ? 'border-violet-500 bg-violet-600 text-white'
          : variant === 'dark'
            ? 'border-white/20 bg-white/5 text-white/90 hover:bg-white/10'
            : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-50'"
        :title="opt.description"
        @click="$emit('select', opt.id)"
      >
        <span class="block text-xs font-semibold leading-tight">{{ opt.label }}</span>
        <span
          v-if="showHint && opt.textOnly"
          class="mt-0.5 block text-[10px] opacity-75"
        >без фото</span>
      </button>
    </div>
    <p
      v-if="showDescription && activeDescription"
      class="text-xs"
      :class="variant === 'dark' ? 'text-white/60' : 'text-gray-500'"
    >
      {{ activeDescription }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { CarouselSlide } from '~/types/editorialCarousel'
import {
  eventDigestLayoutsForRole,
  resolveEventDigestLayoutVariant,
  type EventDigestLayoutOption,
} from '~/utils/eventDigestLayouts'

const props = withDefaults(
  defineProps<{
    slide: CarouselSlide | null
    layoutVariant?: string | null
    variant?: 'light' | 'dark'
    showLabel?: boolean
    showDescription?: boolean
    showHint?: boolean
    dense?: boolean
  }>(),
  {
    variant: 'light',
    showLabel: true,
    showDescription: true,
    showHint: true,
    dense: false,
  },
)

defineEmits<{
  select: [layoutId: string]
}>()

const options = computed<EventDigestLayoutOption[]>(() => {
  if (!props.slide) return []
  return eventDigestLayoutsForRole(props.slide.role)
})

const activeId = computed(() => {
  if (!props.slide) return ''
  const explicit = props.layoutVariant ?? props.slide.layout_variant
  if (explicit?.trim()) return explicit.trim()
  return resolveEventDigestLayoutVariant(props.slide)
})

const activeDescription = computed(() =>
  options.value.find((o) => o.id === activeId.value)?.description || '',
)
</script>
