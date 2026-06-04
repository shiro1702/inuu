<script setup lang="ts">
definePageMeta({ layout: false })

const query = useRoute().query
const target = {
  path: '/dashboard/carousel-studio',
  query: {
    ...(typeof query.city === 'string' ? { city: query.city } : {}),
    ...(typeof query.post === 'string' ? { post: query.post } : {}),
    ...(typeof query.submission === 'string' ? { submission: query.submission } : {}),
  },
}

if (import.meta.server) {
  await navigateTo(target, { redirectCode: 302 })
} else {
  await navigateTo(target)
}
</script>
