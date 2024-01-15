<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Funnels</h1>
      <AppButton @click="">Create Funnel</AppButton>
    </template>

    <!-- Funnels -->
    
    <!-- Empty state: No connections -->
    <!-- <div class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
      <h2 class="mt-2 text-lg font-medium text-gray-900">No funnels</h2>
      <p class="mt-1 text-gray-500">Get started by creating a funnel.</p>
      <AppButton @click="" class="mt-4">Create Funnel</AppButton>
    </div> -->

    <!-- Empty state: No connections -->
    <!-- <div class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
      </svg>
      <h2 class="mt-2 text-lg font-medium text-gray-900">No connections</h2>
      <p class="mt-1 text-gray-500">Get started by connecting Google Analytics.</p>
      <AppButton @click="" class="mt-4">Connect Google Analytics</AppButton>
    </div> -->
  </LayoutWithSidebar>
</template>

<script setup>
import { onMounted } from 'vue'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'

onMounted(() => {
  
})
</script>
