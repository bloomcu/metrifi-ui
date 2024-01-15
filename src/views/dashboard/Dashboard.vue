<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Dashboard</h1>
    </template>

    <div v-if="analytics && !analytics.rows" class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
      </svg>

      <h2 class="mt-2 text-lg font-medium text-gray-900">No data received from your website yet</h2>
      <p class="mt-1 text-gray-500">Make sure Google Analytics is installed.</p>
      <AppButton @click="" class="mt-4">Check Connection</AppButton>
    </div>

    <pre v-if="analytics">{{ analytics }}</pre>
    
  </LayoutWithSidebar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'
import { useRoute } from 'vue-router'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'

const route = useRoute()
const analytics = ref()

function runReport(connectionId) {
  gaDataApi.runReport(connectionId).then(response => {
    analytics.value = response.data.data
    console.log(response)
  })
}

onMounted(() => {
  if (route.params.connection) {
    runReport(route.params.connection)
  }
})
</script>
