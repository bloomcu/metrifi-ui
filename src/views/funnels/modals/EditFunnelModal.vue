<template>
  <AppModal 
    size="md"
    @closed="isOpen = false" 
    :open="isOpen"
  >
    <div class="p-6">
      <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-6 sm:truncate sm:text-2xl">Edit funnel</h3>

      <form action="#" @submit.prevent="updateFunnel()" class="flex flex-col gap-4">
        <AppInput v-model="funnelStore.funnel.name" label="Funnel name" required />
        <AppButton :loading="loading" class="w-full">Update</AppButton>
      </form>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { useFunnelStore } from '@/domain/funnels/store/useFunnelStore'

const route = useRoute()
const loading = ref(false)
const funnelStore = useFunnelStore()
// const funnel = inject('funnel')
const isUpdating = inject('isUpdating')
const isOpen = inject('isEditFunnelModalOpen')

function updateFunnel() {
  console.log('Updating funnel...')
  isUpdating.value = true

  funnelApi.update(route.params.organization, route.params.funnel, {
    name: funnelStore.funnel.value.name,
  }).then(() => {
    isOpen.value = false
    setTimeout(() => isUpdating.value = false, 500);
  })
}
</script>
