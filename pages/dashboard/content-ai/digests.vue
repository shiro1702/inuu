<template>
  <article class="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
    <h2 class="text-lg font-semibold">Ручной запуск дайджестов/подборок</h2>
    <p class="text-xs text-gray-500">
      Создает draft-подборки (`is_published=false`) и отправляет уведомление в manager/moderation chat.
    </p>
    <div class="grid gap-3 md:grid-cols-2">
      <label class="space-y-1 text-sm">
        <span class="font-medium text-gray-700">Режим</span>
        <select v-model="digestForm.mode" class="w-full rounded-lg border border-gray-300 px-3 py-2">
          <option value="weekly">weekly</option>
          <option value="custom">custom</option>
        </select>
      </label>
      <label class="space-y-1 text-sm">
        <span class="font-medium text-gray-700">Tag mode</span>
        <select v-model="digestForm.tagsMode" class="w-full rounded-lg border border-gray-300 px-3 py-2">
          <option value="or">or</option>
          <option value="and">and</option>
        </select>
      </label>
      <label class="space-y-1 text-sm">
        <span class="font-medium text-gray-700">Лимит карточек</span>
        <input v-model.number="digestForm.limit" type="number" min="3" max="20" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <label class="space-y-1 text-sm">
        <span class="font-medium text-gray-700">Мин. editorial score</span>
        <input v-model.number="digestForm.minScore" type="number" min="1" max="5" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <div v-if="selectedCitySlug" class="space-y-1 text-sm md:col-span-2">
        <DashboardTaxonomyPicker
          v-model="digestForm.categorySlug"
          :city-slug="selectedCitySlug"
          kind="category"
          label="Категория (optional)"
          placeholder="Поиск категории…"
        />
      </div>
      <div v-if="selectedCitySlug" class="space-y-1 text-sm md:col-span-2">
        <DashboardTaxonomyPicker
          v-model="digestForm.topicTags"
          :city-slug="selectedCitySlug"
          kind="tags"
          label="Теги (клик + поиск)"
          placeholder="Поиск или новый тег…"
          hint="Кликайте по тегам из списка или ищите по названию"
        />
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50" :disabled="digestLoading" @click="runDigestGeneration">
        {{ digestLoading ? 'Запуск...' : 'Запустить генерацию' }}
      </button>
      <span v-if="digestMessage" class="text-sm text-gray-700">{{ digestMessage }}</span>
    </div>
    <pre class="max-h-72 overflow-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">{{ digestResultText }}</pre>
  </article>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

definePageMeta({ layout: 'dashboard-content-ai' })

const { dashboardFetch } = useDashboardFetch()
const { selectedCitySlug } = useContentAiCity()

const digestLoading = ref(false)
const digestMessage = ref('')
const digestResultText = ref('Пока пусто')
const digestForm = reactive({
  mode: 'weekly' as 'weekly' | 'custom',
  tagsMode: 'or' as 'or' | 'and',
  limit: 12,
  minScore: 4,
  categorySlug: '',
  topicTags: [] as string[],
})

function pretty(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

async function runDigestGeneration() {
  if (!selectedCitySlug.value) return
  digestLoading.value = true
  digestMessage.value = ''
  try {
    const topicTags = Array.isArray(digestForm.topicTags)
      ? digestForm.topicTags.map((tag: string) => String(tag || '').trim()).filter(Boolean)
      : []
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/generate-digest`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        mode: digestForm.mode,
        tagsMode: digestForm.tagsMode,
        limit: digestForm.limit,
        minScore: digestForm.minScore,
        categorySlug: digestForm.categorySlug || null,
        topicTags,
      }),
    })
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) {
      throw new Error(payload?.statusMessage || payload?.message || 'Не удалось запустить генерацию')
    }
    const listCount = Array.isArray(payload?.lists) ? payload.lists.length : 0
    digestMessage.value = `Готово: создано/обновлено ${listCount} подборок`
    digestResultText.value = pretty(payload)
  } catch (error: any) {
    digestMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка запуска генерации'
    digestResultText.value = pretty(error?.data || error?.message || error)
  } finally {
    digestLoading.value = false
  }
}
</script>
