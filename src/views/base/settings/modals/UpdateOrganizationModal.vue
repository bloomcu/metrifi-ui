<template>
  <AppModal 
    size="lg"
    @closed="organizationStore.toggleUpdateModal()" 
    :open="organizationStore.updateModalOpen"
  >
    <div class="p-6">
      <form action="#" @submit.prevent="update()" class="flex flex-col gap-6">
        <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Update organization</h3>
        <AppInput v-model="organizationStore.organization.title" label="Organization Name" :errors="errorStore.errors.title" required />
        <AppInput v-model="organizationStore.organization.domain" label="Website domain" :errors="errorStore.errors.domain" required />
        <AppButton :loading="organizationStore.loading" class="w-full">Update</AppButton>
      </form>
    </div>
  </AppModal>
</template>

<script setup>
import { computed } from 'vue'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'

const errorStore = useErrorStore()
const organizationStore = useOrganizationStore()

function update() {
  organizationStore.update()
    .then(() => {
      organizationStore.toggleUpdateModal();
    })
    .catch(error => {
      // Handle the error gracefully (e.g., show an error message)
      console.error('Failed to update organization:', error.response?.data || error);
    });
}
</script>
