<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
      @click.self="$emit('close')"
    >
      <div class="flex max-h-[85dvh] flex-col rounded-t-2xl bg-white shadow-xl">
        <div class="shrink-0 border-b border-gray-100 px-4 pb-3 pt-3">
          <div class="mb-3 flex items-center justify-between">
            <div>
              <h3 class="text-base font-semibold text-gray-900">Стикеры</h3>
              <p class="text-xs text-gray-500">{{ filteredItems.length }} из {{ packItems.length }}</p>
            </div>
            <button type="button" class="rounded-lg p-2 text-gray-500" @click="$emit('close')">✕</button>
          </div>

          <div class="mb-3 flex gap-2">
            <button
              v-for="pack in packs"
              :key="pack"
              type="button"
              class="flex-1 rounded-xl px-3 py-2 text-xs font-semibold"
              :class="activePack === pack ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-700'"
              @click="onPackChange(pack)"
            >
              {{ stickerPackLabel(pack) }}
              <span class="ml-1 opacity-75">({{ countByPack[pack] || 0 }})</span>
            </button>
          </div>

          <input
            v-model="query"
            type="search"
            placeholder="Поиск по названию или тегу…"
            class="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          >

          <div class="flex gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              class="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium"
              :class="activeCategory === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'"
              @click="activeCategory = 'all'"
            >
              Все
            </button>
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              class="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium"
              :class="activeCategory === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'"
              @click="activeCategory = cat"
            >
              {{ stickerCategoryLabel(cat) }} ({{ countByCategory[cat] || 0 }})
            </button>
          </div>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-4 pb-safe pt-3">
          <div v-if="loading" class="py-8 text-center text-sm text-gray-500">Загрузка…</div>

          <div v-else-if="!filteredItems.length" class="py-8 text-center text-sm text-gray-500">
            Ничего не найдено
          </div>

          <template v-else-if="activeCategory === 'all' && !query.trim()">
            <section
              v-for="group in groupedItems"
              :key="group.category"
              class="mb-5"
            >
              <h4 class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {{ stickerCategoryLabel(group.category) }}
              </h4>
              <div class="grid grid-cols-4 gap-3">
                <button
                  v-for="item in group.items"
                  :key="item.id"
                  type="button"
                  class="flex flex-col items-center gap-1 rounded-xl border p-2 active:scale-95"
                  :class="tileClass(item)"
                  @click="$emit('pick', item)"
                >
                  <img
                    :src="item.image_url"
                    :alt="item.name"
                    class="h-10 w-10 object-contain"
                  >
                  <span
                    class="line-clamp-2 text-center text-[10px] leading-tight"
                    :class="labelClass(item)"
                  >
                    {{ formatStickerName(item.name) }}
                  </span>
                </button>
              </div>
            </section>
          </template>

          <div v-else class="grid grid-cols-4 gap-3 pb-4">
            <button
              v-for="item in filteredItems"
              :key="item.id"
              type="button"
              class="flex flex-col items-center gap-1 rounded-xl border p-2 active:scale-95"
              :class="tileClass(item)"
              @click="$emit('pick', item)"
            >
              <img
                :src="item.image_url"
                :alt="item.name"
                class="h-10 w-10 object-contain"
              >
              <span
                class="line-clamp-2 text-center text-[10px] leading-tight"
                :class="labelClass(item)"
              >
                {{ formatStickerName(item.name) }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { sortStickerCategories, stickerCategoryLabel } from '~/utils/carouselStickerCategories'
import { inferStickerPack, sortStickerPacks, stickerPackLabel } from '~/utils/carouselStickerPacks'

export type StickerItem = {
  id: string
  name: string
  image_url: string
  category: string
  tags: string[]
  pack?: string
  is_vector?: boolean
}

const props = defineProps<{
  open: boolean
  items: StickerItem[]
  loading?: boolean
}>()

defineEmits<{
  close: []
  pick: [item: StickerItem]
}>()

const query = ref('')
const activePack = ref<string>('emoji')
const activeCategory = ref<'all' | string>('all')

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) {
      query.value = ''
      activeCategory.value = 'all'
      return
    }
    const available = sortStickerPacks(props.items.map((i) => inferStickerPack(i)))
    activePack.value = available.includes('emoji') ? 'emoji' : (available[0] || 'emoji')
  },
)

const packs = computed(() => sortStickerPacks(props.items.map((i) => inferStickerPack(i))))

const packItems = computed(() =>
  props.items.filter((item) => inferStickerPack(item) === activePack.value),
)

const categories = computed(() => sortStickerCategories(packItems.value.map((i) => i.category)))

const countByPack = computed(() => {
  const counts: Record<string, number> = {}
  for (const item of props.items) {
    const pack = inferStickerPack(item)
    counts[pack] = (counts[pack] || 0) + 1
  }
  return counts
})

const countByCategory = computed(() => {
  const counts: Record<string, number> = {}
  for (const item of packItems.value) {
    counts[item.category] = (counts[item.category] || 0) + 1
  }
  return counts
})

const filteredItems = computed(() => {
  const q = query.value.trim().toLowerCase()
  return packItems.value.filter((item) => {
    if (activeCategory.value !== 'all' && item.category !== activeCategory.value) return false
    if (!q) return true
    const hay = [item.name, item.category, ...(item.tags || [])].join(' ').toLowerCase()
    return hay.includes(q)
  })
})

const groupedItems = computed(() => {
  const groups = new Map<string, StickerItem[]>()
  for (const item of filteredItems.value) {
    const list = groups.get(item.category) || []
    list.push(item)
    groups.set(item.category, list)
  }
  return sortStickerCategories([...groups.keys()]).map((category) => ({
    category,
    items: groups.get(category) || [],
  }))
})

function onPackChange(pack: string) {
  activePack.value = pack
  activeCategory.value = 'all'
  query.value = ''
}

function isEmojiPack(item: StickerItem) {
  return inferStickerPack(item) === 'emoji'
}

function tileClass(item: StickerItem) {
  return isEmojiPack(item)
    ? 'border-gray-200 bg-gradient-to-b from-violet-50 to-white'
    : 'border-gray-200 bg-gray-900'
}

function labelClass(item: StickerItem) {
  return isEmojiPack(item) ? 'text-gray-600' : 'text-gray-300'
}

function formatStickerName(name: string) {
  return name.replace(/_/g, ' ')
}
</script>
