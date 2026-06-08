<template>
  <article class="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-lg font-semibold">Очередь контента (модерация)</h2>
      <div class="flex items-center gap-2">
        <select v-model="queueStatus" class="rounded-lg border border-gray-300 px-2 py-1 text-sm" @change="loadQueue">
          <option value="pending">pending</option>
          <option value="needs_revision">needs_revision</option>
          <option value="approved">approved</option>
          <option value="rejected">rejected</option>
          <option value="all">all</option>
        </select>
        <select v-model="queueKind" class="rounded-lg border border-gray-300 px-2 py-1 text-sm" @change="loadQueue">
          <option value="">все типы</option>
          <option value="event">события</option>
          <option value="event_digest">digest-пакеты</option>
        </select>
        <button class="rounded border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50" @click="loadQueue">Обновить</button>
      </div>
    </div>
    <p v-if="queueMessage" class="text-sm text-gray-700">{{ queueMessage }}</p>
    <div v-if="!queueItems.length" class="rounded border border-dashed border-gray-300 p-3 text-sm text-gray-600">
      Очередь пуста или еще не создана таблица `content_submissions`.
    </div>
    <div v-else class="space-y-3">
      <article v-for="item in queueItems" :key="item.id" class="rounded border border-gray-200 p-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p class="text-sm font-medium">
              <span v-if="item.kind === 'event_digest' || item.batchRole === 'batch'" class="mr-1 rounded bg-violet-100 px-1.5 py-0.5 text-xs text-violet-800">digest</span>
              {{ item.payload?.title || item.payload?.digest?.title || (item.eventsCount ? `Пакет · ${item.eventsCount} событий` : 'Без заголовка') }}
            </p>
            <p class="font-mono text-xs text-gray-500">{{ item.id }}</p>
            <p class="text-xs text-gray-600">
              status: {{ item.status }} · kind: {{ item.kind }} · score: {{ item.editorialScore ?? '—' }} · откуда: {{ item.sourceIntakeLabel ?? item.sourceKind ?? '—' }}
              <span v-if="item.batchRole"> · batch: {{ item.batchRole }}<span v-if="item.batchIndex != null"> #{{ item.batchIndex }}</span></span>
            </p>
            <ul v-if="item.batchRole === 'batch' && Array.isArray(item.payload?.events)" class="mt-2 space-y-0.5 text-xs text-gray-600">
              <li v-for="(ev, idx) in item.payload.events.slice(0, 8)" :key="idx">
                {{ idx + 1 }}. {{ ev.title }} · {{ (ev.recurrence?.dates?.[0] || '—').slice(0, 16) }}
              </li>
              <li v-if="item.payload.events.length > 8" class="text-gray-400">… ещё {{ item.payload.events.length - 8 }}</li>
            </ul>
            <p v-if="item.payload?.description_short" class="mt-1 text-xs text-gray-600">
              <span class="font-medium">Кратко:</span> {{ item.payload.description_short }}
            </p>
            <p v-if="item.payload?.description_full" class="mt-1 text-xs text-gray-500 line-clamp-3">
              <span class="font-medium">Полностью:</span> {{ item.payload.description_full }}
            </p>
            <img
              v-if="item.payload?.cover_media_url"
              :src="item.payload.cover_media_url"
              alt=""
              class="mt-2 max-h-24 rounded border border-gray-200 object-cover"
            />
          </div>
          <div class="flex flex-wrap gap-2">
            <button class="rounded border border-green-300 px-2 py-1 text-xs text-green-700 hover:bg-green-50" @click="queueAction(item.id, 'approve')">Approve</button>
            <button class="rounded border border-amber-300 px-2 py-1 text-xs text-amber-700 hover:bg-amber-50" @click="queueAction(item.id, 'needs_revision')">Need revision</button>
            <button class="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50" @click="queueAction(item.id, 'reject')">Reject</button>
            <button class="rounded border border-blue-300 px-2 py-1 text-xs text-blue-700 hover:bg-blue-50" @click="notifyQueueTelegram(item.id)">В TG чат</button>
            <button
              v-if="item.status === 'approved'"
              class="rounded border border-indigo-300 px-2 py-1 text-xs text-indigo-700 hover:bg-indigo-50"
              @click="publishQueueToSite(item.id)"
            >
              На сайт
            </button>
          </div>
        </div>
        <div v-if="item.batchRole !== 'batch'" class="mt-3 grid gap-2 md:grid-cols-2">
          <label class="space-y-1 text-xs">
            <span class="font-medium text-gray-700">Title</span>
            <input v-model="queueEdits[item.id].title" class="w-full rounded border border-gray-300 px-2 py-1 text-sm" />
          </label>
          <div v-if="selectedCitySlug" class="space-y-1 text-xs">
            <DashboardTaxonomyPicker
              v-model="queueEdits[item.id].categorySlug"
              :city-slug="selectedCitySlug"
              kind="category"
              label="Категория"
              placeholder="Поиск категории…"
            />
          </div>
          <label class="space-y-1 text-xs md:col-span-2">
            <span class="font-medium text-gray-700">Краткое описание</span>
            <textarea v-model="queueEdits[item.id].descriptionShort" rows="2" class="w-full rounded border border-gray-300 px-2 py-1 text-sm" />
          </label>
          <label class="space-y-1 text-xs md:col-span-2">
            <span class="font-medium text-gray-700">Полное описание</span>
            <textarea v-model="queueEdits[item.id].descriptionFull" rows="4" class="w-full rounded border border-gray-300 px-2 py-1 text-sm" />
          </label>
          <label class="space-y-1 text-xs">
            <span class="font-medium text-gray-700">Registration URL</span>
            <input v-model="queueEdits[item.id].registrationUrl" class="w-full rounded border border-gray-300 px-2 py-1 text-sm" />
          </label>
          <div v-if="selectedCitySlug" class="space-y-1 text-xs md:col-span-2">
            <DashboardTaxonomyPicker
              v-model="queueEdits[item.id].topicTags"
              :city-slug="selectedCitySlug"
              kind="tags"
              label="Теги"
              placeholder="Поиск или новый тег…"
            />
          </div>
        </div>
        <div class="mt-2 flex flex-wrap items-center gap-2">
          <button class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="saveQueueEdit(item.id)">Save edit</button>
          <button
            v-for="score in [1,2,3,4,5]"
            :key="`${item.id}-score-${score}`"
            class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50"
            @click="queueAction(item.id, 'score', score)"
          >
            ⭐{{ score }}
          </button>
        </div>
      </article>
    </div>
  </article>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'

