
<template>
  <AppModal 
    size="6xl"
    @closed="isAddFunnelsModalOpen = false" 
    :open="isAddFunnelsModalOpen"
  >
    <div class="flex items-center justify-between mb-6 px-6 pt-6">
      <!-- Modal title -->
      <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Add funnel</h3>

      <!-- Show/hide organizations -->
      <div v-if="authStore.user.role === 'admin'" class="flex items-center py-2 pr-16">
        <input v-model="isShowingOrganizations" required id="agree" name="agree" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-violet-500 focus:ring-violet-600" />
        <label for="agree" class="ml-2 block text-sm leading-6 text-gray-900">
          Show organizations
        </label>
      </div>
    </div>

    <div>
      <div class="flex items-center gap-3 mb-4 px-6">
        <AppInput v-model="input" placeholder="Search" class="w-6/12"/>
        <CategoryPicker class="w-4/12" v-model="category"/>
        <AppButton @click="attachFunnels()" :disabled="!selected.length" class="w-2/12">
          Add {{ selected.length ? selected.length : '' }} {{ selected.length > 1 ? 'funnels' : 'funnel' }}
        </AppButton>
      </div>

      <div v-if="selected.length" class="flex items-center gap-3 px-6 mb-4">
        <label class="text-sm font-medium text-gray-900">
          {{ selected.length }} 
          {{ selected.length > 1 ? 'funnels' : 'funnel' }} selected
        </label>
        <AppButton @click="unselectAllFunnels()" class="text-sm text-violet-500">Unselect all</AppButton>
      </div>

      <div v-if="funnels && funnels.length" class="max-h-[70vh] overflow-y-scroll">
        <table class="min-w-full table-fixed overflow-hidden divide-y divide-gray-300 sm:mx-0 sm:rounded-lg">
          <thead>
            <tr>
              <th scope="col" class="py-3.5 pl-4 sm:pl-6">
                <input 
                  @click="selectAllFunnels()" 
                  :checked="isAllSelected"
                  class="h-4 w-4 rounded border-gray-300 text-violet-500 focus:ring-violet-600" 
                  type="checkbox" 
                />
              </th>
              <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Funnel</th>
              <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Category</th>
              <th v-if="isShowingOrganizations" scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Organization</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200">
            <template
              v-for="funnel in funnels" 
              :key="funnel.id" 
            >
              <tr v-if="funnelsAlreadyAttachedIds.includes(funnel.id)" class="bg-gray-100">
                <td class="py-4 pl-4 sm:pl-6"></td>
                <td class="whitespace-nowrap py-4 text-sm">
                  <div class="flex items-center gap-2">
                    <p class="mb-1 text-base font-medium text-gray-500">{{ funnel.name }}</p>
                    <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Already in use</span>
                  </div>
                </td>
                <td class="whitespace-nowrap py-4 text-sm text-gray-400">
                  <div class="flex items-center text-sm mr-2">
                    {{ funnel.category ? funnel.category.title : '' }}
                  </div>
                </td>
                <td v-if="isShowingOrganizations" class="whitespace-nowrap py-4 text-sm text-gray-400">
                  <div class="flex items-center text-sm mr-2">
                    {{ funnel.organization.title }}
                  </div>
                </td>
              </tr>

              <tr v-else @click="selectFunnel(funnel.id)" :class="selected.includes(funnel.id) ? 'bg-gray-100' : ''" class="hover:bg-gray-50 cursor-pointer">
                <td class="py-4 pl-4 sm:pl-6">
                  <input 
                    @select="selectFunnel(funnel.id)" 
                    :checked="selected.includes(funnel.id)" 
                    class="h-4 w-4 rounded border-gray-300 text-violet-500 focus:ring-violet-600" 
                    type="checkbox" 
                  />
                </td>
                <td class="whitespace-nowrap py-4 text-sm">
                  <div class="flex-auto">
                    <p class="text-base font-medium leading-6 text-gray-900">{{ funnel.name }}</p>
                  </div>
                </td>
                <td class="whitespace-nowrap py-4 text-sm text-gray-400">
                  <div class="flex items-center text-sm mr-2">
                    {{ funnel.category ? funnel.category.title : '' }}
                  </div>
                </td>
                <td v-if="isShowingOrganizations" class="whitespace-nowrap py-4 text-sm text-gray-400">
                  <div class="flex items-center text-sm mr-2">
                    {{ funnel.organization.title }}
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
      

      <!-- Empty state: No funnels -->
      <div v-else class="text-center bg-slate-50 rounded-2xl py-12 px-2">
        <ChartBarIcon class="mx-auto h-10 w-10 text-violet-500" aria-hidden="true" />
        <h2 class="mt-2 text-lg font-medium text-gray-900">No funnels found</h2>
        <p class="mt-1 text-gray-400">Try another search term.</p>
      </div>
    </div>

  </AppModal>
</template>

<script setup>
import debounce from 'lodash.debounce'
import { ref, inject, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import CategoryPicker from '@/app/components/category-picker/CategoryPicker.vue'

const route = useRoute()
const authStore = useAuthStore()

const input = ref(null)
const category = ref(null)

const funnels = ref([])
const funnelsAlreadyAttachedIds = inject('funnelsAlreadyAttachedIds')
const isAddFunnelsModalOpen = inject('isAddFunnelsModalOpen')
const isUpdating = ref(false)
const isShowingOrganizations = inject('isShowingOrganizations')
const selected = ref([])

const search = debounce(() => {
  if (!input.value) {
    listOwnFunnels()
    return
  }

  isUpdating.value = true

  funnelApi.search(route.params.organization, {
    // term: input.value,
    'filter[name]': input.value,
    'filter[category.id]': category.value ? category.value.id : null,
  }).then(response => {
    funnels.value = response.data.data
    setTimeout(() => isUpdating.value = false, 800);
  })
}, 800)

const isAllSelected = computed(() => {
  // Check if every funnel in the current array is selected
  return (
    funnels.value.length > 0 && 
    funnels.value.every(funnel => selected.value.includes(funnel.id))
  );
});

function selectFunnel(funnelId) {
  const index = selected.value.indexOf(funnelId);

  if (index === -1) {
    selected.value.push(funnelId);
  } else {
    selected.value.splice(index, 1);
  }
}

function selectAllFunnels() {
  const currentSelection = new Set(selected.value); // Use a Set for efficient lookup
  const allFunnelIds = funnels.value.map((funnel) => funnel.id);

  // Check if all current funnels are already selected
  const allSelectedInCurrent = allFunnelIds.every((id) => currentSelection.has(id));

  if (allSelectedInCurrent) {
    // If all current funnels are selected, remove them from selected
    selected.value = selected.value.filter((id) => !allFunnelIds.includes(id));
  } else {
    // Otherwise, add any current funnels not already selected
    allFunnelIds.forEach((id) => {
      if (!currentSelection.has(id)) {
        selected.value.push(id);
      }
    });
  }
}

function unselectAllFunnels() {
    selected.value = [];
}

function attachFunnels() {
  emit('attachFunnels', selected.value)
  selected.value = []
  isAddFunnelsModalOpen.value = false
}

function listOwnFunnels() {
  funnelApi.index(route.params.organization, {
    'filter[category.id]': category.value ? category.value.id : null,
  }).then(response => {
    funnels.value = response.data.data
  })
}

// Watch input and search funnels
watch(input, search)

watch(category, () => {
  if (!input.value) {
    listOwnFunnels()
  } else {
    search()
  }
})

onMounted(() => {
  listOwnFunnels()
})

const emit = defineEmits(['attachFunnels'])
</script>
