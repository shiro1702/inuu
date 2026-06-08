<template>
  <DashboardIngestSourcesPanel v-if="selectedCitySlug" :city-slug="selectedCitySlug" />
  <p v-else class="text-sm text-gray-500">Выберите город.</p>
</template>

<script setup lang="ts">
const { selectedCitySlug } = useContentAiCity()
</script>