definePageMeta({ layout: 'dashboard-content-ai' })

const { dashboardFetch } = useDashboardFetch()
const { selectedCitySlug } = useContentAiCity()

const queueStatus = ref('pending')
const queueKind = ref('')
const queueItems = ref<any[]>([])
const queueMessage = ref('')
const queueEdits = reactive<Record<string, {
  title: string
  descriptionShort: string
  descriptionFull: string
  categorySlug: string
  registrationUrl: string
  topicTags: string[]
}>>({})

function hydrateQueueEdit(item: any) {
  const p = item?.payload || {}
  queueEdits[item.id] = {
    title: String(p.title || ''),
    descriptionShort: String(p.description_short || p.description || '').slice(0, 280),
    descriptionFull: String(p.description_full || p.description || ''),
    categorySlug: String(item?.payload?.category_slug || ''),
    registrationUrl: String(item?.payload?.registration_url || ''),
    topicTags: Array.isArray(item?.payload?.topic_tags)
      ? item.payload.topic_tags.map((x: unknown) => String(x || '').trim()).filter(Boolean)
      : [],
  }
}

async function loadQueue() {
  if (!selectedCitySlug.value) return
  queueMessage.value = ''
  try {
    const kindQuery = queueKind.value ? `&kind=${encodeURIComponent(queueKind.value)}` : ''
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/content-queue?status=${encodeURIComponent(queueStatus.value)}&limit=50${kindQuery}`)
    const payload = await res.json() as any
    if (!res.ok) {
      queueItems.value = []
      queueMessage.value = res.status === 401
        ? 'Сессия истекла — войдите в кабинет снова (/dashboard/login).'
        : (payload?.statusMessage || payload?.message || `Ошибка ${res.status}`)
      return
    }
    queueItems.value = payload?.ok ? payload.items || [] : []
    for (const item of queueItems.value) hydrateQueueEdit(item)
    if (!payload?.ok && payload?.message) {
      queueMessage.value = payload.message
    }
  } catch (error: any) {
    queueItems.value = []
    queueMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось загрузить очередь'
  }
}

async function queueAction(submissionId: string, action: 'approve' | 'reject' | 'needs_revision' | 'score', score?: number) {
  if (!selectedCitySlug.value) return
  queueMessage.value = ''
  try {
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/content-queue/action`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ submissionId, action, score }),
    })
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) throw new Error(payload?.statusMessage || payload?.message || 'Action failed')
    if (action === 'approve' && payload?.published?.entitySlug) {
      const path = payload.published.publicPath || ''
      queueMessage.value = payload.published.alreadyPublished
        ? `Уже опубликовано: ${path || payload.published.entitySlug}`
        : `Опубликовано на сайте${path ? `: ${path}` : ''}`
    } else if (action === 'approve') {
      queueMessage.value = 'Одобрено и опубликовано'
    } else {
      queueMessage.value = `Действие ${action} применено`
    }
    await loadQueue()
  } catch (error: any) {
    queueMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось выполнить действие'
  }
}

