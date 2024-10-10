<template>
  <AppModal 
    size="md"
    @closed="adminOrganizationStore.toggleCreateModal()" 
    :open="adminOrganizationStore.createModalOpen"
  >
    <div class="p-6">
      <form action="#" @submit.prevent="create()" class="flex flex-col gap-6">
        <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Create organization</h3>
        <AppInput v-model="newOrganization.title" label="Organization Name" placeholder="Acme Credit Union" required />
        <AppButton :loading="adminOrganizationStore.loading" class="w-full">Create</AppButton>
      </form>
    </div>
  </AppModal>
</template>

<script setup>
import { ref } from 'vue'
import { useAdminOrganizationStore } from '@/domain/admin/store/useAdminOrganizationStore'

const adminOrganizationStore = useAdminOrganizationStore()

const newOrganization = ref({
  title: '',
  is_private: 1,
})

function create() {
  adminOrganizationStore.store(newOrganization.value)
    .then(() => {
      adminOrganizationStore.toggleCreateModal()
      
      newOrganization.value = {
        title: '',
        is_private: 1,
      }
    })
}
</script>
