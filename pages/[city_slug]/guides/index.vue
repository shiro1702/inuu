<template>
  <div>
    <div class="flex items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Журнал</h1>
        <p class="mt-2 text-sm text-gray-600">Новости, обзоры и лонгриды — {{ displayName }}</p>
      </div>
      <NuxtLink :to="cityBasePath" class="text-sm font-medium text-primary hover:underline">
        На главную
      </NuxtLink>
    </div>

    <div v-if="pending" class="mt-8 text-sm text-gray-500">Загрузка…</div>
    <div v-else-if="items.length" class="mt-6 space-y-6">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <EditorialCard v-for="post in items" :key="post.id" :post="post" />
      </div>

      <nav v-if="totalPages > 1" class="flex items-center justify-center gap-2">
        <button
          type="button"
          class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="page <= 1"
          @click="setPage(page - 1)"
        >
          Назад
        </button>
        <span class="text-sm text-gray-600">Страница {{ page }} из {{ totalPages }}</span>
        <button
          type="button"
          class="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          :disabled="page >= totalPages"
          @click="setPage(page + 1)"
        >
          Вперёд
        </button>
      </nav>
    </div>
    <p v-else class="mt-8 text-sm text-gray-500">Пока нет опубликованных материалов.</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'city' })

type EditorialListItem = {
  id: string
  slug: string
  title: string
  excerpt?: string | null
  cover_media_url?: string | null
  is_sponsored?: boolean
}

type EditorialListResponse = {
  ok: boolean
  items?: EditorialListItem[]
  page?: number
  totalPages?: number
}

const route = useRoute()
const router = useRouter()
const { slug, displayName, cityBasePath } = useCity()

const pending = ref(true)
const items = ref<EditorialListItem[]>([])
const page = ref(1)
const totalPages = ref(0)

const pageFromRoute = computed(() => {
  const q = route.query.page
  const parsed = Number(typeof q === 'string' ? q : '')
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 1
})

function setPage(nextPage: number) {
  const safePage = Math.max(1, nextPage)
  const query = { ...route.query }
  if (safePage === 1) delete query.page
  else query.page = String(safePage)
  void router.replace({ query })
}

watch([slug, pageFromRoute], async () => {
  pending.value = true
  try {
    const res = await $fetch<EditorialListResponse>(
      `/api/cities/${slug.value}/editorial?page=${pageFromRoute.value}`,
    )
    items.value = res?.items ?? []
    page.value = res?.page ?? pageFromRoute.value
    totalPages.value = res?.totalPages ?? 0
  } finally {
    pending.value = false
  }
}, { immediate: true })

useHead({ title: () => `Журнал — ${displayName.value}` })
</script>
