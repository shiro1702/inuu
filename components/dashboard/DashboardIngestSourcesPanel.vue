<template>
  <article class="space-y-4 rounded-lg border border-gray-200 bg-white p-4 lg:col-span-2">
    <header class="space-y-1">
      <h2 class="text-lg font-semibold">Источники парсинга (Web + Telegram)</h2>
      <p class="text-xs text-gray-500">
        Web cron и userbot читают whitelist из БД. Strict tags (1 категория + 1–5 тегов из справочника) включены в промпт автоматически — настройте теги в блоке «Ручное добавление новости» ниже.
      </p>
    </header>

    <div v-if="loading" class="text-sm text-gray-600">Загрузка источников...</div>
    <div v-else-if="errorMessage" class="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{{ errorMessage }}</div>

    <template v-if="!loading || webSources.length || telegramSources.length">
      <p v-if="refreshing" class="text-xs text-gray-500">Обновляем список…</p>
      <div class="flex flex-wrap items-center justify-between gap-3 rounded border border-gray-100 bg-gray-50 p-3">
        <div class="flex flex-wrap gap-4">
          <label class="inline-flex items-center gap-2 text-sm text-gray-800">
            <input v-model="prefilterEnabled" type="checkbox" @change="saveIngestSettings" />
            Пре-фильтр до Groq (regex дат/цен + ключевые слова)
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-gray-800">
            <input v-model="rejectPastEventsEnabled" type="checkbox" @change="saveIngestSettings" />
            Не добавлять в очередь события с датой в прошлом
          </label>
        </div>
        <span v-if="ingestSettingsMessage" class="text-xs text-gray-600">{{ ingestSettingsMessage }}</span>
      </div>

      <div class="space-y-3 rounded border border-primary/20 bg-primary/5 p-3">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-900">Массовый парсинг источников</p>
            <p class="text-xs text-gray-600">
              Последовательный обход всех активных web- и Telegram-источников ({{ batchTargets.length }}).
              Запросы идут по одному — страницу можно не закрывать.
            </p>
          </div>
          <button
            type="button"
            class="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            :disabled="batchRunning || !batchTargets.length"
            @click="runAllCrawls"
          >
            {{ batchRunning ? 'Парсим…' : 'Запустить все' }}
          </button>
        </div>

        <div v-if="batchRunning || batchFinished" class="space-y-2">
          <div class="h-2 overflow-hidden rounded-full bg-white/80">
            <div
              class="h-2 rounded-full bg-primary transition-all duration-300"
              :style="{ width: `${batchProgressPercent}%` }"
            />
          </div>
          <p class="text-sm text-gray-800">{{ batchStatusText }}</p>
          <p v-if="batchCurrentLabel" class="font-mono text-xs text-gray-500">{{ batchCurrentLabel }}</p>
          <p v-if="batchFinished && batchSummaryText" class="text-xs text-gray-700">{{ batchSummaryText }}</p>
        </div>
      </div>

      <section class="space-y-3">
        <div class="flex items-center justify-between gap-2">
          <h3 class="text-sm font-semibold text-gray-800">Web-источники (cron)</h3>
          <button type="button" class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="openWebForm()">
            + Добавить сайт
          </button>
        </div>

        <div v-if="!webSources.length" class="text-xs text-gray-500">Нет web-источников. Добавьте URL страницы афиши.</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-left text-xs">
            <thead class="border-b text-gray-500">
              <tr>
                <th class="py-2 pr-3">URL</th>
                <th class="py-2 pr-3">Название</th>
                <th class="py-2 pr-3">Контекст</th>
                <th class="py-2 pr-3">Организация</th>
                <th class="py-2 pr-3">Cron</th>
                <th class="py-2 pr-3">Активен</th>
                <th class="py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in webSources" :key="item.id" class="border-b border-gray-100 align-top">
                <td class="max-w-xs py-2 pr-3 font-mono break-all">{{ item.url }}</td>
                <td class="py-2 pr-3 text-gray-800">{{ item.displayName || '—' }}</td>
                <td class="py-2 pr-3">{{ item.contextType }}</td>
                <td class="py-2 pr-3">
                  <template v-if="item.organization">
                    <a
                      :href="orgPublicUrl(item.organization.slug)"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="font-medium text-primary hover:underline"
                    >{{ item.organization.name }}</a>
                  </template>
                  <span v-else class="text-gray-400">теневая при парсе</span>
                  <span
                    v-if="item.organization && !item.organization.isClaimed"
                    class="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800"
                  >теневая</span>
                </td>
                <td class="py-2 pr-3">{{ item.cronEnabled ? 'да' : 'нет' }}</td>
                <td class="py-2 pr-3">{{ item.isActive ? 'да' : 'нет' }}</td>
                <td class="py-2">
                  <div class="flex flex-wrap gap-1">
                    <button type="button" class="rounded border px-1.5 py-0.5 hover:bg-gray-50" @click="openWebForm(item)">Изм.</button>
                    <button type="button" class="rounded border px-1.5 py-0.5 hover:bg-gray-50" @click="testCrawl(item)">Проверить</button>
                    <button
                      type="button"
                      class="rounded border border-primary/30 bg-primary/5 px-1.5 py-0.5 text-primary hover:bg-primary/10 disabled:opacity-50"
                      :disabled="crawlRunningId === item.id || batchRunning"
                      @click="runCrawl(item)"
                    >{{ crawlRunningId === item.id ? 'Парсим…' : 'Запустить' }}</button>
                    <button
                      v-if="!item.organizationId"
                      type="button"
                      class="rounded border px-1.5 py-0.5 hover:bg-gray-50"
                      @click="createShadowOrg(item)"
                    >Shadow org</button>
                    <button type="button" class="rounded border border-red-200 px-1.5 py-0.5 text-red-700 hover:bg-red-50" @click="deleteWeb(item)">×</button>
                  </div>
                  <p v-if="item.lastCrawledAt" class="mt-1 text-[10px] text-gray-400">crawl: {{ formatDate(item.lastCrawledAt) }}</p>
                  <div
                    v-if="item.parsingStrategy || item.parsingRules || item.rulesValidatedAt"
                    class="mt-2 max-w-md rounded border border-gray-100 bg-gray-50 p-2 text-[10px] text-gray-600"
                  >
                    <p v-if="item.parsingStrategy?.page_type" class="font-medium">
                      strategy: {{ item.parsingStrategy.page_type }}
                      <span v-if="item.parsingStrategy.classified_at" class="text-gray-400">
                        · {{ formatDate(item.parsingStrategy.classified_at) }}
                      </span>
                    </p>
                    <pre v-if="item.parsingRules" class="mt-1 max-h-24 overflow-auto whitespace-pre-wrap">{{ pretty(item.parsingRules) }}</pre>
                    <p v-else-if="item.rulesValidatedAt" class="mt-1 text-gray-500">rules: настроены · {{ formatDate(item.rulesValidatedAt) }}</p>
                    <p v-if="item.rulesValidatedAt && item.parsingRules" class="mt-1 text-gray-400">rules OK: {{ formatDate(item.rulesValidatedAt) }}</p>
                    <div class="mt-1 flex flex-wrap gap-1">
                      <button
                        type="button"
                        class="rounded border border-amber-200 px-1.5 py-0.5 text-amber-800 hover:bg-amber-50"
                        @click="resetWebStrategy(item)"
                      >Сбросить strategy</button>
                      <button
                        v-if="item.parsingRules"
                        type="button"
                        class="rounded border border-amber-200 px-1.5 py-0.5 text-amber-800 hover:bg-amber-50"
                        @click="resetWebRules(item.id)"
                      >Reset rules</button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <pre v-if="testResultText" class="max-h-48 overflow-auto rounded bg-gray-900 p-2 text-[10px] text-gray-100">{{ testResultText }}</pre>
      </section>

      <section v-if="scrapingAlerts.length" class="space-y-2 rounded border border-amber-100 bg-amber-50/50 p-3">
        <h3 class="text-sm font-semibold text-amber-900">Алерты парсинга ({{ scrapingAlerts.length }})</h3>
        <ul class="space-y-2 text-xs">
          <li
            v-for="alert in scrapingAlerts"
            :key="alert.id"
            class="rounded border border-amber-100 bg-white p-2"
          >
            <p class="font-mono break-all text-gray-800">{{ alert.url }}</p>
            <p class="text-amber-800">{{ alert.reason }}</p>
            <p v-if="alert.eventTitle" class="mt-1 text-gray-700">
              Событие:
              <NuxtLink
                v-if="alert.eventSlug"
                :to="`/${citySlug}/events/${alert.eventSlug}`"
                class="font-medium text-primary hover:underline"
                target="_blank"
              >{{ alert.eventTitle }}</NuxtLink>
              <span v-else>{{ alert.eventTitle }}</span>
            </p>
            <p v-if="alert.snapshot" class="mt-1 line-clamp-2 text-gray-500">{{ alert.snapshot }}</p>
            <div class="mt-2 flex flex-wrap gap-1">
              <button
                type="button"
                class="rounded border px-1.5 py-0.5 hover:bg-gray-50"
                @click="resolveAlert(alert)"
              >Resolve</button>
              <button
                v-if="alert.webSourceId"
                type="button"
                class="rounded border px-1.5 py-0.5 hover:bg-gray-50"
                @click="resetWebRules(alert.webSourceId)"
              >Reset rules</button>
            </div>
          </li>
        </ul>
      </section>

      <section class="space-y-3 border-t border-gray-100 pt-4">
        <div class="flex items-center justify-between gap-2">
          <div>
            <h3 class="text-sm font-semibold text-gray-800">Telegram-источники (userbot)</h3>
            <p class="text-[10px] text-gray-500">Userbot читает `city_telegram_sources`. «TG parser source chats» выше — legacy chat id.</p>
          </div>
          <button type="button" class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-gray-50" @click="openTgForm()">
            + Добавить канал
          </button>
        </div>

        <div v-if="!telegramSources.length" class="text-xs text-gray-500">Нет TG-источников.</div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-left text-xs">
            <thead class="border-b text-gray-500">
              <tr>
                <th class="py-2 pr-3">@channel</th>
                <th class="py-2 pr-3">Контекст</th>
                <th class="py-2 pr-3">Организация</th>
                <th class="py-2 pr-3">Активен</th>
                <th class="py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in telegramSources" :key="item.id" class="border-b border-gray-100 align-top">
                <td class="py-2 pr-3 font-mono">@{{ item.sourceKey }}</td>
                <td class="py-2 pr-3">{{ item.contextType }}</td>
                <td class="py-2 pr-3">
                  <span v-if="item.organization">{{ item.organization.name }}</span>
                  <span v-else class="text-gray-400">—</span>
                </td>
                <td class="py-2 pr-3">{{ item.isActive ? 'да' : 'нет' }}</td>
                <td class="py-2">
                  <div class="flex flex-wrap gap-1">
                    <button type="button" class="rounded border px-1.5 py-0.5 hover:bg-gray-50" @click="openTgForm(item)">Изм.</button>
                    <button type="button" class="rounded border border-red-200 px-1.5 py-0.5 text-red-700 hover:bg-red-50" @click="deleteTg(item)">×</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>

    <div v-if="webFormOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="webFormOpen = false">
      <div class="w-full max-w-lg space-y-3 rounded-lg bg-white p-4 shadow-lg">
        <h4 class="font-semibold">{{ webForm.id ? 'Редактировать web-источник' : 'Новый web-источник' }}</h4>
        <label class="block space-y-1 text-sm">
          <span>URL афиши</span>
          <input v-model="webForm.url" class="w-full rounded border px-3 py-2 font-mono text-xs" placeholder="https://..." />
        </label>
        <label class="block space-y-1 text-sm">
          <span>Название источника</span>
          <input
            v-model="webForm.displayName"
            class="w-full rounded border px-3 py-2 text-sm"
            placeholder="STANDUP2U, Telegram @standuuup2u"
          />
          <span class="text-xs text-gray-500">Для теневой org и подписи «Источник» на сайте. Для t.me можно оставить пустым — подставится канал из URL.</span>
        </label>
        <label class="block space-y-1 text-sm">
          <span>Контекст для Groq</span>
          <select v-model="webForm.contextType" class="w-full rounded border px-3 py-2">
            <option v-for="ctx in contextTypes" :key="ctx" :value="ctx">{{ ctx }}</option>
          </select>
        </label>
        <label class="block space-y-1 text-sm">
          <span>Организация</span>
          <select v-model="webForm.organizationId" class="w-full rounded border px-3 py-2">
            <option value="">Теневая org при первом парсе</option>
            <option v-for="shop in shops" :key="shop.id" :value="shop.id">
              {{ shop.name }}{{ shop.isClaimed ? '' : ' (теневая)' }}
            </option>
          </select>
        </label>
        <label class="inline-flex items-center gap-2 text-sm"><input v-model="webForm.cronEnabled" type="checkbox" /> Cron enabled</label>
        <label class="inline-flex items-center gap-2 text-sm"><input v-model="webForm.isActive" type="checkbox" /> Активен</label>
        <label class="block space-y-1 text-sm">
          <span>Notes</span>
          <input v-model="webForm.notes" class="w-full rounded border px-3 py-2 text-xs" />
        </label>
        <div class="flex justify-end gap-2">
          <button type="button" class="rounded border px-3 py-1.5 text-sm" @click="webFormOpen = false">Отмена</button>
          <button type="button" class="rounded bg-primary px-3 py-1.5 text-sm text-white" @click="saveWebForm">Сохранить</button>
        </div>
      </div>
    </div>

    <div v-if="tgFormOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" @click.self="tgFormOpen = false">
      <div class="w-full max-w-lg space-y-3 rounded-lg bg-white p-4 shadow-lg">
        <h4 class="font-semibold">{{ tgForm.id ? 'Редактировать TG-источник' : 'Новый TG-источник' }}</h4>
        <label class="block space-y-1 text-sm">
          <span>@username (без @)</span>
          <input v-model="tgForm.sourceKey" class="w-full rounded border px-3 py-2 font-mono text-xs" placeholder="standup_uu" />
        </label>
        <label class="block space-y-1 text-sm">
          <span>Контекст</span>
          <select v-model="tgForm.contextType" class="w-full rounded border px-3 py-2">
            <option v-for="ctx in contextTypes" :key="ctx" :value="ctx">{{ ctx }}</option>
          </select>
        </label>
        <label class="block space-y-1 text-sm">
          <span>Организация</span>
          <select v-model="tgForm.organizationId" class="w-full rounded border px-3 py-2">
            <option value="">Не привязана</option>
            <option v-for="shop in shops" :key="shop.id" :value="shop.id">{{ shop.name }}</option>
          </select>
        </label>
        <label class="inline-flex items-center gap-2 text-sm"><input v-model="tgForm.isActive" type="checkbox" /> Активен</label>
        <label class="block space-y-1 text-sm">
          <span>Notes</span>
          <input v-model="tgForm.notes" class="w-full rounded border px-3 py-2 text-xs" />
        </label>
        <div class="flex justify-end gap-2">
          <button type="button" class="rounded border px-3 py-1.5 text-sm" @click="tgFormOpen = false">Отмена</button>
          <button type="button" class="rounded bg-primary px-3 py-1.5 text-sm text-white" @click="saveTgForm">Сохранить</button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{ citySlug: string }>()
