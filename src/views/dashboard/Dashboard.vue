<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Dashboard</h1>
    </template>

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
