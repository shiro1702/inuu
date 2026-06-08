<template>
  <article v-if="selectedCitySlug" id="editorial-journal" class="space-y-3 rounded-lg border border-gray-200 bg-white p-4">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold">Журнал города</h2>
        <p class="text-xs text-gray-500">Материалы на витрине /guides — новости, гиды и лонгриды.</p>
      </div>
      <div class="flex flex-wrap items-end gap-2">
        <NuxtLink
          :to="`/dashboard/carousel-studio?city=${encodeURIComponent(selectedCitySlug)}`"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
        >
          Карусель PNG
        </NuxtLink>
        <button
          type="button"
          class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          @click="startCreateEditorial"
        >
          Создать материал
        </button>
        <label class="space-y-1 text-sm">
          <span class="font-medium text-gray-700">Статус</span>
          <select
            v-model="editorialStatusFilter"
            class="rounded-lg border border-gray-300 px-3 py-2"
            @change="loadEditorialPosts"
          >
            <option value="all">Все</option>
            <option value="published">Опубликованные</option>
            <option value="draft">Черновики</option>
          </select>
        </label>
      </div>
    </div>

    <div
      v-if="showEditorialForm"
      id="editorial-create-form"
      class="space-y-3 rounded-lg border border-dashed border-gray-300 bg-gray-50/60 p-4"
    >
      <h3 class="text-sm font-semibold text-gray-800">
        {{ editingPostId ? 'Редактирование материала' : 'Новый материал журнала' }}
      </h3>
      <div class="grid gap-3 md:grid-cols-2">
        <label class="space-y-1 text-sm md:col-span-2">
          <span class="font-medium text-gray-700">Заголовок</span>
          <input
            ref="editorialTitleInput"
            v-model="newsForm.title"
            class="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
        </label>
        <label class="space-y-1 text-sm md:col-span-2">
          <span class="font-medium text-gray-700">Текст</span>
          <textarea v-model="newsForm.body" rows="6" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <label class="space-y-1 text-sm">
          <span class="font-medium text-gray-700">Краткое описание (optional)</span>
          <input v-model="newsForm.excerpt" class="w-full rounded-lg border border-gray-300 px-3 py-2" />
        </label>
        <div class="space-y-2 text-sm md:col-span-2">
          <span class="font-medium text-gray-700">Обложка (optional)</span>
          <div v-if="newsForm.coverMediaUrl" class="relative max-w-xs overflow-hidden rounded-lg border border-gray-200">
            <img
              :src="newsForm.coverMediaUrl"
              alt="Превью обложки"
              class="aspect-[4/3] w-full object-cover"
            >
            <button
              type="button"
              class="absolute right-2 top-2 rounded bg-white/90 px-2 py-0.5 text-xs text-gray-700 shadow hover:bg-white"
              @click="newsForm.coverMediaUrl = ''"
            >
              Удалить
            </button>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                class="sr-only"
                :disabled="coverUploadLoading"
                @change="onEditorialCoverFile"
              >
              {{ coverUploadLoading ? 'Загрузка…' : 'Загрузить файл' }}
            </label>
            <span class="text-xs text-gray-500">PNG, JPEG, WebP, GIF · до 8 MB · сжатие в WebP</span>
          </div>
          <label class="block space-y-1">
            <span class="text-xs text-gray-500">или вставьте URL</span>
            <input
              v-model="newsForm.coverMediaUrl"
              type="url"
              class="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="https://…"
            >
          </label>
        </div>
        <div class="md:col-span-2">
          <DashboardTaxonomyPicker
            v-model="newsForm.categorySlug"
            :city-slug="selectedCitySlug"
            kind="category"
            label="Категория"
            placeholder="Поиск категории…"
          />
        </div>
        <div class="md:col-span-2">
          <DashboardTaxonomyPicker
            v-model="newsForm.topicTags"
            :city-slug="selectedCitySlug"
            kind="tags"
            label="Теги"
            placeholder="Поиск или новый тег…"
            hint="Enter — выбрать; «+ Создать» — добавить в справочник города"
          />
        </div>
      </div>

      <label v-if="!editingPostId" class="inline-flex items-center gap-2 text-sm text-gray-700">
        <input v-model="newsForm.publishNow" type="checkbox" />
        Опубликовать сразу
      </label>

      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          :disabled="newsLoading"
          @click="saveEditorialNews"
        >
          {{ newsLoading ? 'Сохраняем...' : (editingPostId ? 'Сохранить изменения' : 'Создать материал') }}
        </button>
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          @click="cancelEditorialForm"
        >
          Отмена
        </button>
        <span v-if="newsMessage" class="text-sm text-gray-700">{{ newsMessage }}</span>
      </div>
    </div>

    <div v-if="editorialListLoading" class="text-sm text-gray-500">Загрузка журнала…</div>
    <div v-else-if="!editorialPosts.length" class="rounded-lg border border-dashed border-gray-200 p-4 text-center">
      <p class="text-sm text-gray-600">Материалов пока нет. Создайте первый материал для блока «Журнал» на главной города.</p>
      <button
        type="button"
        class="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        @click="startCreateEditorial"
      >
        Создать материал
      </button>
    </div>
    <div v-else class="space-y-2">
      <div
        v-for="post in editorialPosts"
        :key="post.id"
        class="flex flex-wrap items-start justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50/80 p-3"
      >
        <div class="min-w-0 flex-1 space-y-1">
          <p class="font-medium text-gray-900">{{ post.title }}</p>
          <p class="text-xs text-gray-500">
            <span
              class="inline-flex rounded-full px-2 py-0.5"
              :class="post.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'"
            >
              {{ post.is_published ? 'Опубликован' : 'Черновик' }}
            </span>
            <span v-if="post.published_at" class="ml-2">{{ formatEditorialDate(post.published_at) }}</span>
          </p>
          <a
            v-if="post.is_published"
            :href="`/${selectedCitySlug}/guides/${post.slug}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-xs font-medium text-primary hover:underline"
          >
            На витрине →
          </a>
          <div class="mt-2 flex flex-wrap gap-2">
            <NuxtLink
              :to="`/dashboard/carousel-studio?city=${encodeURIComponent(selectedCitySlug)}&post=${post.id}`"
              class="text-xs font-medium text-primary hover:underline"
            >
              Редактировать карусель
            </NuxtLink>
          </div>
          <EditorialCarouselExportPanel
            v-if="editorialCarouselForPost(post)"
            class="mt-2"
            :carousel="editorialCarouselForPost(post)!"
            :brand-name="selectedCityName"
            :topic-tags="post.topic_tags || []"
            :link-hint="`/${selectedCitySlug}/guides/${post.slug}`"
          />
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            type="button"
            class="rounded border border-gray-300 px-2 py-1 text-xs hover:bg-white"
            @click="startEditPost(post)"
          >
            Редактировать
          </button>
          <button
            v-if="!post.is_published"
            type="button"
            class="rounded border border-emerald-300 bg-emerald-50 px-2 py-1 text-xs text-emerald-800 hover:bg-emerald-100 disabled:opacity-50"
            :disabled="newsLoading"
            @click="setEditorialPublishState(post.id, true)"
          >
            Опубликовать
          </button>
          <button
            v-else
            type="button"
            class="rounded border border-amber-300 bg-amber-50 px-2 py-1 text-xs text-amber-900 hover:bg-amber-100 disabled:opacity-50"
            :disabled="newsLoading"
            @click="setEditorialPublishState(post.id, false)"
          >
            Снять с публикации
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref, watch } from 'vue'