const { dashboardFetch } = useDashboardFetch()
const { getCached, fetchIngestSources, invalidate } = useContentAiIngestSources()

type ShopItem = { id: string; slug: string; name: string; isClaimed: boolean }
type SourceOrg = ShopItem | null
type ParsingStrategy = {
  page_type?: string
  classified_at?: string | null
  list_link_pattern?: string | null
  confidence?: number | null
}
type ParsingRules = {
  page_type?: string | null
  selectors?: Record<string, string | null> | null
  list_link_pattern?: string | null
}
type WebSource = {
  id: string
  url: string
  displayName: string | null
  contextType: string
  organizationId: string | null
  organization: SourceOrg
  cronEnabled: boolean
  isActive: boolean
  lastCrawledAt: string | null
  notes: string | null
  parsingStrategy: ParsingStrategy | null
  parsingRules: ParsingRules | null
  rulesValidatedAt: string | null
}
type TgSource = {
  id: string
  sourceKey: string
  contextType: string
  organizationId: string | null
  organization: SourceOrg
  isActive: boolean
  notes: string | null
}

const loading = ref(false)
const refreshing = ref(false)
const errorMessage = ref('')
const prefilterEnabled = ref(true)
const rejectPastEventsEnabled = ref(true)
const ingestSettingsMessage = ref('')
const contextTypes = ref<string[]>([])
const webSources = ref<WebSource[]>([])
const telegramSources = ref<TgSource[]>([])
const shops = ref<ShopItem[]>([])
const testResultText = ref('')
const crawlRunningId = ref('')

