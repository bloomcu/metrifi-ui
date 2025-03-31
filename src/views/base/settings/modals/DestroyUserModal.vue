<template>
  <AppModal 
    size="2xl"
    @closed="isModalOpen = false" 
    :open="isModalOpen"
  >
    <div class="p-6">
      <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-3 sm:truncate sm:text-2xl">Remove user</h3>

      <p class="leading-6 mb-8 text-gray-700">
        Removing 
        <span class="inline-flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
          {{ userToBeDestroyed.name }}
        </span>
        from your organization will also remove any connections, funnels and dashboards they own. This action cannot be undone.
      </p>

      <p class="leading-6 mb-8 text-gray-700">
        Are you sure you want to remove this user?
      </p>

      <div class="flex justify-end gap-3 border-t pt-4">
        <AppButton @click="isModalOpen = false" variant="tertiary">Never mind</AppButton>
        <AppButton @click="destroyUser()" variant="primary">Remove user</AppButton>
      </div>
    </div>
  </AppModal>
</template>

<script setup>
import { inject } from 'vue'
import { useUserStore } from '@/domain/base/users/store/useUserStore'

const isModalOpen = inject('isModalOpen')
const userToBeDestroyed = inject('userToBeDestroyed')
const userStore = useUserStore()

function destroyUser() {
  userStore.destroy(userToBeDestroyed.value.id)
    .then(() => {
      isModalOpen.value = false
    })
}
</script>
