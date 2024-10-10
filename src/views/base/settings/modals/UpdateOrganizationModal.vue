<template>
  <AppModal 
    size="lg"
    @closed="organizationStore.toggleUpdateModal()" 
    :open="organizationStore.updateModalOpen"
  >
    <div class="p-6">
      <form action="#" @submit.prevent="update()" class="flex flex-col gap-6">
        <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Update organization</h3>
        <AppInput v-model="organizationStore.organization.title" label="Organization Name" required />
        <AppInput v-model="organizationStore.organization.domain" label="Website domain" />
        <AppButton :loading="organizationStore.loading" class="w-full">Update</AppButton>
      </form>
    </div>
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
