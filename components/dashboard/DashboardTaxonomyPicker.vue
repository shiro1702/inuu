<template>
  <div ref="rootEl" class="relative space-y-1 text-sm">
    <span v-if="label" class="font-medium text-gray-700">{{ label }}</span>

    <div v-if="kind === 'tags' && selectedTags.length" class="flex flex-wrap gap-1">
      <span
        v-for="tag in selectedTags"
        :key="tag.slug"
        class="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-xs text-primary"
      >
        {{ tag.name }}
        <button type="button" class="hover:text-primary/70" @click="removeTag(tag.slug)">×</button>
      </span>
    </div>

    <div v-if="kind === 'category' && selectedCategory" class="flex flex-wrap gap-1">
      <span class="inline-flex items-center gap-1 rounded-full border border-gray-300 bg-gray-50 px-2 py-0.5 text-xs">
        {{ selectedCategory.name }}
        <button type="button" class="text-gray-500 hover:text-gray-800" @click="clearCategory">×</button>
      </span>
    </div>

    <div class="relative">
      <input
        v-model="search"
        type="text"
        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        :placeholder="placeholder"
        @focus="openDropdown = true"
        @keydown.enter.prevent="onEnter"
        @keydown.escape="openDropdown = false"
      />
      <div
        v-if="openDropdown && (filteredOptions.length || canCreate)"
        class="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
      >
        <button
          v-for="opt in filteredOptions"
          :key="opt.slug"
          type="button"
          class="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50"
          @mousedown.prevent="selectOption(opt)"
        >
          <span>{{ opt.name }}</span>
          <span class="font-mono text-xs text-gray-400">{{ opt.slug }}</span>
        </button>
        <button
          v-if="canCreate"
          type="button"
          class="w-full border-t border-gray-100 px-3 py-2 text-left text-sm text-primary hover:bg-primary/5"
          @mousedown.prevent="createFromSearch"
        >
          + Создать «{{ search.trim() }}»
        </button>
      </div>
    </div>
    <p v-if="hint" class="text-xs text-gray-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

type TaxonomyItem = { slug: string; name: string }

const props = withDefaults(
  defineProps<{
    citySlug: string
    kind: 'tags' | 'category'
    modelValue: string[] | string | null
    label?: string
    placeholder?: string
    hint?: string
    maxTags?: number
    /** Мини-приложение модерации: taxonomy через /api/moderation/... */
    moderationSubmissionId?: string
    fetchHeaders?: Record<string, string>
  }>(),
  {
    label: '',
    placeholder: 'Поиск…',
    hint: '',
    maxTags: 8,
    moderationSubmissionId: '',
    fetchHeaders: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string[] | string | null]
}>()

const rootEl = ref<HTMLElement | null>(null)
const search = ref('')
const openDropdown = ref(false)
const options = ref<TaxonomyItem[]>([])
const loading = ref(false)

const apiBase = computed(() => {
  const slug = props.citySlug.trim()
  if (!slug) return ''
  if (props.moderationSubmissionId.trim()) {
    return `/api/moderation/cities/${slug}/taxonomy`
  }
  return props.kind === 'tags'
    ? `/api/dashboard/manager/cities/${slug}/content-tags`
    : `/api/dashboard/manager/cities/${slug}/event-categories`
})

const selectedTags = computed(() => {
  const slugs = Array.isArray(props.modelValue) ? props.modelValue : []
  return slugs.map((slug) => options.value.find((o) => o.slug === slug) || { slug, name: slug })
})

const selectedCategory = computed(() => {
  const slug = typeof props.modelValue === 'string' ? props.modelValue : ''
  if (!slug) return null
  return options.value.find((o) => o.slug === slug) || { slug, name: slug }
})

const filteredOptions = computed(() => {
  const q = search.value.trim().toLowerCase()
  const selected = new Set(
    props.kind === 'tags' && Array.isArray(props.modelValue) ? props.modelValue : [],
  )
  return options.value.filter((opt) => {
    if (props.kind === 'tags' && selected.has(opt.slug)) return false
    if (props.kind === 'category' && props.modelValue === opt.slug) return false
    if (!q) return true
    return opt.slug.includes(q) || opt.name.toLowerCase().includes(q)
  })
})

const canCreate = computed(() => {
  const q = search.value.trim()
  if (q.length < 2) return false
  const lower = q.toLowerCase()
  return !options.value.some((o) => o.slug === lower || o.name.toLowerCase() === lower)
})

async function loadOptions() {
  if (!apiBase.value) return
  loading.value = true
  try {
    const params = new URLSearchParams()
    params.set('q', search.value.trim())
    if (props.moderationSubmissionId.trim()) {
      params.set('kind', props.kind)
      params.set('submissionId', props.moderationSubmissionId.trim())
    }
    const res = await fetch(`${apiBase.value}?${params.toString()}`, {
      headers: props.fetchHeaders,
    })
    const payload = await res.json() as { ok?: boolean; items?: TaxonomyItem[] }
    if (payload?.items) options.value = payload.items
  } catch {
    // keep previous options
  } finally {
    loading.value = false
  }
}

function selectOption(opt: TaxonomyItem) {
  if (props.kind === 'category') {
    emit('update:modelValue', opt.slug)
    search.value = ''
    openDropdown.value = false
    return
  }
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  if (!current.includes(opt.slug) && current.length < props.maxTags) {
    current.push(opt.slug)
    emit('update:modelValue', current)
  }
  search.value = ''
  openDropdown.value = false
}

function removeTag(slug: string) {
  const current = Array.isArray(props.modelValue) ? props.modelValue.filter((x) => x !== slug) : []
  emit('update:modelValue', current)
}

function clearCategory() {
  emit('update:modelValue', '')
  search.value = ''
}

async function createFromSearch() {
  const name = search.value.trim()
  if (!name || !apiBase.value) return
  try {
    const res = await fetch(apiBase.value, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const payload = await res.json() as { ok?: boolean; item?: TaxonomyItem }
    if (!res.ok || !payload?.item) return
    const item = payload.item
    if (!options.value.some((o) => o.slug === item.slug)) {
      options.value = [...options.value, item]
    }
    selectOption(item)
  } catch {
    // ignore
  }
}

function onEnter() {
  if (filteredOptions.value.length) {
    selectOption(filteredOptions.value[0])
    return
  }
  if (canCreate.value) void createFromSearch()
}

function onDocumentClick(e: MouseEvent) {
  if (!rootEl.value?.contains(e.target as Node)) openDropdown.value = false
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(search, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => void loadOptions(), 200)
})

watch(() => props.citySlug, () => {
  void loadOptions()
})

onMounted(() => {
  void loadOptions()
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>
