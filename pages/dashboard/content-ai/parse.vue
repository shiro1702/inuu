<template>
  <article class="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
    <h2 class="text-lg font-semibold">AI parse / ingest тест</h2>
    <label class="block space-y-1 text-sm">
      <span class="font-medium text-gray-700">Source kind</span>
      <select v-model="aiForm.sourceKind" class="w-full rounded-lg border border-gray-300 px-3 py-2">
        <option value="telegram_parse">telegram_parse</option>
        <option value="web_cron">web_cron</option>
        <option value="bot_submit">bot_submit</option>
        <option value="manual_editor">manual_editor</option>
      </select>
    </label>
    <label class="block space-y-1 text-sm">
      <span class="font-medium text-gray-700">Source URL</span>
      <input v-model="aiForm.sourceUrl" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
    </label>
    <label class="block space-y-1 text-sm">
      <span class="font-medium text-gray-700">Raw text</span>
      <textarea v-model="aiForm.rawText" rows="8" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
    </label>

    <div class="flex flex-wrap items-center gap-3">
      <button class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50" :disabled="aiLoading" @click="runParseOnly">
        Parse only
      </button>
      <button class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50" :disabled="aiLoading" @click="runIngest(false)">
        Ingest (без persist)
      </button>
      <button class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50" :disabled="aiLoading" @click="runIngest(true)">
        Ingest + persist
      </button>
    </div>

    <pre class="max-h-80 overflow-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">{{ aiResultText }}</pre>
  </article>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const { dashboardFetch } = useDashboardFetch()
const { selectedCitySlug } = useContentAiCity()

const aiLoading = ref(false)
const aiResultText = ref('Пока пусто')
const aiForm = reactive({
  sourceKind: 'telegram_parse',
  sourceUrl: '',
  rawText: 'В субботу 15 июня в 19:00 пройдет гончарный мастер-класс в Арт-квартале. 12 мест, стоимость 1500 руб. Запись по ссылке https://example.com/register',
})

function pretty(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

async function runParseOnly() {
  if (!selectedCitySlug.value) return
  aiLoading.value = true
  try {
    const res = await dashboardFetch('/api/ai/parse-event', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        rawText: aiForm.rawText,
        sourceKind: aiForm.sourceKind,
        sourceUrl: aiForm.sourceUrl || null,
        citySlug: selectedCitySlug.value,
      }),
    })
    const response = await res.json()
    aiResultText.value = pretty(response)
  } catch (error: any) {
    aiResultText.value = pretty(error?.data || error?.message || error)
  } finally {
    aiLoading.value = false
  }
}

async function runIngest(persist: boolean) {
  if (!selectedCitySlug.value) return
  aiLoading.value = true
  try {
    const res = await dashboardFetch('/api/ingest/content/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        rawText: aiForm.rawText,
        sourceKind: aiForm.sourceKind,
        sourceUrl: aiForm.sourceUrl || null,
        citySlug: selectedCitySlug.value,
        persist,
      }),
    })
    const response = await res.json()
    aiResultText.value = pretty(response)
  } catch (error: any) {
    aiResultText.value = pretty(error?.data || error?.message || error)
  } finally {
    aiLoading.value = false
  }
}
</script>
