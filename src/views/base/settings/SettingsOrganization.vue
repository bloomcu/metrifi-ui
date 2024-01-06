<template>
  <div class="max-w-2xl">
    <div class="mb-12">
      <div class="flex justify-between mb-6">
        <div>
          <p class="text-gray-900 font-medium mb-2">Organization</p>
          <p class="text-sm text-gray-500">Your organizations details.</p>
        </div>
        <div>
          <AppButton :to="{}" variant="tertiary">Edit info</AppButton>
        </div>
      </div>

      <dl class="divide-y divide-gray-200">
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm leading-6 text-gray-900">Title</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-500 sm:col-span-2 sm:mt-0">BloomCU</dd>
        </div>
        <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt class="text-sm leading-6 text-gray-900">Organization Id</dt>
          <dd class="mt-1 text-sm leading-6 text-gray-500 sm:col-span-2 sm:mt-0">57c9b00e-ddf0-438a-b8a4-fea94b665c29</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script setup>
import moment from "moment"
import { onMounted } from 'vue'
import { useOrganizationStore } from '@/domain/base/organizations/store/useOrganizationStore'
import SettingsTabs from '@/views/base/settings/components/SettingsTabs.vue'

const organizationStore = useOrganizationStore()

onMounted(async () => {
  organizationStore.show()
})
</script>
