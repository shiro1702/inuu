<template>
  <div
    ref="rootRef"
    class="canvas-slide-renderer relative overflow-hidden"
    :style="rootStyle"
  >
    <div
      v-if="backgroundStyle"
      class="absolute inset-0 bg-cover bg-center"
      :style="backgroundStyle"
    />
    <div class="relative z-[1] flex h-full flex-col gap-3 p-6">
      <div
        v-for="block in flowBlocks"
        :key="block.id"
        :ref="(el) => setFlowRef(block.id, el as HTMLElement | null)"
        class="flow-block relative"
      >
        <p
          v-if="block.kind === 'text'"
          class="text-white drop-shadow"
          :class="textClass(block)"
        >
          {{ block.content }}
        </p>
        <img
          v-else-if="block.kind === 'media' && block.url"
          :src="block.url"
          alt=""
          class="max-h-48 w-full rounded-xl object-cover"
        >
      </div>
    </div>
    <div
      v-for="obj in sortedObjects"
      :key="obj.id"
      class="absolute z-[10]"
      :style="objectStyle(obj)"
    >
      <img
        v-if="obj.kind === 'sticker' && obj.image_url"
        :src="obj.image_url"
        alt=""
        class="h-12 w-12 object-contain"
        :style="{ transform: `rotate(${obj.rotation || 0}deg) scale(${obj.scale || 1})` }"
      >
      <span v-else-if="obj.kind === 'text'" class="text-xs text-white/80">{{ obj.content }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CarouselAspect, CarouselCanvasObject, CarouselSlideV2 } from '~/types/editorialCarousel'
import { CAROUSEL_VIRTUAL_SIZES } from '~/types/editorialCarousel'
import { normalizeSlideToV2 } from '~/utils/carouselSlideAdapter'

const props = defineProps<{
  slide: CarouselSlideV2 | null
  aspect: CarouselAspect
  scale?: number
}>()

const rootRef = ref<HTMLElement | null>(null)
const flowRefs = ref<Record<string, HTMLElement | null>>({})

const normalized = computed(() => (props.slide ? normalizeSlideToV2(props.slide) : null))
const flowBlocks = computed(() => normalized.value?.flow || [])
const sortedObjects = computed(() =>
  [...(normalized.value?.objects || [])].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)),
)

const virtualSize = computed(() => CAROUSEL_VIRTUAL_SIZES[props.aspect] || CAROUSEL_VIRTUAL_SIZES['4:5'])
const scaleFactor = computed(() => props.scale ?? 0.28)

const rootStyle = computed(() => ({
  width: `${virtualSize.value.width * scaleFactor.value}px`,
  height: `${virtualSize.value.height * scaleFactor.value}px`,
  background: normalized.value?.gradient
    ? `linear-gradient(135deg, var(--vibe-${normalized.value.gradient}, #333), #111)`
    : '#1a1a1a',
}))

const backgroundStyle = computed(() => {
  const bg = normalized.value?.background
  if (bg?.type === 'image' && bg.url) {
    return {
      backgroundImage: `linear-gradient(${bg.overlay || 'rgba(0,0,0,0.4)'}, ${bg.overlay || 'rgba(0,0,0,0.4)'}), url(${bg.url})`,
    }
  }
  return null
})

function setFlowRef(id: string, el: HTMLElement | null) {
  flowRefs.value[id] = el
}

function textClass(block: { role?: string }) {
  if (block.role === 'title') return 'text-2xl font-bold'
  if (block.role === 'cta') return 'text-lg font-semibold'
  return 'text-sm'
}

function objectStyle(obj: CarouselCanvasObject): Record<string, string> {
  const w = virtualSize.value.width * scaleFactor.value
  const h = virtualSize.value.height * scaleFactor.value

  if (obj.anchor === 'flow' && obj.anchor_target) {
    const anchor = flowRefs.value[obj.anchor_target]
    if (anchor && rootRef.value) {
      const rootRect = rootRef.value.getBoundingClientRect()
      const rect = anchor.getBoundingClientRect()
      const left = rect.right - rootRect.left + (obj.x / 100) * rect.width
      const top = rect.top - rootRect.top + (obj.y / 100) * rect.height
      return { left: `${left}px`, top: `${top}px` }
    }
  }

  return {
    left: `${(obj.x / 100) * w}px`,
    top: `${(obj.y / 100) * h}px`,
  }
}
</script>