const { dashboardFetch } = useDashboardFetch()
const { selectedCitySlug, selectedCityName } = useContentAiCity()

const newsLoading = ref(false)
const newsMessage = ref('')
const editingPostId = ref('')
const showEditorialForm = ref(false)
const editorialTitleInput = ref<HTMLInputElement | null>(null)
const coverUploadLoading = ref(false)
const editorialPosts = ref<Array<{
  id: string
  slug: string
  title: string
  excerpt: string | null
  body: string
  cover_media_url: string | null
  topic_tags: string[] | null
  category_slug: string | null
  is_published: boolean
  published_at: string | null
  metadata?: Record<string, unknown> | null
}>>([])
const editorialStatusFilter = ref<'all' | 'published' | 'draft'>('all')
const editorialListLoading = ref(false)
const newsForm = reactive({
  title: '',
  body: '',
  excerpt: '',
  coverMediaUrl: '',
  publishNow: false,
  categorySlug: '' as string,
  topicTags: [] as string[],
})

function editorialCarouselForPost(post: (typeof editorialPosts.value)[number]) {
  const raw = post.metadata?.carousel
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const meta = raw as { slides?: unknown[] }
  if (!Array.isArray(meta.slides) || meta.slides.length < 2) return null
  return raw as {
    template_id: 'minimal-ios'
    aspect: '4:5' | '9:16'
    slides: Array<Record<string, unknown>>
  }
}

