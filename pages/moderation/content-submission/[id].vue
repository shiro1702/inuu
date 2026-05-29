<script setup lang="ts">
/** Старый путь — /moderation совпадал с [city_slug] и ломал Mini App. */
const route = useRoute()
const id = String(route.params.id || '').trim()
const city = typeof route.query.city === 'string' ? route.query.city : ''
const q = city ? `?city=${encodeURIComponent(city)}` : ''
await navigateTo(`/content-submission/edit/${encodeURIComponent(id)}${q}`, { redirectCode: 301 })
</script>
