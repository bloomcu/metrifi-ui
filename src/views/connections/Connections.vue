<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Connections</h1>
      <AppButton @click="connectToGoogle()">Connect Google Analytics</AppButton>
    </template>

    <table v-if="connections" class="min-w-full table-fixed divide-y divide-gray-300">
      <thead>
        <tr>
          <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Service</th>
          <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Connected</th>
          <th scope="col" class="py-3.5 text-left text-sm font-semibold text-gray-900">Updated</th>
          <th scope="col" class="py-3.5"></th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">
        <tr v-for="connection in connections" :key="connection.id" >
          <!-- Service -->
          <td class="whitespace-nowrap py-4 pr-6 text-sm text-gray-500">
            <div class="flex-auto">
              <p class="mb-1 text-sm leading-5 text-gray-400">{{ connection.service }}</p>
              <p class="mb-1 text-base font-medium leading-6 text-gray-900">{{ connection.name }}</p>
            </div>
          </td>

          <!-- Connected -->
          <td class="whitespace-nowrap py-4 text-sm text-gray-500">
            <p>{{ moment(connection.created_at).fromNow() }}</p>
            <p>by Ryan Harmon</p>
          </td>

          <!-- Updated -->
          <td class="whitespace-nowrap py-4 text-sm text-gray-500">
            {{ moment(connection.updated_at).fromNow() }}
          </td>

          <!-- Disconnect -->
          <td scope="col" class="py-4 text-right">
            <AppButton variant="tertiary">Disconnect</AppButton>
          </td>
        </tr>
      </tbody>
    </table>
  </LayoutWithSidebar>
</template>
  
<script setup>
import moment from 'moment'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { googleApi } from '@/domain/services/google/api/googleApi.js'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'

const route = useRoute()
const connections = ref()

function connectToGoogle() {
  googleApi.connect('https://www.googleapis.com/auth/analytics.readonly')
  .then(response => {
    window.location.href = response.data.url
  })
}

onMounted(() => {
  connectionApi.index(route.params.organization).then(response => {
    connections.value = response.data.data
  })
})
</script>
