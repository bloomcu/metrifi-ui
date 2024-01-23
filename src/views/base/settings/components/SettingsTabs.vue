<template>
<div>
  <div class="sm:hidden">
    <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
    <select id="tabs" name="tabs" class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
      <option v-for="tab in tabs" :key="tab.name" :selected="tab.current">{{ tab.name }}</option>
    </select>
  </div>
  <div class="hidden sm:block">
    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <RouterLink v-for="tab in tabs" :key="tab.name" :to="tab.to" class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 group inline-flex items-center border-b-2 pb-4 px-1 text-sm font-medium">
          <component :is="tab.icon" class="text-gray-400 group-hover:text-gray-500 -ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
          <span>{{ tab.name }}</span>
        </RouterLink>
      </nav>
    </div>
  </div>
</div>
</template>

<script setup>
import { BuildingOfficeIcon, CreditCardIcon, UsersIcon } from '@heroicons/vue/24/outline'

const tabs = [
  { name: 'Users', to: { name:'settingsUsers' }, icon: UsersIcon },  
  { name: 'Organization', to: { name:'settingsOrganization' }, icon: BuildingOfficeIcon },  
  { name: 'Billing', to: { name:'settingsBilling' }, icon: CreditCardIcon },
]
</script>

<style lang="scss" scoped>
.router-link-active {
  @apply border-indigo-500 text-indigo-600
}

.router-link-active svg {
  @apply text-indigo-600
}
</style>