function formatEditorialDate(value: string): string {
  try {
    return new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value))
  } catch {
    return value
  }
}

function resetNewsForm() {
  editingPostId.value = ''
  newsForm.title = ''
  newsForm.body = ''
  newsForm.excerpt = ''
  newsForm.coverMediaUrl = ''
  newsForm.publishNow = false
  newsForm.categorySlug = ''
  newsForm.topicTags = []
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const value = String(reader.result || '')
      const marker = 'base64,'
      const idx = value.indexOf(marker)
      if (idx === -1) reject(new Error('Не удалось прочитать файл'))
      else resolve(value.slice(idx + marker.length))
    }
    reader.onerror = () => reject(reader.error || new Error('Не удалось прочитать файл'))
    reader.readAsDataURL(file)
  })
}

async function onEditorialCoverFile(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !selectedCitySlug.value) return
  if (file.size > 8 * 1024 * 1024) {
    newsMessage.value = 'Файл больше 8 MB'
    return
  }
  coverUploadLoading.value = true
  newsMessage.value = ''
  try {
    const res = await dashboardFetch(
      `/api/dashboard/manager/cities/${selectedCitySlug.value}/editorial-cover/upload`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          mimeType: file.type,
          dataBase64: await fileToBase64(file),
        }),
      },
    )
    const payload = await res.json() as { ok?: boolean; url?: string; statusMessage?: string; message?: string }
    if (!res.ok || !payload?.ok || !payload.url) {
      throw new Error(payload?.statusMessage || payload?.message || 'Не удалось загрузить обложку')
    }
    newsForm.coverMediaUrl = payload.url
    newsMessage.value = 'Обложка загружена'
  } catch (error: any) {
    newsMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка загрузки обложки'
  } finally {
    coverUploadLoading.value = false
  }
}

