<template>
  <DashboardIngestSourcesPanel v-if="selectedCitySlug" :city-slug="selectedCitySlug" />
  <p v-else class="text-sm text-gray-500">Выберите город.</p>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard-content-ai' })

const { selectedCitySlug } = useContentAiCity()
</script>
