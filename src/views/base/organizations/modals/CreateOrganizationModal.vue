<template>
  <AppModal 
    size="md"
    @closed="organizationStore.toggleCreateModal()" 
    :open="organizationStore.createModalOpen"
  >
    <form action="#" @submit.prevent="create()" class="flex flex-col gap-3">
      <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Create organization</h3>
      <AppInput v-model="newOrganization.title" label="Organization Name" placeholder="Acme Credit Union" required />
      <AppButton :loading="organizationStore.loading" class="w-full">Create</AppButton>
    </form>
  </AppModal>
</template>

<script setup>
import { ref } from 'vue'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'

const organizationStore = useOrganizationStore()

const newOrganization = ref({
  title: '',
  is_private: 1,
})

function create() {
  organizationStore.store(newOrganization.value)
    .then(() => {
      organizationStore.toggleCreateModal()
      
      newOrganization.value = {
        title: '',
        is_private: 1,
      }
    })
}
</script>