async function startCreateEditorial() {
  resetNewsForm()
  newsMessage.value = ''
  showEditorialForm.value = true
  await nextTick()
  editorialTitleInput.value?.focus()
  document.getElementById('editorial-create-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

function cancelEditorialForm() {
  resetNewsForm()
  newsMessage.value = ''
  showEditorialForm.value = false
}

function editorialPayload(extra?: { isPublished?: boolean }) {
  return {
    title: newsForm.title,
    body: newsForm.body,
    excerpt: newsForm.excerpt || null,
    coverMediaUrl: newsForm.coverMediaUrl || null,
    categorySlug: newsForm.categorySlug || null,
    topicTags: newsForm.topicTags,
    ...(extra?.isPublished !== undefined
      ? { isPublished: extra.isPublished }
      : { publishNow: newsForm.publishNow }),
  }
}

async function loadEditorialPosts() {
  if (!selectedCitySlug.value) return
  editorialListLoading.value = true
  try {
    const res = await dashboardFetch(
      `/api/dashboard/manager/cities/${selectedCitySlug.value}/editorial-news?status=${encodeURIComponent(editorialStatusFilter.value)}&limit=50`,
    )
    const payload = await res.json() as any
    editorialPosts.value = payload?.ok ? payload.items || [] : []
  } catch {
    editorialPosts.value = []
  } finally {
    editorialListLoading.value = false
  }
}

async function startEditPost(post: (typeof editorialPosts.value)[number]) {
  editingPostId.value = post.id
  newsForm.title = post.title
  newsForm.body = post.body
  newsForm.excerpt = post.excerpt || ''
  newsForm.coverMediaUrl = post.cover_media_url || ''
  newsForm.categorySlug = post.category_slug || ''
  newsForm.topicTags = Array.isArray(post.topic_tags) ? [...post.topic_tags] : []
  newsForm.publishNow = false
  newsMessage.value = ''
  showEditorialForm.value = true
  await nextTick()
  document.getElementById('editorial-create-form')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

async function saveEditorialNews() {
  if (!selectedCitySlug.value) return
  newsLoading.value = true
  newsMessage.value = ''
  try {
    const isEdit = Boolean(editingPostId.value)
    const url = isEdit
      ? `/api/dashboard/manager/cities/${selectedCitySlug.value}/editorial-news/${editingPostId.value}`
      : `/api/dashboard/manager/cities/${selectedCitySlug.value}/editorial-news`
    const res = await dashboardFetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(editorialPayload()),
    })
    const response = await res.json() as any
    if (!res.ok || response?.ok === false) {
      throw new Error(response?.statusMessage || response?.message || 'Ошибка сохранения')
    }
    const path = response?.publicPath ? ` · ${response.publicPath}` : ''
    newsMessage.value = isEdit ? `Сохранено${path}` : `Материал создан${path}`
    if (!isEdit) {
      resetNewsForm()
      showEditorialForm.value = false
    }
    await loadEditorialPosts()
  } catch (error: any) {
    newsMessage.value = error?.data?.statusMessage || error?.message || 'Ошибка сохранения материала'
  } finally {
    newsLoading.value = false
  }
}

async function setEditorialPublishState(postId: string, isPublished: boolean) {
  if (!selectedCitySlug.value) return
  newsLoading.value = true
  newsMessage.value = ''
  try {
    const post = editorialPosts.value.find((row) => row.id === postId)
    const res = await dashboardFetch(
      `/api/dashboard/manager/cities/${selectedCitySlug.value}/editorial-news/${postId}`,
      {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: post?.title,
          body: post?.body,
          excerpt: post?.excerpt,
          coverMediaUrl: post?.cover_media_url,
          categorySlug: post?.category_slug,
          topicTags: post?.topic_tags || [],
          isPublished,
        }),
      },
    )
    const response = await res.json() as any
    if (!res.ok || response?.ok === false) {
      throw new Error(response?.statusMessage || response?.message || 'Ошибка публикации')
    }
    newsMessage.value = isPublished
      ? `Опубликовано${response?.publicPath ? `: ${response.publicPath}` : ''}`
      : 'Снято с публикации'
    if (editingPostId.value === postId && !isPublished) {
      newsForm.publishNow = false
    }
    await loadEditorialPosts()
  } catch (error: any) {
    newsMessage.value = error?.data?.statusMessage || error?.message || 'Не удалось изменить статус'
  } finally {
    newsLoading.value = false
  }
}

watch(selectedCitySlug, () => {
  cancelEditorialForm()
  void loadEditorialPosts()
})

onMounted(() => {
  if (selectedCitySlug.value) void loadEditorialPosts()
})
</script>
