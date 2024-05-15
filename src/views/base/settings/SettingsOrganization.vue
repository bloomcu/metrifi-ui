<template>
  <div class="max-w-xl">
    <AppCard class="mb-12">
      <div class="flex items-center justify-between mb-6">
        <div>
          <p class="text-gray-900 font-medium mb-2">Organization</p>
          <p class="text-sm text-gray-500">General information about your organization</p>
        </div>
        <AppButton @click="organizationStore.toggleUpdateModal()" variant="tertiary">Edit</AppButton>
      </div>

      <dl v-if="organizationStore.organization" class="divide-y divide-gray-200">
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm leading-6 text-gray-900">Name</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-500 sm:col-span-2 sm:mt-0">{{ organizationStore.organization.title }}</dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm leading-6 text-gray-900">Slug</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-500 sm:col-span-2 sm:mt-0">{{ organizationStore.organization.slug }}</dd>
        </div>
      </dl>
    </AppCard>

    <AppCard class="mb-12">
      <div class="mb-6">
        <p class="text-gray-900 font-medium mb-2">Danger zone</p>
        <p class="text-sm text-gray-500">Irreversible and destructive actions</p>
      </div>

      <div class="border-t pt-4">
        <AppButton @click="organizationStore.toggleDestroyModal()" variant="danger">Delete this organization</AppButton>
      </div>
    </AppCard>

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
