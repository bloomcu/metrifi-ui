<template>
  <div>
    <AppSidebar :open="sidebarOpen" @close="sidebarOpen = false"/>

    <main class="lg:pl-60">
      <slot name="overlay"/>

      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <!-- Topbar -->
        <div class="flex items-center gap-x-4 mt-4 mb-7">
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
import AppSidebar from '@/app/components/navigation/AppSidebar.vue'

const sidebarOpen = ref(false)
</script>
