<template>
  <div class="max-w-xl">
    <div v-if="organizationStore.organization">
      <!-- Organization settings -->
      <AppCard class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <div>
            <p class="text-gray-900 font-medium mb-2">Organization</p>
            <p class="text-sm text-gray-500">General information about your organization.</p>
          </div>
          <AppButton @click="organizationStore.toggleUpdateModal()" variant="tertiary">Edit</AppButton>
        </div>

        <dl v-if="organizationStore.organization" class="divide-y divide-gray-200">
          <div class="px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
            <dt class="text-sm leading-6 text-gray-900">Name</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-500 sm:col-span-1 sm:mt-0">{{ organizationStore.organization.title }}</dd>
          </div>
          <div class="px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
            <dt class="text-sm leading-6 text-gray-900">Slug</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-500 sm:col-span-1 sm:mt-0">{{ organizationStore.organization.slug }}</dd>
          </div>
          <div class="px-4 pt-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
            <dt class="text-sm leading-6 text-gray-900">Website domain</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-500 sm:col-span-1 sm:mt-0">{{ organizationStore.organization.domain }}</dd>
          </div>
        </dl>
      </AppCard>

      <!-- ROAA settings -->
      <AppCard class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <div>
            <p class="text-gray-900 font-medium mb-2">Return on average assets (ROAA)</p>
            <p class="text-sm text-gray-500">Set the default ROAA for all funnels.</p>
          </div>
          <AppButton @click="organizationStore.toggleUpdateROAAModal()" variant="tertiary">Edit</AppButton>
        </div>

        <dl v-if="organizationStore.organization" class="divide-y divide-gray-200 border-t">
          <div class="px-4 pt-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
            <dt class="text-sm leading-6 text-gray-900">Default ROAA</dt>
            <dd class="mt-1 text-sm leading-6 text-gray-500 sm:col-span-1 sm:mt-0">{{ organizationStore.organization.return_on_assets }}%</dd>
          </div>
        </dl>
      </AppCard>

      <!-- Welcome screen -->
      <AppCard class="mb-12">
        <div class="mb-6">
          <p class="text-gray-900 font-medium mb-2">Welcome screen</p>
          <p class="text-sm text-gray-500">Control the welcome onboarding screen.</p>
        </div>

        <div class="border-t pt-6">
          <AppButton @click="toggleOnboarding()" variant="tertiary">
            {{ organizationStore.organization.onboarding['hideOnboarding'] == true ? 'Display welcome screen' : 'Hide welcome screen'}}
          </AppButton>
        </div>
      </AppCard>

      <!-- Danger zone -->
      <AppCard class="mb-12">
        <div class="mb-6">
          <p class="text-gray-900 font-medium mb-2">Danger zone</p>
          <p class="text-sm text-gray-500">Irreversible and destructive actions.</p>
        </div>

        <div class="border-t pt-6">
          <AppButton @click="organizationStore.toggleDestroyModal()" variant="danger">Delete this organization</AppButton>
        </div>
      </AppCard>

      <!-- Modals -->
      <UpdateOrganizationModal/>
      <UpdateOrganizationROAAModal/>
      <DestroyOrganizationModal/>
    </div>
  </div>
</template>

<script setup>
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import UpdateOrganizationModal from '@/views/base/settings/modals/UpdateOrganizationModal.vue'
import UpdateOrganizationROAAModal from '@/views/base/settings/modals/UpdateOrganizationROAAModal.vue'
import DestroyOrganizationModal from '@/views/base/settings/modals/DestroyOrganizationModal.vue'

const organizationStore = useOrganizationStore()

const toggleOnboarding = () => {
  let current = organizationStore.organization.onboarding['hideOnboarding']

  organizationStore.organization.onboarding['hideOnboarding'] = !current

  organizationStore.update()
}
</script>
