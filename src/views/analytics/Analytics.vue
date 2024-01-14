<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Analytics</h1>
      <AppButton @click="">New Funnel</AppButton>
    </template>

    <!-- Analytics -->
    

    <!-- Empty state -->
    <div class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h2 class="mt-2 text-lg font-medium text-gray-900">No connections</h2>
      <p class="mt-1 text-gray-500">Get started by connecting Google Analytics.</p>
      <AppButton @click="" class="mt-4">Connect Google Analytics</AppButton>
    </div>
  </LayoutWithSidebar>
</template>

<script setup>
import { onMounted } from 'vue'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'

onMounted(() => {
  
})
</script>
