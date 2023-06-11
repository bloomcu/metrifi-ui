<template>
  <LayoutDefault>
    <template v-slot:top>
      <!-- Navbar -->
      <AppTopNavigation/>

      <!-- Subheader -->
      <!-- <header class="border-b border-gray-200 pb-5 sm:flex sm:items-center sm:justify-between">
        <h3 class="text-base font-semibold leading-6 text-gray-900">Sites</h3>
        <div class="mt-3 sm:ml-4 sm:mt-0">
          <button @click="siteStore.toggleCreateModal" type="button" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Create site
            </button>
        </div>
      </header> -->

      <header class="bg-white shadow-sm">
        <div class="sm:flex sm:items-center sm:justify-between mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <h1 class="text-base font-semibold leading-6 text-gray-900">Sites</h1>

          <div class="mt-3 sm:ml-4 sm:mt-0">
            <button @click="siteStore.toggleCreateModal" type="button" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Create site
            </button>
          </div>
        </div>
      </header>
    </template>

    <!-- Card -->
    <div v-if="siteStore.sites.length" class="border border-gray-200 sm:rounded-xl bg-white overflow-hidden mt-8">
      <ul role="list" class="divide-y divide-gray-100 overflow-hidden bg-white">
        <li v-for="site in siteStore.sites" :key="site.id" class="relative flex justify-between gap-x-6 px-4 py-6 hover:bg-gray-50 sm:px-6">
          <div class="flex gap-x-4">
            <!-- <img class="h-12 w-12 flex-none rounded-full bg-gray-50" :src="person.imageUrl" alt="" /> -->
            <div class="min-w-0 flex-auto">
              <p class="text-sm font-semibold leading-6 text-gray-900">
                <RouterLink :to="{ name: 'sitesEdit', params: { site: site.id } }">
                  <span class="absolute inset-x-0 -top-px bottom-0" />
                  {{ site.domain }}
                </RouterLink>
              </p>
              <p class="mt-1 text-xs leading-5 text-gray-500">
                {{ site.title }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-x-4">
            <!-- <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" /> -->
          </div>
        </li>
      </ul>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-sm font-semibold text-gray-900">No sites</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by creating a new site.</p>
    </div>

    <CreateSiteModal/>
  </LayoutDefault>
</template>

<script setup>
// import moment from "moment"
import { ref, onMounted } from 'vue'

import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/vue/24/outline'

import { useSiteStore } from '@/domain/base/sites/store/useSiteStore'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import AppTopNavigation from '@/app/components/navigation/AppTopNavigation.vue'
import CreateSiteModal from '@/views/base/sites/modals/CreateSiteModal.vue'

const siteStore = useSiteStore()

onMounted(() => {
    siteStore.index()
})

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
  { name: 'Reports', href: '#', current: false },
]

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]
</script>
