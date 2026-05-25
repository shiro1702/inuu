<template>
  <NuxtLink
    :to="`${cityBasePath}/venues/${venue.slug}`"
    class="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md"
  >
    <div
      v-if="venue.cover_media_url"
      class="aspect-[4/3] bg-cover bg-center"
      :style="{ backgroundImage: `url(${venue.cover_media_url})` }"
    />
    <div v-else class="aspect-[4/3] bg-gradient-to-br from-amber-50 to-orange-100" />
    <div class="p-4">
      <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary">
        {{ venue.title }}
      </h3>
      <p v-if="venue.address" class="mt-1 text-sm text-gray-500">
        {{ venue.address }}
      </p>
      <p v-if="venue.editorial_quote" class="mt-2 text-sm italic text-gray-600">
        «{{ venue.editorial_quote }}»
      </p>
      <div v-if="venue.vibe_tags?.length" class="mt-3 flex flex-wrap gap-1">
        <span
          v-for="tag in venue.vibe_tags.slice(0, 4)"
          :key="tag"
          class="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  venue: {
    slug: string
    title: string
    address?: string | null
    editorial_quote?: string | null
    cover_media_url?: string | null
    vibe_tags?: string[] | null
  }
}>()

const { cityBasePath } = useCity()
</script>