async function publishQueueToSite(submissionId: string) {
  if (!selectedCitySlug.value) return
  queueMessage.value = ''
  try {
    const res = await dashboardFetch(
      `/api/dashboard/manager/cities/${selectedCitySlug.value}/content-queue/${submissionId}/publish`,
      { method: 'POST' },
    )
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) {
      throw new Error(payload?.statusMessage || payload?.message || 'Не удалось опубликовать')
    }
    const path = payload?.published?.publicPath
    queueMessage.value = payload?.published?.alreadyPublished
      ? `Уже на сайте${path ? `: ${path}` : ''}`
      : `Опубликовано${path ? `: ${path}` : ''}`
    await loadQueue()
  } catch (error: any) {
    queueMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка публикации на сайт'
  }
}

async function notifyQueueTelegram(submissionId: string) {
  if (!selectedCitySlug.value) return
  queueMessage.value = ''
  try {
    const res = await dashboardFetch(
      `/api/dashboard/manager/cities/${selectedCitySlug.value}/content-queue/${submissionId}/notify-telegram`,
      { method: 'POST' },
    )
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) {
      throw new Error(payload?.statusMessage || payload?.message || 'Не удалось отправить в Telegram')
    }
    queueMessage.value = 'Карточка с кнопками отправлена в TG manager/moderation чаты'
  } catch (error: any) {
    queueMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка отправки в Telegram'
  }
}

async function saveQueueEdit(submissionId: string) {
  if (!selectedCitySlug.value) return
  queueMessage.value = ''
  const edit = queueEdits[submissionId]
  if (!edit) return
  try {
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${selectedCitySlug.value}/content-queue/${submissionId}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: edit.title,
        descriptionShort: edit.descriptionShort,
        descriptionFull: edit.descriptionFull,
        categorySlug: edit.categorySlug,
        registrationUrl: edit.registrationUrl,
        topicTags: edit.topicTags,
      }),
    })
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) throw new Error(payload?.statusMessage || payload?.message || 'Save failed')
    queueMessage.value = 'Изменения сохранены'
    await loadQueue()
  } catch (error: any) {
    queueMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось сохранить правки'
  }
}

watch(selectedCitySlug, () => {
  void loadQueue()
})

onMounted(() => {
  if (selectedCitySlug.value) void loadQueue()
})
</script>
