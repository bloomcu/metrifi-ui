<template>
  <LayoutWithoutNavigation>
    <!-- Header -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Organizations
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button @click="organizationStore.toggleCreateModal" class="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          Add organization
        </button>
      </div>
    </div>

    <!-- Card -->
    <div class="border border-gray-200 sm:rounded-xl bg-white overflow-hidden mt-8">
      <ul role="list" class="divide-y divide-gray-100 overflow-hidden bg-white">
        <li v-for="organization in organizationStore.organizations" :key="organization.slug" class="relative flex justify-between gap-x-6 px-4 py-6 hover:bg-gray-50 sm:px-6">
          <div class="flex gap-x-4">
            <!-- <img class="h-12 w-12 flex-none rounded-full bg-gray-50" :src="person.imageUrl" alt="" /> -->
            <div class="min-w-0 flex-auto">
              <p class="text-sm font-semibold leading-6 text-gray-900">
                <RouterLink :to="{ name: redirectRoute, params: { organization: organization.slug } }">
                  <span class="absolute inset-x-0 -top-px bottom-0" />
                  {{ organization.title }}
                </RouterLink>
              </p>
              <p class="mt-1 text-xs leading-5 text-gray-500">
                {{ organization.plan.title }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-x-4">
            <!-- <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" /> -->
          </div>
        </li>
      </ul>
    </div>
    
    <CreateOrganizationModal/>
  </LayoutWithoutNavigation>
</template>

<script setup>
// TODO
// TODO: Organizations index should derive from the user.
// TODO
import { onMounted } from 'vue'
import { useOrganizationStore } from '@/domain/base/organizations/store/useOrganizationStore'

import LayoutWithoutNavigation from '@/app/layouts/LayoutWithoutNavigation.vue'
import IconPlus from '@/app/components/base/icons/IconPlus.vue'
import CreateOrganizationModal from '@/views/base/organizations/modals/CreateOrganizationModal.vue'

const organizationStore = useOrganizationStore()
const redirectRoute = import.meta.env.VITE_REDIRECT_FROM_ORGANIZATIONS_ROUTE

onMounted(() => {
    organizationStore.index()
})
</script>
