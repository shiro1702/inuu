<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex flex-col justify-end bg-black/40"
      @click.self="$emit('close')"
    >
      <div class="max-h-[75dvh] overflow-y-auto rounded-t-2xl bg-white px-4 pb-safe pt-3 shadow-xl">
        <div class="mb-3 flex items-center justify-between">
          <h3 class="text-base font-semibold">Мои шаблоны</h3>
          <button type="button" class="p-2" @click="$emit('close')">✕</button>
        </div>

        <div class="mb-4 flex gap-2">
          <input
            v-model="newName"
            type="text"
            class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            placeholder="Название шаблона"
          >
          <button
            type="button"
            class="rounded-lg bg-primary px-3 py-2 text-sm text-white"
            @click="$emit('save', newName)"
          >
            Сохранить
          </button>
        </div>

        <div v-if="loading" class="py-6 text-center text-sm text-gray-500">Загрузка…</div>
        <ul v-else class="space-y-2 pb-4">
          <li
            v-for="tpl in items"
            :key="tpl.id"
            class="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2"
          >
            <span class="text-sm font-medium">{{ tpl.name }}</span>
            <button
              type="button"
              class="text-sm text-primary"
              @click="$emit('apply', tpl)"
            >
              Применить
            </button>
          </li>
          <li v-if="!items.length" class="text-sm text-gray-500">Нет сохранённых шаблонов</li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
export type UserTemplateItem = {
  id: string
  name: string
  layout_config: Record<string, unknown>
  theme_id?: string
}

defineProps<{
  open: boolean
  items: UserTemplateItem[]
  loading?: boolean
}>()

defineEmits<{
  close: []
  save: [name: string]
  apply: [template: UserTemplateItem]
}>()

const newName = ref('')
</script>
