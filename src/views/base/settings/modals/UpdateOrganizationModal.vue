<template>
  <AppModal 
    size="md"
    @closed="organizationStore.toggleUpdateModal()" 
    :open="organizationStore.updateModalOpen"
  >
    <form action="#" @submit.prevent="update()" class="flex flex-col gap-3">
      <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Update organization</h3>
      <AppInput v-model="organizationStore.organization.title" label="Organization Name" required />
      <AppInput v-model="organizationStore.organization.domain" label="Website domain" />
      <AppButton :loading="organizationStore.loading" class="w-full">Update</AppButton>
    </form>
  </AppModal>
</template>

<script setup>
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'

const organizationStore = useOrganizationStore()

function update() {
  organizationStore.update()
    .then(() => {
      organizationStore.toggleUpdateModal()
    })
}
</script>
