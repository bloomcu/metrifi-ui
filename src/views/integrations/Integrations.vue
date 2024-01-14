<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Connections</h1>
      <AppButton @click="">New Connection</AppButton>
    </template>

    <table v-if="integrations" class="min-w-full table-fixed divide-y divide-gray-300">
      <thead>
        <tr>
          <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Service</th>
          <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Connected</th>
          <th scope="col" class="py-3.5 text-left text-sm font-semibold text-gray-900">Updated</th>
          <th scope="col" class="py-3.5"></th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">
        <tr v-for="integration in integrations" :key="integration.id" >
          <!-- Service -->
          <td class="whitespace-nowrap py-4 pr-6 text-sm text-gray-500">
            <div class="flex-auto">
              <p class="mb-1 text-sm leading-5 text-gray-400">{{ integration.service }}</p>
              <p class="mb-1 text-base font-medium leading-6 text-gray-900">{{ integration.name }}</p>
            </div>
          </td>

          <!-- Connected -->
          <td class="whitespace-nowrap py-4 text-sm text-gray-500">
            <p>{{ moment(integration.created_at).fromNow() }}</p>
            <p>by Ryan Harmon</p>
          </td>

          <!-- Updated -->
          <td class="whitespace-nowrap py-4 text-sm text-gray-500">
            {{ moment(integration.updated_at).fromNow() }}
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
import { integrationApi } from '@/domain/integrations/api/integrationApi.js'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'

const route = useRoute()
const integrations = ref()

onMounted(() => {
  integrationApi.index(route.params.organization).then(response => {
    integrations.value = response.data.data
  })
})
</script>
