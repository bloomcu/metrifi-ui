<template>
  <AppModal 
    size="2xl"
    @closed="organizationStore.toggleDestroyModal()"
    :open="organizationStore.destroyModalOpen"
  >
    <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-3 sm:truncate sm:text-2xl">
      Delete organization
    </h3>

    <p class="leading-6 mb-8 text-gray-700">
      Deleting the 
      <span class="rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
        {{ organizationStore.organization.title }}
      </span>
      organization will also delete all associated data. This action cannot be undone. Are you sure you want to delete?
    </p>

    <div class="flex justify-end gap-3 border-t pt-4">
      <AppButton @click="organizationStore.toggleDestroyModal()" variant="tertiary">Never mind</AppButton>
      <AppButton @click="destroy()" :loading="organizationStore.loading" variant="primary">Delete</AppButton>
    </div>
  </AppModal>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useOrganizationStore } from '@/domain/base/organizations/store/useOrganizationStore'

const route = useRoute()
const router = useRouter()
const organizationStore = useOrganizationStore()

function destroy() {
  organizationStore.destroy(route.params.organization)
    .then(() => {
      organizationStore.toggleDestroyModal()
      router.push({ name: 'logout' })
    })
}
</script>
