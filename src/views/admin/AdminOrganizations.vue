<template>
  <LayoutAdmin>
    <template #topbar>
      <div class="relative pb-5 sm:pb-0">
        <!-- Title -->
        <div class="md:flex md:items-center md:justify-between">
          <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Organizations</h1>
          <div class="flex gap-3 md:absolute md:right-0">
            <AppButton @click="adminOrganizationStore.toggleCreateModal">Create organization</AppButton>
          </div>
        </div>
      </div>
    </template>

    <!-- Search -->
    <div class="mb-4">
      <AppInput
        v-model="searchTerm"
        placeholder="Search organizations..."
        autofocus
      />
    </div>

    <!-- Organizations -->
    <AppCard padding="none" class="mb-20">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Private
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Onboarding
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Recommendations Limit
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">View</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="organization in filteredOrganizations" :key="organization.slug" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <a :href="`/${organization.slug}`" class="text-base font-medium text-gray-900 hover:text-gray-700">
                {{ organization.title }}
              </a>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="organization.is_private" class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs text-gray-900 bg-red-50 ring-1 ring-inset ring-gray-200">
                <EyeSlashIcon class="text-red-500 h-4 w-4" aria-hidden="true" />
                Private
              </span>
              <span v-else class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs text-gray-900 bg-emerald-50 ring-1 ring-inset ring-gray-200">
                <EyeIcon class="text-emerald-500 h-4 w-4" aria-hidden="true" />
                Anonymous
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="organization.onboarding.onboardingComplete" class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs text-gray-900 bg-emerald-50 ring-1 ring-inset ring-gray-200">
                <svg class="h-1.5 w-1.5 fill-emerald-500" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
                Onboarding complete
              </span>
              <span v-else class="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs text-gray-900 bg-red-50 ring-1 ring-inset ring-gray-200">
                <svg class="h-1.5 w-1.5 fill-red-500" viewBox="0 0 6 6" aria-hidden="true"><circle cx="3" cy="3" r="3" /></svg>
                Onboarding incomplete
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <!-- Display mode -->
              <div v-if="editingOrganizationId !== organization.id" class="flex items-center gap-x-3">
                <div class="flex items-center gap-x-2">
                  <span class="text-sm font-medium text-gray-900">
                    {{ organization.recommendations_limit ?? 'Plan default' }}
                  </span>
                </div>

                <AppButton
                  @click="startEditing(organization)"
                  size="sm"
                  variant="secondary"
                >
                  Edit
                </AppButton>
              </div>

              <!-- Edit mode -->
              <div v-else class="flex items-center gap-x-3">
                <input
                  v-model="editingValue"
                  type="number"
                  min="0"
                  placeholder="Plan default"
                  class="w-32 rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                  @keyup.enter="saveLimit(organization)"
                  @keyup.escape="cancelEditing"
                />

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
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <a :href="`/${organization.slug}`" class="text-gray-400 hover:text-gray-600">
                <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </AppCard>
    
    <CreateOrganizationModal/>
  </LayoutAdmin>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useAdminOrganizationStore } from '@/domain/admin/store/useAdminOrganizationStore'
import { ChevronRightIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import LayoutAdmin from '@/app/layouts/LayoutAdmin.vue'
import CreateOrganizationModal from '@/views/admin/modals/CreateOrganizationModal.vue'

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
