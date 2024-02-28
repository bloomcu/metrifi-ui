<template>
  <AppModal 
    size="2xl"
    @closed="isModalOpen = false" 
    :open="isModalOpen"
  >
    <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-6 sm:truncate sm:text-2xl">Archive connection</h3>

    <p class="mb-6">This action will cause all funnels using this connection to also be archived. Are you sure you want to archive this connection? </p>

    <div class="flex gap-2 justify-end">
      <AppButton @click="isModalOpen = false" variant="tertiary">Nevermind</AppButton>
      <AppButton @click="disconnect()" variant="primary">Confirm</AppButton>
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
