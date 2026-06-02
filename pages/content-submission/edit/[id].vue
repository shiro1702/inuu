<template>
  <section class="mx-auto min-h-screen max-w-lg bg-gray-50 px-4 py-4 pb-24">
    <header class="mb-4">
      <p class="text-xs font-medium uppercase tracking-wide text-gray-500">Редактирование заявки</p>
      <p v-if="submissionId" class="mt-1 font-mono text-xs text-gray-500">ID: {{ submissionId }}</p>
      <h1 class="text-lg font-semibold text-gray-900">{{ form.title || 'Без заголовка' }}</h1>
      <p v-if="cityName" class="text-sm text-gray-600">{{ cityName }}</p>
      <p v-if="statusLabel" class="mt-1 text-xs text-gray-500">Статус: {{ statusLabel }}</p>
    </header>

    <p v-if="loading" class="text-sm text-gray-600">Загрузка…</p>
    <p v-else-if="errorText" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
      {{ errorText }}
    </p>

    <form v-else class="space-y-4" @submit.prevent="save">
      <label class="block space-y-1 text-sm">
        <span class="font-medium text-gray-700">Заголовок</span>
        <input
          v-model="form.title"
          type="text"
          required
          class="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </label>

      <label class="block space-y-1 text-sm">
        <span class="font-medium text-gray-700">Краткое описание (карточка)</span>
        <textarea
          v-model="form.descriptionShort"
          rows="3"
          class="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </label>

      <label class="block space-y-1 text-sm">
        <span class="font-medium text-gray-700">Полное описание (страница)</span>
        <textarea
          v-model="form.descriptionFull"
          rows="6"
          class="w-full rounded-lg border border-gray-300 px-3 py-2"
        />
      </label>

      <fieldset class="space-y-3">
        <legend class="text-sm font-medium text-gray-700">Афиша</legend>
        <CityEventMediaCarousel :urls="previewGalleryUrls" :alt="form.title || 'Афиша события'" />
        <label class="block space-y-1 text-sm">
          <span class="text-gray-600">URL обложки</span>
          <input
            v-model="form.coverMediaUrl"
            type="url"
            class="w-full rounded-lg border border-gray-300 px-3 py-2"
            placeholder="https://…"
          />
        </label>
        <div v-if="form.mediaUrls.length" class="space-y-2">
          <p class="text-xs text-gray-500">Дополнительные фото в карусели</p>
          <div
            v-for="(_, index) in form.mediaUrls"
            :key="index"
            class="flex gap-2"
          >
            <input
              v-model="form.mediaUrls[index]"
              type="url"
              class="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="https://…"
            />
            <button
              type="button"
              class="shrink-0 rounded-lg border border-gray-300 px-2 text-sm text-gray-600"
              @click="removeMediaUrl(index)"
            >
              Удалить
            </button>
          </div>
        </div>
        <button
          type="button"
          class="text-sm text-primary hover:underline"
          @click="addMediaUrl"
        >
          + Добавить фото
        </button>
      </fieldset>

      <DashboardTaxonomyPicker
        v-if="citySlug"
        v-model="form.categorySlug"
        :city-slug="citySlug"
        kind="category"
        label="Категория"
        placeholder="Поиск категории…"
        :moderation-submission-id="submissionId"
        :fetch-headers="authHeaders"
      />

      <DashboardTaxonomyPicker
        v-if="citySlug"
        v-model="form.topicTags"
        :city-slug="citySlug"
        kind="tags"
        label="Теги"
        placeholder="Поиск или новый тег…"
        :moderation-submission-id="submissionId"
        :fetch-headers="authHeaders"
      />

      <label class="block space-y-1 text-sm">
        <span class="font-medium text-gray-700">Ссылка на запись</span>
        <input
          v-model="form.registrationUrl"
          type="url"
          class="w-full rounded-lg border border-gray-300 px-3 py-2"
          placeholder="https://…"
        />
      </label>

      <fieldset class="space-y-2">
        <legend class="text-sm font-medium text-gray-700">Важность в ленте (1–5)</legend>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="score in [1, 2, 3, 4, 5]"
            :key="score"
            type="button"
            class="rounded-lg border px-3 py-2 text-sm"
            :class="form.editorialScore === score ? 'border-primary bg-primary/10 text-primary' : 'border-gray-300 bg-white'"
            @click="form.editorialScore = score"
          >
            ⭐{{ score }}
          </button>
          <button
            type="button"
            class="rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-600"
            @click="form.editorialScore = null"
          >
            Сбросить
          </button>
        </div>
      </fieldset>

      <p v-if="saveMessage" class="text-sm" :class="saveOk ? 'text-green-700' : 'text-red-700'">
        {{ saveMessage }}
      </p>

      <button
        type="submit"
        class="fixed bottom-4 left-4 right-4 mx-auto max-w-lg rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-lg disabled:opacity-60"
        :disabled="saving"
      >
        {{ saving ? 'Сохранение…' : 'Сохранить' }}
      </button>
    </form>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTelegram } from '~/composables/useTelegram'

definePageMeta({ layout: false })

const route = useRoute()
const { buildMessengerAuthHeaders, expandMessengerViewport, isMessengerMiniApp, messengerInitData } = useTelegram()

