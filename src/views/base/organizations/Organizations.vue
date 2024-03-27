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
          <div class="flex gap-x-4">
            <div class="min-w-0 flex-auto">
              <p class="text-base font-medium leading-6 text-gray-900">
                <!-- <RouterLink :to="{ name: redirectRoute, params: { organization: organization.slug } }">
                  <span class="absolute inset-x-0 -top-px bottom-0" />
                  {{ organization.title }}
                </RouterLink> -->

                <a :href="`/${organization.slug}`">
                  <span class="absolute inset-x-0 -top-px bottom-0" />
                  {{ organization.title }}
                </a>
              </p>
              <!-- <p class="mt-1 text-sm leading-5 text-gray-500">{{ organization.plan.title }}</p> -->
            </div>
          </div>
          
          <div class="flex items-center gap-x-4">
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
import { useOrganizationStore } from '@/domain/base/organizations/store/useOrganizationStore'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import CreateOrganizationModal from '@/views/base/organizations/modals/CreateOrganizationModal.vue'

const organizationStore = useOrganizationStore()
const redirectRoute = import.meta.env.VITE_REDIRECT_FROM_ORGANIZATIONS_ROUTE

onMounted(() => {
    organizationStore.index()
})
</script>
