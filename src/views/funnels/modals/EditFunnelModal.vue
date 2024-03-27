<template>
  <AppModal 
    size="md"
    @closed="isOpen = false" 
    :open="isOpen"
  >
    <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-6 sm:truncate sm:text-2xl">Edit funnel</h3>

    <form action="#" @submit.prevent="updateFunnel()" class="flex flex-col gap-4">
      <AppInput v-model="funnel.name" label="Funnel name" required />
      <AppInput v-model="funnel.conversion_value" label="Value of a conversion" />
      <AppButton :loading="loading" class="w-full">Update</AppButton>
    </form>
  </AppModal>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'

const route = useRoute()
const loading = ref(false)

const funnel = inject('funnel')
const isUpdating = inject('isUpdating')
const isOpen = inject('isEditFunnelModalOpen')

function updateFunnel() {
  console.log('Updating funnel...')
  isUpdating.value = true

  funnelApi.update(route.params.organization, route.params.funnel, {
    name: funnel.value.name,
    conversion_value: funnel.value.conversion_value,
  }).then(() => {
    isOpen.value = false
    setTimeout(() => isUpdating.value = false, 500);
  })
}
</script>
