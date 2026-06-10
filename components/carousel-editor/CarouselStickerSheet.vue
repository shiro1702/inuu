<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
      @click.self="$emit('close')"
    >
      <div class="max-h-[75dvh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-safe pt-3 shadow-xl">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-base font-semibold">Стикеры</h3>
          <button type="button" class="p-2" @click="$emit('close')">✕</button>
        </div>
        <div v-if="loading" class="py-8 text-center text-sm text-gray-500">Загрузка…</div>
        <div v-else class="grid grid-cols-4 gap-3 pb-4">
          <button
            v-for="item in items"
            :key="item.id"
            type="button"
            class="flex flex-col items-center gap-1 rounded-xl border border-gray-200 p-2"
            @click="$emit('pick', item)"
          >
            <img :src="item.image_url" :alt="item.name" class="h-10 w-10 object-contain">
            <span class="text-[10px] text-gray-600">{{ item.name }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
export type StickerItem = {
  id: string
  name: string
  image_url: string
  category: string
  tags: string[]
}

defineProps<{
  open: boolean
  items: StickerItem[]
  loading?: boolean
}>()

defineEmits<{
  close: []
  pick: [item: StickerItem]
}>()
</script>
