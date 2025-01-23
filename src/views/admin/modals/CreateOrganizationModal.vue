<template>
  <AppModal 
    size="md"
    @closed="adminOrganizationStore.toggleCreateModal()" 
    :open="adminOrganizationStore.createModalOpen"
  >
    <div class="p-6">
      <form action="#" @submit.prevent="create()" class="flex flex-col gap-6">
        <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Create organization</h3>
        <AppInput v-model="newOrganization.title" label="Organization Name" placeholder="Acme Credit Union" :errors="errorStore.errors.title" required />
        <AppInput v-model="newOrganization.domain" label="Website domain" placeholder="acmecu.com" :errors="errorStore.errors.domain" required />
        <AppButton :loading="adminOrganizationStore.loading" class="w-full">Create</AppButton>
      </form>
    </div>
  </AppModal>
</template>

<script setup>
import { ref } from 'vue'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useAdminOrganizationStore } from '@/domain/admin/store/useAdminOrganizationStore'

const errorStore = useErrorStore()
const adminOrganizationStore = useAdminOrganizationStore()

const newOrganization = ref({
  title: '',
  domain: '',
  is_private: 1,
})

function create() {
  adminOrganizationStore.store(newOrganization.value)
    .then(() => {
      adminOrganizationStore.toggleCreateModal();

      newOrganization.value = {
        title: '',
        domain: '',
        is_private: 1,
      };
    })
    .catch(error => {
      // Handle the error gracefully (e.g., show an error message)
      console.error('Failed to create organization:', error.response?.data || error);
    });
}

</script>
