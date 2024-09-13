<template>
  <LayoutWithSidebar>
    <template #topbar>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Connection</h1>
        <AppButton v-if="!connection" @click="connectToGoogle()">Connect Google Analytics</AppButton>
      </div>
    </template>

    <!-- <table v-if="connections && connections.length" class="min-w-full table-fixed overflow-hidden divide-y divide-gray-300 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg"> -->
    <table v-if="connection" class="min-w-full table-fixed overflow-hidden divide-y divide-gray-300 ring-1 ring-gray-300 mb-20 sm:mx-0 sm:rounded-lg"> 
      <thead>
        <tr>
          <th scope="col" class="py-3.5 pl-4 pr-12 text-left text-sm font-semibold text-gray-900 sm:pl-6">Id</th>
          <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Service</th>
          <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Connected</th>
          <th scope="col" class="py-3.5 text-left text-sm font-semibold text-gray-900">Refreshed</th>
          <th scope="col" class="py-3.5"></th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">
        <!-- <tr v-for="(connection, index) in connections" :key="connection.id"> -->
        <tr>
          <!-- Id -->
          <td class="whitespace-nowrap py-4 pl-4 pr-6 text-gray-400 sm:pl-6">
            <p>{{ connection.id }}</p>
          </td>

          <!-- Service -->
          <td class="whitespace-nowrap flex items-center gap-6 py-4 pr-6 text-sm">
            <svg class="w-6 h-6" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
            <div class="flex-auto">
              <p class="mb-1 text-sm leading-5 text-gray-400">{{ connection.account_name }}</p>
              <p class="text-base font-medium leading-6 text-gray-900">{{ connection.name }}</p>
            </div>
          </td>

          <!-- Connected -->
          <td class="whitespace-nowrap py-4 text-sm text-gray-400">
            <p>{{ moment(connection.created_at).fromNow() }}</p>
            <p>by {{ connection.user.name }}</p>
          </td>

          <!-- Updated -->
          <td class="whitespace-nowrap py-4 text-sm text-gray-400">
            <p>{{ moment(connection.updated_at).fromNow() }}</p>
          </td>

          <!-- Disconnect -->
          <td scope="col" class="py-4 pr-4 text-right sm:pr-6">
            <AppButton @click="toggleModal(connection)" variant="tertiary">Disconnect</AppButton>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty state: No connections -->
    <div v-else class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <CloudIcon class="mx-auto h-10 w-10 text-indigo-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-gray-900">No connection</h2>
      <p class="mt-1 text-gray-400">Get started by connecting Google Analytics.</p>
    </div>

    <DisconnectConnectionModal/>
  </LayoutWithSidebar>
</template>
  
<script setup>
import moment from 'moment'
import { ref, onMounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import { googleApi } from '@/domain/services/google/api/googleApi.js'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'
import { CloudIcon } from '@heroicons/vue/24/outline'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'
import DisconnectConnectionModal from '@/views/connections/modals/DisconnectConnectionModal.vue'

const route = useRoute()

const connection = ref() // Enable only a single connection
// const connections = ref() // Enable multiple connections
const isModalOpen = ref(false)
const connectionToBeDisconnected = ref()

provide('isModalOpen', isModalOpen)
provide('connectionToBeDisconnected', connectionToBeDisconnected)

function connectToGoogle() {
  googleApi.connect({
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    state: route.params.organization,
  })
  .then(response => {
    window.location.href = response.data.url
  })
}

function toggleModal(connection) { 
  isModalOpen.value = !isModalOpen.value 
  connectionToBeDisconnected.value = connection
}

onMounted(() => {
  connectionApi.index(route.params.organization).then(response => {
    connection.value = response.data.data[0] // Show first connection
    // connections.value = response.data.data // Show all connections
  })
})
</script>
