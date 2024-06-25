<template>
  <LayoutDefault>
    <!-- Header -->
    <AppHeader class="pt-6">
      <h1 class="text-3xl font-medium leading-6 text-gray-900">Organizations</h1>
      <AppButton @click="organizationStore.toggleCreateModal">Create organization</AppButton>
    </AppHeader>

    <!-- Organizations -->
    <AppCard padding="none">
      <ul role="list" class="divide-y divide-gray-100">
        <li v-for="organization in organizationStore.organizations" :key="organization.slug" class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
          <!-- Organization title -->
          <div class="flex gap-x-4">
            <div class="min-w-0 flex-auto">
              <p class="text-base font-medium leading-6 text-gray-900">
                <a :href="`/${organization.slug}`">
                  <span class="absolute inset-x-0 -top-px bottom-0" />
                  {{ organization.title }}
                </a>
              </p>
            </div>
          </div>

          <!-- Onboarding statuses -->
          <div class="flex items-center gap-x-4">
            
            <span v-if="organization.is_private" class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs text-gray-900 bg-red-50 ring-1 ring-inset ring-gray-200">
              <EyeSlashIcon class="text-red-500 h-4 w-4" aria-hidden="true" />
              Private
            </span>
            <span v-else class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs text-gray-900 bg-green-50 ring-1 ring-inset ring-gray-200">
              <EyeIcon class="text-green-500 h-4 w-4" aria-hidden="true" />
              Anonymous
            </span>

            <span v-if="organization.onboarding.onboardingComplete" class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs text-gray-900 bg-green-50 ring-1 ring-inset ring-gray-200">
              <svg class="h-1.5 w-1.5 fill-green-500" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
              Onboarding complete
            </span>
            <span v-else class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs text-gray-900 bg-red-50 ring-1 ring-inset ring-gray-200">
              <svg class="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
              Onboarding incomplete
            </span>

            <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
          </div>
        </li>
      </ul>
    </AppCard>
    
    <CreateOrganizationModal/>
  </LayoutDefault>
</template>

<script setup>
import { onMounted } from 'vue'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import { ChevronRightIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import CreateOrganizationModal from '@/views/base/organizations/modals/CreateOrganizationModal.vue'

const organizationStore = useOrganizationStore()
const redirectRoute = import.meta.env.VITE_REDIRECT_FROM_ORGANIZATIONS_ROUTE

onMounted(() => {
    organizationStore.index()
})
</script>
