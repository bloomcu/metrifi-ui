<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Funnels</h1>
      <div class="flex gap-2">
        <AppButton @click="storeNewFunnel" variant="secondary">
          Create blank funnel
        </AppButton>
        <AppButton @click="toggleModal()">
          <svg class="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 576 512"><path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"/></svg>
          Generate funnels with AI
        </AppButton>
      </div>
    </template>

    <!-- Automation running -->
    <div v-if="isAutomating" class="rounded-md bg-indigo-50 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0 text-indigo-600">
          <svg class="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 100 101"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-indigo-600">Generating funnels, please wait.</p>
        </div>
      </div>
    </div>

    <!-- Funnels -->
    <table v-if="funnels && funnels.length" class="min-w-full table-fixed overflow-hidden divide-y divide-gray-300 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
      <thead>
        <tr>
          <th scope="col" class="py-3.5 pl-4 pr-12 text-left text-sm font-semibold text-gray-900 sm:pl-6">Funnel</th>
          <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Created</th>
          <th scope="col" class="py-3.5 text-left text-sm font-semibold text-gray-900">Updated</th>
          <th scope="col" class="py-3.5"></th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">
        <tr v-for="funnel in funnels" :key="funnel.id" @click="router.push({name: 'funnel', params: {funnel: funnel.id}})" class="hover:bg-gray-50 cursor-pointer">
          <!-- Funnel -->
          <td class="whitespace-nowrap py-4 pl-4 pr-6 text-sm sm:pl-6">
            <div class="flex-auto">
              <p class="mb-1 text-base font-medium leading-6 text-gray-900">{{ funnel.name }}</p>
              <p class="text-sm leading-5 text-gray-400">{{ funnel.steps.length }} steps</p>
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
          <td scope="col" class="py-4 pr-4 text-right sm:pr-6">
            <AppButton @click.stop="destroyFunnel(funnel.id)" variant="tertiary">Delete</AppButton>
          </td>
        </tr>
      </tbody>
    </table>
    
    
    <!-- Empty state: No funnels -->
    <div v-else class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <FunnelIcon class="mx-auto h-10 w-10 text-indigo-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-gray-900">No funnels</h2>
      <p class="mt-1 text-gray-400">Get started by creating a funnel.</p>
    </div>

    <GenerateFunnelsModal :open="isModalOpen" @done="indexFunnels()"/>
  </LayoutWithSidebar>
</template>

<script setup>
import moment from 'moment'
import { ref, onMounted, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { FunnelIcon } from '@heroicons/vue/24/outline'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'
import GenerateFunnelsModal from '@/views/funnels/modals/GenerateFunnelsModal.vue'

const route = useRoute()
const router = useRouter()
const funnels = ref()
const isModalOpen = ref(false)
const isAutomating = ref(false)

provide('isModalOpen', isModalOpen)
provide('isAutomating', isAutomating)

function storeNewFunnel() {
  funnelApi.store(route.params.organization, {
    name: 'New funnel',
    description: 'This is the funnel descriptions'
  }).then(response => {
    let funnel = response.data.data
    router.push({ name: 'funnel', params: { funnel: funnel.id } })
  })
}

function destroyFunnel(funnelId) {
  funnels.value = funnels.value.filter(funnel => funnel.id !== funnelId)

  funnelApi.destroy(route.params.organization, funnelId)
    // .then(response => {
    //   indexFunnels()
    // })
}

function indexFunnels() {
  funnelApi.index(route.params.organization).then(response => {
    funnels.value = response.data.data
  })
}

function toggleModal() { 
  isModalOpen.value = !isModalOpen.value 
}

onMounted(() => {
  indexFunnels()
})
</script>
