<template>
  <NuxtLink
    :to="`${cityBasePath}/guides/${post.slug}`"
    class="group block shrink-0 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:border-primary/30 hover:shadow-md sm:w-72"
  >
    <div
      v-if="post.cover_media_url"
      class="aspect-[16/10] bg-cover bg-center"
      :style="{ backgroundImage: `url(${post.cover_media_url})` }"
    />
    <div v-else class="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100" />
    <div class="p-4">
      <p v-if="post.is_sponsored" class="mb-1 text-xs font-medium uppercase tracking-wide text-amber-700">
        Промо
      </p>
      <h3 class="line-clamp-2 font-semibold text-gray-900 group-hover:text-primary">
        {{ post.title }}
      </h3>
      <p v-if="post.excerpt" class="mt-1 line-clamp-2 text-sm text-gray-600">
        {{ post.excerpt }}
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{
  post: {
    slug: string
    title: string
    excerpt?: string | null
    cover_media_url?: string | null
    is_sponsored?: boolean
  }
}>()

const { cityBasePath } = useCity()
</script>
