<template>
  <div>
    <div class="flex items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Подборки</h1>
        <p class="mt-2 text-sm text-gray-600">Редакционные подборки в {{ displayName }}</p>
      </div>
      <NuxtLink :to="cityBasePath" class="text-sm font-medium text-primary hover:underline">
        На главную
      </NuxtLink>
    </div>

    <div v-if="pending" class="mt-8 text-sm text-gray-500">Загрузка…</div>
    <div v-else-if="items.length" class="mt-6 space-y-6">
      <div class="grid gap-3 sm:grid-cols-2">
        <NuxtLink
          v-for="list in items"
          :key="list.id"
          :to="`${cityBasePath}/lists/${list.slug}`"
          class="group block rounded-xl border border-gray-200 bg-white p-4 transition hover:border-primary/30 hover:shadow-sm"
        >
          <h2 class="font-semibold text-gray-900 group-hover:text-primary">{{ list.title }}</h2>
          <p v-if="list.description" class="mt-1 text-sm text-gray-600">{{ list.description }}</p>
        </NuxtLink>
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
    <p v-else class="mt-8 text-sm text-gray-500">Пока нет опубликованных подборок.</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'city' })

type ListItem = {
  id: string
  slug: string
  title: string
  description?: string | null
}

type ListsResponse = {
  ok: boolean
  items?: ListItem[]
  page?: number
  totalPages?: number
}

const route = useRoute()
const router = useRouter()
const { slug, displayName, cityBasePath } = useCity()

const pending = ref(true)
const items = ref<ListItem[]>([])
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
    const res = await $fetch<ListsResponse>(`/api/cities/${slug.value}/lists?page=${pageFromRoute.value}`)
    items.value = res?.items ?? []
    page.value = res?.page ?? pageFromRoute.value
    totalPages.value = res?.totalPages ?? 0
  } finally {
    pending.value = false
  }
}, { immediate: true })

useHead({ title: () => `Подборки — ${displayName.value}` })
</script>
