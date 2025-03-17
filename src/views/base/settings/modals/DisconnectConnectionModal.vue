<template>
  <AppModal 
    size="2xl"
    @closed="isModalOpen = false" 
    :open="isModalOpen"
  >
    <div class="p-6">
      <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-3 sm:truncate sm:text-2xl">Disconnect</h3>

      <p v-if="connectionToBeDisconnected.service === 'Google Analytics - Property'" class="leading-6 mb-8 text-gray-700">
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
      
      <p v-else-if="connectionToBeDisconnected.service === 'WordPress Website'" class="leading-6 mb-8 text-gray-700">
        Disconnecting 
        <span class="inline-flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512" class="w-4 h-4"><path fill="currentColor" d="M256 8C119.3 8 8 119.2 8 256c0 136.7 111.3 248 248 248s248-111.3 248-248C504 119.2 392.7 8 256 8M33 256c0-32.3 6.9-63 19.3-90.7l106.4 291.4C84.3 420.5 33 344.2 33 256m223 223c-21.9 0-43-3.2-63-9.1l66.9-194.4l68.5 187.8c.5 1.1 1 2.1 1.6 3.1c-23.1 8.1-48 12.6-74 12.6m30.7-327.5c13.4-.7 25.5-2.1 25.5-2.1c12-1.4 10.6-19.1-1.4-18.4c0 0-36.1 2.8-59.4 2.8c-21.9 0-58.7-2.8-58.7-2.8c-12-.7-13.4 17.7-1.4 18.4c0 0 11.4 1.4 23.4 2.1l34.7 95.2L200.6 393l-81.2-241.5c13.4-.7 25.5-2.1 25.5-2.1c12-1.4 10.6-19.1-1.4-18.4c0 0-36.1 2.8-59.4 2.8c-4.2 0-9.1-.1-14.4-.3C109.6 73 178.1 33 256 33c58 0 110.9 22.2 150.6 58.5c-1-.1-1.9-.2-2.9-.2c-21.9 0-37.4 19.1-37.4 39.6c0 18.4 10.6 33.9 21.9 52.3c8.5 14.8 18.4 33.9 18.4 61.5c0 19.1-7.3 41.2-17 72.1l-22.2 74.3zm81.4 297.2l68.1-196.9c12.7-31.8 17-57.2 17-79.9c0-8.2-.5-15.8-1.5-22.9c17.4 31.8 27.3 68.2 27.3 107c0 82.3-44.6 154.1-110.9 192.7"/></svg>
          {{ connectionToBeDisconnected.name }}
        </span>
        will prevent MetriFi from pushing prototypes to this WordPress website. Are you sure you want to disconnect?
      </p>
      
      <p v-else class="leading-6 mb-8 text-gray-700">
        Disconnecting 
        <span class="inline-flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          {{ connectionToBeDisconnected.name }}
        </span>
        will also delete 
        <span class="inline-flex rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          {{ connectionToBeDisconnected.funnels_count }} funnels
        </span>
        that use the connection. This action cannot be undone. Are you sure you want to disconnect?
      </p>

      <div class="flex justify-end gap-3 border-t pt-4">
        <AppButton @click="isModalOpen = false" variant="tertiary">Never mind</AppButton>
        <AppButton @click="disconnect()" variant="primary">Disconnect</AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup>
import { inject } from 'vue'
import { useRoute } from 'vue-router'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'

const route = useRoute()
const organizationStore = useOrganizationStore()
const isModalOpen = inject('isModalOpen')
const connectionToBeDisconnected = inject('connectionToBeDisconnected')

function disconnect() {
  connectionApi.destroy(route.params.organization, connectionToBeDisconnected.value.id)
    .then(() => {
      updateOrganization()
    })
}

function updateOrganization() {
    if (connectionToBeDisconnected.value.service === 'Google Analytics - Property') {
        // Update the organization onboarding
        organizationStore.organization.onboarding['connect-google-analytics'] = 'incomplete'
        organizationStore.organization.onboarding['onboardingComplete'] = false

        organizationStore.update()
        .then(() => {
            location.reload()
        })

        return
    }

    location.reload()
}
</script>
