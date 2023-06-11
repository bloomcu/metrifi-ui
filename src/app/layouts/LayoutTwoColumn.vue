<template>
  <div>
    <AppSidebar/>

    <div class="lg:pl-72">
      <AppTopBar/>

      <main class="py-10">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <slot/>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/app/components/navigation/AppSidebar.vue'
import AppTopbar from '@/app/components/navigation/AppTopbar.vue'
</script>
