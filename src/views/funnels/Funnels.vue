<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Funnels</h1>
      <AppButton @click="storeNewFunnel">Create Funnel</AppButton>
    </template>

    <!-- Funnels -->
    <table v-if="funnels" class="min-w-full table-fixed divide-y divide-gray-300">
      <thead>
        <tr>
          <th scope="col" class="py-3.5 pl-4 pr-12 text-left text-sm font-semibold text-gray-900">Funnel</th>
          <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Created</th>
          <th scope="col" class="py-3.5 text-left text-sm font-semibold text-gray-900">Updated</th>
          <th scope="col" class="py-3.5"></th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">
        <tr v-for="funnel in funnels" :key="funnel.id" @click="router.push({name: 'funnel', params: {funnel: funnel.id}})" class="hover:bg-gray-50 cursor-pointer">
          <!-- Funnel -->
          <td class="whitespace-nowrap py-4 pl-4 pr-6 text-sm text-gray-500">
            <div class="flex-auto">
              <p class="mb-1 text-base font-medium leading-6 text-gray-900">{{ funnel.name }}</p>
              <p v-if="funnel.description" class="text-sm leading-5 text-gray-400">{{ funnel.description }}</p>
            </div>
          </td>

          <!-- Created -->
          <td class="whitespace-nowrap py-4 text-sm text-gray-400">
            <p>{{ moment(funnel.created_at).fromNow() }}</p>
            <p>by {{ funnel.user.name }}</p>
          </td>

          <!-- Updated -->
          <td class="whitespace-nowrap py-4 text-sm text-gray-400">
            <p>{{ moment(funnel.updated_at).fromNow() }}</p>
          </td>

          <!-- Options -->
          <!-- <td scope="col" class="py-4 text-right">
            <AppButton variant="tertiary">Options</AppButton>
          </td> -->
        </tr>
      </tbody>
    </table>
    
    <!-- Empty state: No funnels -->
    <div v-else class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <ChartBarIcon class="mx-auto h-12 w-12 text-indigo-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-gray-900">No funnels</h2>
      <p class="mt-1 text-gray-500">Get started by creating a funnel.</p>
      <AppButton @click="" class="mt-4">Create Funnel</AppButton>
    </div>
  </LayoutWithSidebar>
</template>

<script setup>
import moment from 'moment'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'

const route = useRoute()
const router = useRouter()
const funnels = ref()

function storeNewFunnel() {
  funnelApi.store(route.params.organization, {
    name: 'New funnel',
    description: 'This is the funnel descriptions'
  }).then(response => {
    let funnel = response.data.data
    router.push({ name: 'funnel', params: { funnel: funnel.id } })
  })
}

onMounted(() => {
  funnelApi.index(route.params.organization).then(response => {
    funnels.value = response.data.data
  })
})
</script>
