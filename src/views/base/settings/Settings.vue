<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Settings</h1>
    </template>

    <!-- Subnav -->
    <div class="mb-12">
      <SettingsTabs />
    </div>

    <RouterView/>
  </LayoutWithSidebar>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'
import SettingsTabs from '@/views/base/settings/components/SettingsTabs.vue'

const route = useRoute()
const organizationStore = useOrganizationStore()

onMounted(() => {
  organizationStore.show(route.params.organization)
})
</script>
