<template>
  <div class="max-w-xl">
    <div class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <div>
          <p class="text-gray-900 font-medium mb-2">Organization</p>
          <p class="text-sm text-gray-500">Your organizations details.</p>
        </div>
        <div class="flex gap-2">
          <AppButton @click="organizationStore.toggleDestroyModal()" variant="tertiary">Delete</AppButton>
          <AppButton @click="organizationStore.toggleUpdateModal()" variant="tertiary">Edit</AppButton>
        </div>
      </div>

      <dl v-if="organizationStore.organization" class="divide-y divide-gray-200">
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm leading-6 text-gray-900">Title</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-500 sm:col-span-2 sm:mt-0">{{ organizationStore.organization.title }}</dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm leading-6 text-gray-900">Slug</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-500 sm:col-span-2 sm:mt-0">{{ organizationStore.organization.slug }}</dd>
        </div>
      </dl>
    </div>

    <UpdateOrganizationModal/>
    <DestroyOrganizationModal/>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/domain/base/organizations/store/useOrganizationStore'
import UpdateOrganizationModal from '@/views/base/settings/modals/UpdateOrganizationModal.vue'
import DestroyOrganizationModal from '@/views/base/settings/modals/DestroyOrganizationModal.vue'

const organizationStore = useOrganizationStore()
</script>
