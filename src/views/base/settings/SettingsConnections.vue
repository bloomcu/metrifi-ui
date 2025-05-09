<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
        <h2 class="text-base font-medium leading-6 text-gray-900">Connections</h2>
        <AppButton @click="showConnectionTypeModal = true">Add connection</AppButton>
    </div>

    <table v-if="connections && connections.length" class="min-w-full table-fixed overflow-hidden divide-y divide-gray-300 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
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
        <tr v-for="(connection, index) in connections" :key="connection.id">
          <!-- Id -->
          <td class="whitespace-nowrap py-4 text-sm text-gray-400 pl-4 sm:pl-6">
            <p>{{ connection.id }}</p>
          </td>

          <!-- Service -->
          <td class="whitespace-nowrap flex items-center gap-5 text-sm py-4 pr-6">
            <svg v-if="connection.service === 'Google Analytics - Property'" class="w-6 h-6" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
            <svg v-else-if="connection.service === 'WordPress Website'" class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.3 8 8 119.2 8 256c0 136.7 111.3 248 248 248s248-111.3 248-248C504 119.2 392.7 8 256 8M33 256c0-32.3 6.9-63 19.3-90.7l106.4 291.4C84.3 420.5 33 344.2 33 256m223 223c-21.9 0-43-3.2-63-9.1l66.9-194.4l68.5 187.8c.5 1.1 1 2.1 1.6 3.1c-23.1 8.1-48 12.6-74 12.6m30.7-327.5c13.4-.7 25.5-2.1 25.5-2.1c12-1.4 10.6-19.1-1.4-18.4c0 0-36.1 2.8-59.4 2.8c-21.9 0-58.7-2.8-58.7-2.8c-12-.7-13.4 17.7-1.4 18.4c0 0 11.4 1.4 23.4 2.1l34.7 95.2L200.6 393l-81.2-241.5c13.4-.7 25.5-2.1 25.5-2.1c12-1.4 10.6-19.1-1.4-18.4c0 0-36.1 2.8-59.4 2.8c-4.2 0-9.1-.1-14.4-.3C109.6 73 178.1 33 256 33c58 0 110.9 22.2 150.6 58.5c-1-.1-1.9-.2-2.9-.2c-21.9 0-37.4 19.1-37.4 39.6c0 18.4 10.6 33.9 21.9 52.3c8.5 14.8 18.4 33.9 18.4 61.5c0 19.1-7.3 41.2-17 72.1l-22.2 74.3zm81.4 297.2l68.1-196.9c12.7-31.8 17-57.2 17-79.9c0-8.2-.5-15.8-1.5-22.9c17.4 31.8 27.3 68.2 27.3 107c0 82.3-44.6 154.1-110.9 192.7"/></svg>
            <div class="flex-auto">
              <p class="mb-1 text-sm leading-5 text-gray-400">{{ connection.service }}</p>
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

    <!-- Connection Type Modal -->
    <AppModal 
        size="lg"
        :open="showConnectionTypeModal"
        @closed="showConnectionTypeModal = false" 
    >
        <div class="p-6">
            <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Select connection type</h3>
            <div class="mt-6 grid grid-cols-2 gap-4">
                <div @click="selectConnectionType('google')" class="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-violet-50 hover:border-violet-400">
                    <svg class="w-10 h-10 mb-2" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
                    <p class="text-base font-medium text-gray-900">Google Analytics</p>
                </div>
                <div @click="selectConnectionType('wordpress')" class="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-violet-50 hover:border-violet-400">
                    <svg class="w-10 h-10 mb-2" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512"><path fill="currentColor" d="M256 8C119.3 8 8 119.2 8 256c0 136.7 111.3 248 248 248s248-111.3 248-248C504 119.2 392.7 8 256 8M33 256c0-32.3 6.9-63 19.3-90.7l106.4 291.4C84.3 420.5 33 344.2 33 256m223 223c-21.9 0-43-3.2-63-9.1l66.9-194.4l68.5 187.8c.5 1.1 1 2.1 1.6 3.1c-23.1 8.1-48 12.6-74 12.6m30.7-327.5c13.4-.7 25.5-2.1 25.5-2.1c12-1.4 10.6-19.1-1.4-18.4c0 0-36.1 2.8-59.4 2.8c-21.9 0-58.7-2.8-58.7-2.8c-12-.7-13.4 17.7-1.4 18.4c0 0 11.4 1.4 23.4 2.1l34.7 95.2L200.6 393l-81.2-241.5c13.4-.7 25.5-2.1 25.5-2.1c12-1.4 10.6-19.1-1.4-18.4c0 0-36.1 2.8-59.4 2.8c-4.2 0-9.1-.1-14.4-.3C109.6 73 178.1 33 256 33c58 0 110.9 22.2 150.6 58.5c-1-.1-1.9-.2-2.9-.2c-21.9 0-37.4 19.1-37.4 39.6c0 18.4 10.6 33.9 21.9 52.3c8.5 14.8 18.4 33.9 18.4 61.5c0 19.1-7.3 41.2-17 72.1l-22.2 74.3zm81.4 297.2l68.1-196.9c12.7-31.8 17-57.2 17-79.9c0-8.2-.5-15.8-1.5-22.9c17.4 31.8 27.3 68.2 27.3 107c0 82.3-44.6 154.1-110.9 192.7"/></svg>
                    <p class="text-base font-medium text-gray-900">WordPress Website</p>
                </div>
            </div>
        </div>
    </AppModal>

    <!-- WordPress Connection Modal -->
    <WordPressConnectionModal 
        :open="showWordPressModal"
        @closed="showWordPressModal = false"
        @connected="handleWordPressConnected"
    />

    <DisconnectConnectionModal/>
  </div>
</template>

<script setup>
import moment from 'moment'
import { ref, onMounted, provide, watch } from 'vue'
import { useRoute } from 'vue-router'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import DisconnectConnectionModal from '@/views/base/settings/modals/DisconnectConnectionModal.vue'
import WordPressConnectionModal from '@/views/base/settings/modals/WordPressConnectionModal.vue'
import axios from 'axios'

const route = useRoute()

const errorStore = useErrorStore()

const connections = ref([])
const isLoading = ref(true)
const isModalOpen = ref(false)
const connectionToBeDisconnected = ref()
const showConnectionTypeModal = ref(false)
const showWordPressModal = ref(false)

provide('isModalOpen', isModalOpen)
provide('connectionToBeDisconnected', connectionToBeDisconnected)

function toggleModal(connection) { 
  isModalOpen.value = !isModalOpen.value 
  connectionToBeDisconnected.value = connection
}

function selectConnectionType(type) {
  showConnectionTypeModal.value = false
  
  if (type === 'google') {
    connectToGoogle()
  } else if (type === 'wordpress') {
    showWordPressModal.value = true
  }
}

function handleWordPressConnected(connection) {
  connections.value.push(connection)
  showWordPressModal.value = false
}

const { connectToGoogle } = useConnections()

onMounted(() => {
  isLoading.value = true
  connectionApi.index(route.params.organization)
    .then(response => {
      connections.value = response.data.data // Show all connections
      isLoading.value = false
    })
    .catch(error => {
      console.error('Failed to load connections:', error)
      connections.value = []
      isLoading.value = false
    })
})
</script>
