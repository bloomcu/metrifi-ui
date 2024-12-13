<template>
  <div>
    <AppAdminSidebar :open="sidebarOpen" @close="sidebarOpen = false"/>

    <main class="py-4 lg:pl-64">
        <div class="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <!-- Topbar -->
          <div class="flex items-center gap-x-4 mt-4 mb-7">
            <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
              <Bars3Icon class="h-6 w-6" aria-hidden="true" />
            </button>

            <!-- Separator -->
            <div class="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />
            
            <div class="w-full">
              <slot name="topbar"/>
            </div>
          </div>

          <slot/>
        </div>
      </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Bars3Icon } from '@heroicons/vue/24/outline'
import AppAdminSidebar from '@/app/components/navigation/AppAdminSidebar.vue'

const sidebarOpen = ref(false)
</script>
