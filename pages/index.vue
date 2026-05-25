<script setup lang="ts">
const config = useRuntimeConfig()
const slug =
  typeof config.public.defaultCitySlug === 'string' && config.public.defaultCitySlug.trim()
    ? config.public.defaultCitySlug.trim()
    : 'ulan-ude'

await navigateTo(`/${slug}`, { redirectCode: 302 })
</script>
