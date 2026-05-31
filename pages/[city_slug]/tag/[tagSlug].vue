<template>
  <div>
    <NuxtLink :to="`${cityBasePath}/events`" class="text-sm text-primary hover:underline">← Афиша</NuxtLink>
    <h1 class="mt-2 text-2xl font-bold text-gray-900">{{ tagName }}</h1>
    <p class="mt-1 text-sm text-gray-600">События и материалы с тегом «{{ tagName }}» в {{ displayName }}</p>

    <div v-if="pending" class="mt-8 text-sm text-gray-500">Загрузка…</div>
    <template v-else>
      <section v-if="events.length" class="mt-8">
        <h2 class="text-lg font-semibold text-gray-900">События</h2>
        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <CityEventCard
            v-for="item in events"
            :key="item.id"
            :event="item"
            :sale-mode="item.saleMode"
            :cta="item.cta"
          />
        </div>
      </section>

      <section v-if="news.length" class="mt-10">
        <h2 class="text-lg font-semibold text-gray-900">Новости</h2>
        <ul class="mt-4 space-y-3">
          <li
            v-for="post in news"
            :key="post.id"
            class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <h3 class="font-medium text-gray-900">{{ post.title }}</h3>
            <p v-if="post.excerpt" class="mt-1 line-clamp-3 text-sm text-gray-600">{{ post.excerpt }}</p>
          </li>
        </ul>
      </section>

      <p v-if="!events.length && !news.length" class="mt-8 text-sm text-gray-500">
        Пока нет материалов с этим тегом.
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'city' })

const route = useRoute()
const { slug, displayName, cityBasePath } = useCity()
const tagSlug = computed(() => String(route.params.tagSlug || ''))

const pending = ref(true)
const tagName = ref('')
const events = ref<Array<Record<string, any>>>([])
const news = ref<Array<Record<string, any>>>([])

watch([slug, tagSlug], async () => {
  pending.value = true
  try {
    const res = await $fetch<{
      ok: boolean
      tag?: { name: string }
      events?: Array<Record<string, any>>
      news?: Array<Record<string, any>>
    }>(`/api/cities/${slug.value}/tag/${tagSlug.value}`)
    tagName.value = res?.tag?.name || tagSlug.value
    events.value = res?.events ?? []
    news.value = res?.news ?? []
  } catch {
    tagName.value = tagSlug.value
    events.value = []
    news.value = []
  } finally {
    pending.value = false
  }
}, { immediate: true })

useHead({ title: () => `${tagName.value} — ${displayName.value}` })
</script>