type BatchTargetKind = 'web' | 'telegram'
type BatchTarget = {
  kind: BatchTargetKind
  id: string
  label: string
}

type BatchItemResult = {
  target: BatchTarget
  ok: boolean
  skipped: boolean
  message: string
}

const batchRunning = ref(false)
const batchFinished = ref(false)
const batchCurrentIndex = ref(0)
const batchStatusText = ref('')
const batchCurrentLabel = ref('')
const batchSummaryText = ref('')
const batchResults = ref<BatchItemResult[]>([])

const batchTargets = computed<BatchTarget[]>(() => {
  const web = webSources.value
    .filter((item) => item.isActive)
    .map((item) => ({
      kind: 'web' as const,
      id: item.id,
      label: item.displayName || item.url,
    }))
  const telegram = telegramSources.value
    .filter((item) => item.isActive)
    .map((item) => ({
      kind: 'telegram' as const,
      id: item.id,
      label: `@${item.sourceKey}`,
    }))
  return [...web, ...telegram]
})

const batchProgressPercent = computed(() => {
  const total = batchTargets.value.length
  if (!total) return 0
  if (batchFinished.value) return 100
  if (!batchRunning.value) return 0
  return Math.round((batchCurrentIndex.value / total) * 100)
})
type ScrapingAlert = {
  id: string
  webSourceId: string | null
  webSourceUrl: string | null
  eventId: string | null
  eventSlug: string | null
  eventTitle: string | null
  url: string
  reason: string
  snapshot: string | null
  createdAt: string
}
const scrapingAlerts = ref<ScrapingAlert[]>([])

