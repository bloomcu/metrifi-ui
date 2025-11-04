<template>
  <LayoutAdmin>
    <template #topbar>
      <div class="relative pb-5 sm:pb-0">
        <!-- Title -->
        <div class="md:flex md:items-center md:justify-between">
          <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Organization Limits</h1>
        </div>
      </div>
    </template>

    <!-- Organizations -->
    <AppCard padding="none" class="mb-20">
      <!-- Search -->
      <div class="p-4 sm:p-6 border-b border-gray-100">
        <AppInput
          v-model="searchTerm"
          placeholder="Search organizations..."
          autofocus
        />
      </div>
      <ul role="list" class="divide-y divide-gray-100">
        <li v-for="organization in filteredOrganizations" :key="organization.slug" class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
          <!-- Organization title -->
          <div class="flex gap-x-4">
            <div class="min-w-0 flex-auto">
              <p class="text-base font-medium leading-6 text-gray-900">
                {{ organization.title }}
              </p>
            </div>
          </div>

          <!-- Recommendations limit -->
          <div class="flex items-center gap-x-4">
            <!-- Display mode -->
            <div v-if="editingOrganizationId !== organization.id" class="flex items-center gap-x-3">
              <div class="flex items-center gap-x-2">
                <span class="text-sm text-gray-500">Recommendations limit:</span>
                <span class="text-sm font-medium text-gray-900">
                  {{ organization.recommendations_limit ?? 'Plan default' }}
                </span>
              </div>
              
              <span v-if="organization.recommendations_limit === null" class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs text-gray-900 bg-gray-50 ring-1 ring-inset ring-gray-200">
                Plan default
              </span>
              <span v-else class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs text-gray-900 bg-violet-50 ring-1 ring-inset ring-violet-200">
                <svg class="h-1.5 w-1.5 fill-violet-500" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
                Custom limit
              </span>

              <AppButton
                @click="startEditing(organization)"
                size="sm"
                variant="secondary"
              >
                Edit limit
              </AppButton>
            </div>

            <!-- Edit mode -->
            <div v-else class="flex items-center gap-x-3">
              <div class="flex items-center gap-x-2">
                <span class="text-sm text-gray-500">Recommendations limit:</span>
                <input
                  v-model="editingValue"
                  type="number"
                  min="0"
                  placeholder="Plan default"
                  class="w-32 rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                  @keyup.enter="saveLimit(organization)"
                  @keyup.escape="cancelEditing"
                />
              </div>

              <AppButton
                @click="saveLimit(organization)"
                size="sm"
                variant="primary"
              >
                Save
              </AppButton>

              <AppButton
                @click="cancelEditing"
                size="sm"
                variant="secondary"
              >
                Cancel
              </AppButton>
            </div>
          </div>
        </li>
      </ul>
    </AppCard>
  </LayoutAdmin>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAdminOrganizationStore } from '@/domain/admin/store/useAdminOrganizationStore'
import LayoutAdmin from '@/app/layouts/LayoutAdmin.vue'

const adminOrganizationStore = useAdminOrganizationStore()
const searchTerm = ref('')
const editingOrganizationId = ref(null)
const editingValue = ref('')

const filteredOrganizations = computed(() => {
  if (!searchTerm.value) return adminOrganizationStore.organizations
  
  return adminOrganizationStore.organizations.filter(organization => 
    organization.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
})

function startEditing(organization) {
  editingOrganizationId.value = organization.id
  editingValue.value = organization.recommendations_limit ?? ''
}

function cancelEditing() {
  editingOrganizationId.value = null
  editingValue.value = ''
}

async function saveLimit(organization) {
  const limit = editingValue.value === '' ? null : parseInt(editingValue.value)
  
  // Only update if the value has changed
  if (limit === organization.recommendations_limit) {
    cancelEditing()
    return
  }
  
  try {
    await adminOrganizationStore.update(organization.id, {
      recommendations_limit: limit
    })
    cancelEditing()
  } catch (error) {
    console.error('Failed to update recommendations limit:', error)
  }
}

onMounted(() => {
  adminOrganizationStore.index()
})
</script>
