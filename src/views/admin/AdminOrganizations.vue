<template>
  <LayoutAdmin>
    <template #topbar>
      <div class="relative pb-5 sm:pb-0">
        <!-- Title -->
        <div class="md:flex md:items-center md:justify-between">
          <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Organizations</h1>
          <div class="flex gap-3 md:absolute md:right-0">
            <AppButton @click="adminOrganizationStore.toggleCreateModal">Create organization</AppButton>
          </div>
        </div>
      </div>
    </template>

    <!-- Organizations -->
    <AppCard padding="none" class="mb-20">
      <div class="p-4 sm:p-6 border-b border-gray-100">
        <AppInput
          v-model="searchTerm"
          placeholder="Search organizations..."
          autofocus
        />
      </div>
      <ul role="list" class="divide-y divide-gray-100">
        <li v-for="organization in filteredOrganizations" :key="organization.slug" class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
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
            <span v-else class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs text-gray-900 bg-emerald-50 ring-1 ring-inset ring-gray-200">
              <EyeIcon class="text-emerald-500 h-4 w-4" aria-hidden="true" />
              Anonymous
            </span>

            <span v-if="organization.onboarding.onboardingComplete" class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs text-gray-900 bg-emerald-50 ring-1 ring-inset ring-gray-200">
              <svg class="h-1.5 w-1.5 fill-emerald-500" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
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
  </LayoutAdmin>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAdminOrganizationStore } from '@/domain/admin/store/useAdminOrganizationStore'
import { ChevronRightIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import LayoutAdmin from '@/app/layouts/LayoutAdmin.vue'
import CreateOrganizationModal from '@/views/admin/modals/CreateOrganizationModal.vue'

const adminOrganizationStore = useAdminOrganizationStore()
const searchTerm = ref('')

const filteredOrganizations = computed(() => {
  if (!searchTerm.value) return adminOrganizationStore.organizations
  
  return adminOrganizationStore.organizations.filter(organization => 
    organization.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

onMounted(() => {
    adminOrganizationStore.index()
})
</script>