const webFormOpen = ref(false)
const webForm = ref({
  id: '',
  url: '',
  displayName: '',
  contextType: 'general',
  organizationId: '',
  cronEnabled: false,
  isActive: true,
  notes: '',
})

const tgFormOpen = ref(false)
const tgForm = ref({
  id: '',
  sourceKey: '',
  contextType: 'general',
  organizationId: '',
  isActive: true,
  notes: '',
})

function formatDate(value: string): string {
  try {
    return new Date(value).toLocaleString('ru-RU')
  } catch {
    return value
  }
}

function orgPublicUrl(orgSlug: string): string {
  return `/${props.citySlug}/organizations/${orgSlug}`
}

function pretty(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

async function ensureShopsLoaded() {
  if (!props.citySlug || shops.value.length) return
  const res = await dashboardFetch(`/api/dashboard/manager/cities/${props.citySlug}/ingest-sources?alerts=0&shops=1`)
  const payload = await res.json() as { ok?: boolean; shops?: ShopItem[] }
  if (payload.ok && payload.shops) {
    shops.value = payload.shops
  }
}

function applySourcesPayload(payload: ReturnType<typeof getCached>) {
  if (!payload) return
  contextTypes.value = payload.contextTypes
  webSources.value = payload.webSources as WebSource[]
  telegramSources.value = payload.telegramSources as TgSource[]
  prefilterEnabled.value = payload.ingestSettings?.prefilter_enabled !== false
  rejectPastEventsEnabled.value = payload.ingestSettings?.reject_past_events_enabled !== false
  scrapingAlerts.value = payload.alerts as ScrapingAlert[]
}

async function loadSources(options?: { force?: boolean }) {
  if (!props.citySlug) return

  const cached = getCached(props.citySlug)
  if (cached && !options?.force) {
    applySourcesPayload(cached)
  }

  if (!cached) {
    loading.value = true
  } else if (options?.force) {
    refreshing.value = true
  }
  errorMessage.value = ''

  try {
    const payload = await fetchIngestSources(props.citySlug, { force: options?.force })
    applySourcesPayload(payload)
  } catch (err: any) {
    if (!cached) {
      errorMessage.value = err?.message || 'Ошибка загрузки'
    }
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

async function saveIngestSettings() {
  if (!props.citySlug) return
  ingestSettingsMessage.value = 'Сохраняем...'
  try {
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${props.citySlug}/content-settings`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        prefilterEnabled: prefilterEnabled.value,
        rejectPastEventsEnabled: rejectPastEventsEnabled.value,
      }),
    })
    const payload = await res.json()
    if (!payload.ok) throw new Error(payload.message || 'Save failed')
    ingestSettingsMessage.value = 'Сохранено'
  } catch (err: any) {
    ingestSettingsMessage.value = err?.message || 'Ошибка'
  }
}

function openWebForm(item?: WebSource) {
  void ensureShopsLoaded()
  webForm.value = {
    id: item?.id || '',
    url: item?.url || '',
    displayName: item?.displayName || '',
    contextType: item?.contextType || 'general',
    organizationId: item?.organizationId || '',
    cronEnabled: item?.cronEnabled ?? false,
    isActive: item?.isActive ?? true,
    notes: item?.notes || '',
  }
  webFormOpen.value = true
}

async function saveWebForm() {
  const body = {
    url: webForm.value.url,
    displayName: webForm.value.displayName.trim() || null,
    contextType: webForm.value.contextType,
    organizationId: webForm.value.organizationId || null,
    cronEnabled: webForm.value.cronEnabled,
    isActive: webForm.value.isActive,
    notes: webForm.value.notes || null,
  }
  const isEdit = !!webForm.value.id
  const url = isEdit
    ? `/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/web/${webForm.value.id}`
    : `/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/web`
  const res = await dashboardFetch(url, {
    method: isEdit ? 'PUT' : 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    errorMessage.value = err?.statusMessage || 'Не удалось сохранить web-источник'
    return
  }
  webFormOpen.value = false
  invalidate(props.citySlug)
  await loadSources({ force: true })
}

async function deleteWeb(item: WebSource) {
  if (!confirm(`Удалить ${item.url}?`)) return
  await dashboardFetch(`/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/web/${item.id}`, { method: 'DELETE' })
  invalidate(props.citySlug)
  await loadSources({ force: true })
}

async function testCrawl(item: WebSource) {
  testResultText.value = 'Запуск test crawl (без очереди)...'
  const res = await dashboardFetch(`/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/web/${item.id}/test-crawl`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({}),
  })
  const payload = await res.json()
  if (!res.ok) {
    errorMessage.value = payload?.statusMessage || 'Test crawl failed'
  }
  testResultText.value = pretty(payload)
  invalidate(props.citySlug)
  await loadSources({ force: true })
}

function describeCrawlPayload(payload: Record<string, unknown>): string {
  if (payload.ok) {
    if (payload.ingestProcessed) return 'Добавлено в очередь модерации'
    if (payload.skipped) {
      const reason = String(payload.skipReason || payload.hint || 'пропущено')
      return `Пропущено: ${reason}`
    }
    return String(payload.hint || 'Готово')
  }
  return String(payload.hint || payload.error || payload.statusMessage || 'Ошибка парсинга')
}

function resetBatchState() {
  batchFinished.value = false
  batchCurrentIndex.value = 0
  batchStatusText.value = ''
  batchCurrentLabel.value = ''
  batchSummaryText.value = ''
  batchResults.value = []
}

async function runAllCrawls() {
  const targets = batchTargets.value
  if (!targets.length || batchRunning.value) return

  const webCount = targets.filter((item) => item.kind === 'web').length
  const tgCount = targets.filter((item) => item.kind === 'telegram').length
  const parts = [
    webCount ? `${webCount} web` : '',
    tgCount ? `${tgCount} Telegram` : '',
  ].filter(Boolean)
  const msg = `Запустить парсинг всех активных источников (${parts.join(' + ')})?\n\nИсточники обрабатываются по очереди. Это может занять несколько минут.`
  if (!confirm(msg)) return

  resetBatchState()
  batchRunning.value = true
  errorMessage.value = ''
  testResultText.value = ''

  const results: BatchItemResult[] = []

  for (let index = 0; index < targets.length; index += 1) {
    const target = targets[index]
    batchCurrentIndex.value = index + 1
    batchCurrentLabel.value = `${target.kind === 'web' ? 'Web' : 'Telegram'} · ${target.label}`
    batchStatusText.value = `Источник ${index + 1} из ${targets.length} — отправляем запрос…`

    const endpoint = target.kind === 'web'
      ? `/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/web/${target.id}/run-crawl`
      : `/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/telegram/${target.id}/run-crawl`

    try {
      const res = await dashboardFetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(target.kind === 'web' ? { createShadowOrg: true } : {}),
      })
      const payload = await res.json().catch(() => ({})) as Record<string, unknown>
      const message = describeCrawlPayload(payload)
      const ok = res.ok && payload.ok !== false
      results.push({ target, ok, skipped: payload.skipped === true, message })
      batchStatusText.value = `Источник ${index + 1} из ${targets.length} — ${message}`
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Сетевая ошибка'
      results.push({ target, ok: false, skipped: false, message })
      batchStatusText.value = `Источник ${index + 1} из ${targets.length} — ${message}`
    }
  }

  batchCurrentIndex.value = targets.length
  batchResults.value = results
  batchRunning.value = false
  batchFinished.value = true
  batchCurrentLabel.value = ''

  const processed = results.filter((item) => item.ok && !item.skipped).length
  const skipped = results.filter((item) => item.skipped).length
  const failed = results.filter((item) => !item.ok).length
  batchSummaryText.value = `Готово: ${processed} с новыми submission, ${skipped} пропущено, ${failed} с ошибкой.`
  batchStatusText.value = 'Обход всех источников завершён'
  testResultText.value = pretty(results.map((item) => ({
    source: item.target.label,
    kind: item.target.kind,
    ok: item.ok,
    skipped: item.skipped,
    message: item.message,
  })))

  invalidate(props.citySlug)
  await loadSources({ force: true })
}

async function runCrawl(item: WebSource) {
  const msg = item.organizationId
    ? `Запустить парсер для ${item.url}?\n\nСоздастся submission в очередь модерации (как ночной cron).`
    : `Запустить парсер для ${item.url}?\n\nБудет создана теневая организация и submission в очередь модерации.`
  if (!confirm(msg)) return

  crawlRunningId.value = item.id
  testResultText.value = 'Ручной запуск парсера (persist)...'
  errorMessage.value = ''
  try {
    const res = await dashboardFetch(`/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/web/${item.id}/run-crawl`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ createShadowOrg: true }),
    })
    const payload = await res.json()
    if (!res.ok) {
      errorMessage.value = payload?.statusMessage || payload?.hint || 'Не удалось запустить парсер'
    } else if (payload.ok === false) {
      errorMessage.value = payload.hint || payload.error || 'Парсер не создал submission'
    } else {
      errorMessage.value = ''
    }
    if (payload.ok && payload.source?.organization?.slug) {
      const org = payload.source.organization
      testResultText.value = `${pretty(payload)}\n\nОрганизация: ${org.name}\n${window.location.origin}${orgPublicUrl(org.slug)}`
    } else {
      testResultText.value = pretty(payload)
    }
    invalidate(props.citySlug)
    await loadSources({ force: true })
  } catch (err: unknown) {
    errorMessage.value = err instanceof Error ? err.message : 'Ошибка запуска'
  } finally {
    crawlRunningId.value = ''
  }
}

async function createShadowOrg(item: WebSource) {
  const res = await dashboardFetch(`/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/web/${item.id}/create-shadow-org`, {
    method: 'POST',
  })
  const payload = await res.json()
  if (payload.ok && payload.organization?.slug) {
    const url = orgPublicUrl(payload.organization.slug)
    testResultText.value = `Организация: ${payload.organization.name}\n${window.location.origin}${url}`
  } else {
    testResultText.value = pretty(payload)
  }
  invalidate(props.citySlug)
  await loadSources({ force: true })
}

async function resetWebStrategy(item: WebSource) {
  if (!confirm('Сбросить parsing_strategy и parsing_rules для этого источника?')) return
  const res = await dashboardFetch(
    `/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/web/${item.id}/reset-strategy`,
    { method: 'POST' },
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    errorMessage.value = err?.statusMessage || 'Не удалось сбросить strategy'
    return
  }
  invalidate(props.citySlug)
  await loadSources({ force: true })
}

async function resetWebRules(webSourceId: string) {
  if (!confirm('Сбросить parsing_rules?')) return
  const res = await dashboardFetch(
    `/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/web/${webSourceId}/reset-rules`,
    { method: 'POST' },
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    errorMessage.value = err?.statusMessage || 'Не удалось сбросить rules'
    return
  }
  invalidate(props.citySlug)
  await loadSources({ force: true })
}

async function resolveAlert(alert: ScrapingAlert) {
  const res = await dashboardFetch(
    `/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/scraping-alerts/${alert.id}/resolve`,
    { method: 'POST' },
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    errorMessage.value = err?.statusMessage || 'Не удалось закрыть alert'
    return
  }
  invalidate(props.citySlug)
  await loadSources({ force: true })
}

function openTgForm(item?: TgSource) {
  void ensureShopsLoaded()
  tgForm.value = {
    id: item?.id || '',
    sourceKey: item?.sourceKey || '',
    contextType: item?.contextType || 'general',
    organizationId: item?.organizationId || '',
    isActive: item?.isActive ?? true,
    notes: item?.notes || '',
  }
  tgFormOpen.value = true
}

async function saveTgForm() {
  const body = {
    sourceKey: tgForm.value.sourceKey,
    contextType: tgForm.value.contextType,
    organizationId: tgForm.value.organizationId || null,
    isActive: tgForm.value.isActive,
    notes: tgForm.value.notes || null,
  }
  const isEdit = !!tgForm.value.id
  const url = isEdit
    ? `/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/telegram/${tgForm.value.id}`
    : `/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/telegram`
  const res = await dashboardFetch(url, {
    method: isEdit ? 'PUT' : 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    errorMessage.value = err?.statusMessage || 'Не удалось сохранить TG-источник'
    return
  }
  tgFormOpen.value = false
  invalidate(props.citySlug)
  await loadSources({ force: true })
}

async function deleteTg(item: TgSource) {
  if (!confirm(`Удалить @${item.sourceKey}?`)) return
  await dashboardFetch(`/api/dashboard/manager/cities/${props.citySlug}/ingest-sources/telegram/${item.id}`, { method: 'DELETE' })
  invalidate(props.citySlug)
  await loadSources({ force: true })
}

watch(() => props.citySlug, () => {
  resetBatchState()
  if (props.citySlug) void loadSources()
}, { immediate: true })
</script>