const submissionId = computed(() => String(route.params.id || '').trim())
const citySlug = ref('')
const cityName = ref('')
const statusLabel = ref('')
const loading = ref(true)
const saving = ref(false)
const errorText = ref('')
const saveMessage = ref('')
const saveOk = ref(false)

const form = reactive({
  title: '',
  descriptionShort: '',
  descriptionFull: '',
  coverMediaUrl: '',
  mediaUrls: [] as string[],
  categorySlug: '',
  registrationUrl: '',
  topicTags: [] as string[],
  editorialScore: null as number | null,
})

const authHeaders = computed(() => buildMessengerAuthHeaders())

const previewGalleryUrls = computed(() => {
  const urls: string[] = []
  const cover = form.coverMediaUrl.trim()
  if (cover) urls.push(cover)
  for (const raw of form.mediaUrls) {
    const url = String(raw || '').trim()
    if (url && !urls.includes(url)) urls.push(url)
  }
  return urls
})

function addMediaUrl() {
  if (form.mediaUrls.length >= 11) return
  form.mediaUrls.push('')
}

function removeMediaUrl(index: number) {
  form.mediaUrls.splice(index, 1)
}

const SUBMISSION_STATUS_LABELS: Record<string, string> = {
  draft: 'Черновик',
  pending: 'На модерации',
  needs_revision: 'На доработке',
  approved: 'Опубликовано',
  rejected: 'Отклонено',
}

function formatSubmissionStatusLabel(status: string): string {
  const key = String(status || '').trim()
  return SUBMISSION_STATUS_LABELS[key] || key || '—'
}

onMounted(() => {
  expandMessengerViewport()
  void loadSubmission()
})

watch(messengerInitData, () => {
  if (messengerInitData.value && errorText.value.includes('мессенджер')) {
    void loadSubmission()
  }
})

async function loadSubmission() {
  loading.value = true
  errorText.value = ''
  try {
    if (!submissionId.value) {
      errorText.value = 'Не указан id заявки'
      return
    }
    if (!messengerInitData.value && !process.client) {
      return
    }
    if (!messengerInitData.value && isMessengerMiniApp.value) {
      errorText.value = 'Откройте форму из чата менеджеров в Telegram или MAX'
      return
    }

    const res = await fetch(`/api/moderation/content-submission/${submissionId.value}`, {
      headers: authHeaders.value,
    })
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) {
      throw new Error(payload?.statusMessage || payload?.message || 'Не удалось загрузить заявку')
    }

    citySlug.value = String(payload?.city?.slug || route.query.city || '')
    cityName.value = String(payload?.city?.name || '')
    statusLabel.value = formatSubmissionStatusLabel(String(payload?.item?.status || ''))

    const p = payload?.item?.payload || {}
    form.title = String(p.title || '')
    form.descriptionShort = String(p.description_short || p.description || '').slice(0, 280)
    form.descriptionFull = String(p.description_full || p.description || '')
    const cover = String(p.cover_media_url || '').trim()
    form.coverMediaUrl = cover
    const extraMedia = Array.isArray(p.media_urls)
      ? p.media_urls.map((x: unknown) => String(x || '').trim()).filter(Boolean)
      : []
    form.mediaUrls = extraMedia.filter((url: string) => url !== cover)
    form.categorySlug = String(p.category_slug || '')
    form.registrationUrl = String(p.registration_url || '')
    form.topicTags = Array.isArray(p.topic_tags)
      ? p.topic_tags.map((x: unknown) => String(x || '').trim()).filter(Boolean)
      : []
    const score = payload?.item?.editorial_score
    form.editorialScore = typeof score === 'number' ? score : null
  } catch (err: any) {
    errorText.value = err?.message || 'Ошибка загрузки'
  } finally {
    loading.value = false
  }
}

async function save() {
  saving.value = true
  saveMessage.value = ''
  saveOk.value = false
  try {
    const res = await fetch(`/api/moderation/content-submission/${submissionId.value}`, {
      method: 'PUT',
      headers: {
        ...authHeaders.value,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: form.title,
        descriptionShort: form.descriptionShort,
        descriptionFull: form.descriptionFull,
        coverMediaUrl: form.coverMediaUrl,
        mediaUrls: form.mediaUrls.map((x) => String(x || '').trim()).filter(Boolean),
        categorySlug: form.categorySlug || null,
        registrationUrl: form.registrationUrl,
        topicTags: form.topicTags,
        editorialScore: form.editorialScore,
      }),
    })
    const payload = await res.json() as any
    if (!res.ok || payload?.ok === false) {
      throw new Error(payload?.statusMessage || payload?.message || 'Не удалось сохранить')
    }
    saveOk.value = true
    saveMessage.value = 'Сохранено. Карточка в чате обновлена.'
    const wa = (window as any).Telegram?.WebApp || (window as any).WebApp
    if (wa && typeof wa.close === 'function') {
      window.setTimeout(() => {
        try {
          wa.close()
        } catch {
          // ignore
        }
      }, 800)
    }
  } catch (err: any) {
    saveMessage.value = err?.message || 'Ошибка сохранения'
  } finally {
    saving.value = false
  }
}
</script>
