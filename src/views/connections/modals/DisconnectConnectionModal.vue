<template>
  <AppModal 
    size="2xl"
    @closed="isModalOpen = false" 
    :open="isModalOpen"
  >
    <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-3 sm:truncate sm:text-2xl">
      Disconnect
    </h3>

    <p class="leading-6 mb-8 text-gray-700">
      Disconnecting 
      <span class="inline-flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
        <svg class="w-4 h-4" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
        {{ connectionToBeDisconnected.name }}
      </span>
      will also delete 
      <span class="inline-flex rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
        {{ connectionToBeDisconnected.funnels_count }} funnels
      </span>
      that use the connection. This action cannot be undone. Are you sure you want to disconnect?
    </p>

    <div class="flex justify-end gap-3 border-t pt-4">
      <AppButton @click="isModalOpen = false" variant="tertiary" size="md">Never mind</AppButton>
      <AppButton @click="disconnect()" variant="primary" size="md">Disconnect</AppButton>
    </div>
  </AppModal>
</template>

<script setup>
import { inject } from 'vue'
import { useRoute } from 'vue-router'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'

const route = useRoute()
const isModalOpen = inject('isModalOpen')
const connectionToBeDisconnected = inject('connectionToBeDisconnected')

function disconnect() {
  console.log('Disconnecting connection...')

  connectionApi.destroy(route.params.organization, connectionToBeDisconnected.value.id)
    .then(() => {
      location.reload()
    })
}
</script>
