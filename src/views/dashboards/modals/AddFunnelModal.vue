<template>
  <AppModal 
    size="super"
    @closed="isAddFunnelsModalOpen = false"
    :open="isAddFunnelsModalOpen"
  >
    <div class="flex items-center justify-between mb-3 px-8 pt-6">
      <!-- Modal title -->
      <!-- <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Add funnel</h3> -->

      <!-- Toggle my funnels and anonymous -->
      <nav class="flex justify-between mb-4">
        <div class="flex space-x-6">
          <button @click="isOnlyShowMyFunnels = true" :class="[isOnlyShowMyFunnels === true ? 'border-violet-500 text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-3 pb-1 text-lg font-medium']">
            My funnels
          </button>
          <button @click="isOnlyShowMyFunnels = false" :class="[isOnlyShowMyFunnels === false ? 'border-violet-500 text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-3 pb-1 text-lg font-medium']">
            Anonymous funnels
          </button>
        </div>
      </nav>

      <div class="flex items-center gap-6">
        <!-- Show/hide organizations -->
        <div v-if="authStore.user.role === 'admin'" class="flex items-center py-2">
            <input v-model="isShowingOrganizations" required id="agree" name="agree" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-violet-500 focus:ring-violet-600" />
            <label for="agree" class="ml-2 block text-sm leading-6 text-gray-900">
                Show organizations
            </label>
        </div>

        <!-- Attach funnels -->
        <AppButton :disabled="selected.length >= MAX_FUNNEL_SELECTION + 1" @click="attachFunnels()" class="w-[150px]">
            Add {{ selected.length ? selected.length : '' }} {{ selected.length > 1 ? 'funnels' : 'funnel' }}
        </AppButton>
      </div>
    </div>

    <div class="relative mx-8">
      <!-- Filters -->
      <FunnelFilters v-model="filters" :total="displayedFunnelCount" :selected="selected.length" @update:modelValue="buildParams()" @unselect="unselectAllFunnels()" class="sticky -top-4 z-50" />

      <!-- Funnels -->
      <table class="min-w-full table-fixed mb-24 sm:mx-0">
        <thead class="sticky top-10 bg-white ring-1 ring-gray-200 ring-inset overflow-hidden z-10">
          <tr v-if="selected.length >= MAX_FUNNEL_SELECTION + 1" >
            <td colspan="8">
              <div class="p-3 bg-violet-500">
                <p class="text-sm text-white">You can add up to {{ MAX_FUNNEL_SELECTION }} funnels at a time. You have selected {{ selected.length }}.</p>
              </div>
            </td>
          </tr>
          <tr>
            <!-- Select -->
            <th scope="col" class="py-2.5 pl-4 sm:pl-6">
              <input 
                @change="selectAllFunnels()" 
                :checked="isAllSelected"
                class="h-4 w-4 rounded border-gray-300 text-violet-500 focus:ring-violet-600" 
                type="checkbox" 
              />
            </th>

            <!-- Header: Name -->
            <th scope="col" class="py-2.5 pl-4 pr-4 sm:pl-4 text-left text-sm font-medium text-gray-900">
              <button @click="setActiveSort('name')" :class="[activeSort == 'name' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
                Name
                <span class="inline-flex ml-2 rounded bg-violet-100">
                  <ChevronUpIcon v-if="activeSort == 'name'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                  <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                </span>
              </button>
            </th>

            <!-- Header: Conversion rate -->
            <th scope="col" class="py-2.5 pr-4 text-left text-sm font-medium text-gray-900">
              <button @click="setActiveSort('conversion_rate')" :class="[activeSort == 'conversion_rate' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
                Conversion
                <span class="inline-flex ml-2 rounded bg-violet-100">
                  <ChevronUpIcon v-if="activeSort == 'conversion_rate'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                  <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                </span>
              </button>
            </th>

            <!-- Header: Assets -->
            <th scope="col" class="py-2.5 pr-4 text-left text-sm font-medium text-gray-900">
              <button @click="setActiveSort('assets')" :class="[activeSort == 'assets' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
                Assets
                <span class="inline-flex ml-2 rounded bg-violet-100">
                  <ChevronUpIcon v-if="activeSort == 'assets'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                  <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                </span>
              </button>
            </th>

            <!-- Header: Users -->
            <th scope="col" class="py-2.5 pr-4 text-left text-sm font-medium text-gray-900">
              <button @click="setActiveSort('users')" :class="[activeSort == 'users' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
                Users
                <span class="inline-flex ml-2 rounded bg-violet-100">
                  <ChevronUpIcon v-if="activeSort == 'users'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                  <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                </span>
              </button>
            </th>

            <!-- Header: Steps -->
            <th scope="col" class="py-2.5 pr-4 text-left text-sm font-medium text-gray-900">
              <button @click="setActiveSort('steps_count')" :class="[activeSort == 'steps_count' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
                Steps
                <span class="inline-flex ml-2 rounded bg-violet-100">
                  <ChevronUpIcon v-if="activeSort == 'steps_count'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                  <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                </span>
              </button>
            </th>

            <!-- Header: Category -->
            <th scope="col" class="py-2.5 pr-4 text-left text-sm font-medium text-gray-900">
              <button @click="setActiveSort('category')" :class="[activeSort == 'category' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
                Category
                <span class="inline-flex ml-2 rounded bg-violet-100">
                  <ChevronUpIcon v-if="activeSort == 'category'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                  <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                </span>
              </button>
            </th>

            <!-- Header: Updated -->
            <th scope="col" class="py-2.5 text-left text-sm font-medium text-gray-900">
              <button @click="setActiveSort('updated')" :class="[activeSort == 'updated' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
                Updated
                <span class="inline-flex ml-2 rounded bg-violet-100">
                  <ChevronUpIcon v-if="activeSort == 'updated'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                  <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                </span>
              </button>
            </th>
          </tr>
        </thead>

        <tbody v-if="funnels && funnels.length" class="divide-y divide-gray-200">
          <tr 
            v-for="funnel in funnels" 
            :key="funnel.id" 
            @click="selectFunnel(funnel.id)" 
            :class="[
              funnelsAlreadyAttachedIds.includes(funnel.id) ? 'bg-gray-100' : '', 
              selected.includes(funnel.id) ? 'bg-violet-50' : ''
            ]" 
            class="hover:bg-gray-50 cursor-pointer"
          >
            <!-- Select -->
            <td class="py-4 pl-4 sm:pl-6">
              <input 
                v-if="!funnelsAlreadyAttachedIds.includes(funnel.id)"
                @click.stop="selectFunnel(funnel.id)" 
                :checked="selected.includes(funnel.id)" 
                :disabled="selected.length >= MAX_FUNNEL_SELECTION && !selected.includes(funnel.id)" 
                class="h-4 w-4 rounded border-gray-300 text-violet-500 focus:ring-violet-600 disabled:cursor-not-allowed disabled:opacity-50" 
                type="checkbox" 
              />
            </td>

            <!-- Funnel -->
            <td class="py-4 pr-2 text-sm w-2/5 sm:pl-4">
              <div class="flex items-center gap-2">
                <p class="mb-1 text-base font-medium leading-6 text-gray-900">{{ funnel.name }}</p>
                <span v-if="funnelsAlreadyAttachedIds.includes(funnel.id)" class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Already in use</span>
              </div>
              <span v-if="isShowingOrganizations" class="text-gray-500">{{ funnel.organization.title }}</span>
            </td>

            <!-- Conversion rate -->
            <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
              <div class="flex items-center text-sm">
                {{ funnel.snapshots[selectedDateRange.key].conversion_rate !== null ? funnel.snapshots[selectedDateRange.key].conversion_rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%' : '' }}
              </div>
            </td>

            <!-- Assets-->
            <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
              <div class="flex items-center text-sm">
                {{ funnel.snapshots[selectedDateRange.key].assets !== null ? funnel.snapshots[selectedDateRange.key].assets.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) : '' }}
              </div>
            </td>

            <!-- Users -->
            <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
              <div class="flex items-center text-sm">
                {{ funnel.snapshots[selectedDateRange.key].users !== null ? funnel.snapshots[selectedDateRange.key].users.toLocaleString() : '' }}
              </div>
            </td>

            <!-- Steps -->
            <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
              <div class="flex items-center text-sm">
                {{ funnel.steps_count }}
              </div>
            </td>

            <!-- Category -->
            <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
              <div class="flex items-center text-sm">
                {{ funnel.category ? funnel.category.title : '' }}
              </div>
            </td>

            <!-- Updated -->
            <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
              {{ moment(funnel.updated_at).fromNow() }}
            </td>
          </tr>

          <tr ref="loadMoreElement"></tr>
        </tbody>

        <tbody v-else-if="isLoading" v-for="index in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]" class="divide-y divide-gray-200">
          <tr class="hover:bg-gray-50 cursor-pointer">
            <!-- Funnel -->
            <td class="py-6 pr-2 text-sm w-2/5 sm:pl-4">
              <div class="flex-auto">
                  <div class="h-2.5 bg-gray-200 rounded-full w-48 animate-pulse mb-4"></div>
                  <div class="h-2.5 bg-gray-200 rounded-full w-20 animate-pulse"></div>
              </div>
            </td>

            <!-- Conversion rate -->
            <td class="whitespace-nowrap py-6 pr-2 text-sm text-gray-400">
              <div class="flex items-center text-sm">
                <div class="h-2.5 bg-gray-200 rounded-full w-10 animate-pulse"></div>
              </div>
            </td>

            <!-- Assets-->
            <td class="whitespace-nowrap py-6 pr-2 text-sm text-gray-400">
              <div class="flex items-center text-sm">
                <div class="h-2.5 bg-gray-200 rounded-full w-10 animate-pulse"></div>
              </div>
            </td>

            <!-- Users -->
            <td class="whitespace-nowrap py-6 pr-2 text-sm text-gray-400">
              <div class="flex items-center text-sm">
                <div class="h-2.5 bg-gray-200 rounded-full w-10 animate-pulse"></div>
              </div>
            </td>

            <!-- Steps -->
            <td class="whitespace-nowrap py-6 pr-2 text-sm text-gray-400">
              <div class="flex items-center text-sm">
                <div class="h-2.5 bg-gray-200 rounded-full w-10 animate-pulse"></div>
              </div>
            </td>

            <!-- Privacy -->
            <td class="whitespace-nowrap py-6 pr-2 text-sm text-gray-400">
              <div class="flex items-center text-sm">
                <div class="h-2.5 bg-gray-200 rounded-full w-10 animate-pulse"></div>
              </div>
            </td>

            <!-- Category -->
            <td class="whitespace-nowrap py-6 pr-2 text-sm text-gray-400">
              <div class="flex items-center text-sm">
                <div class="h-2.5 bg-gray-200 rounded-full w-10 animate-pulse"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state: No funnels -->
      <div v-if="!funnels || funnels.length === 0" class="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-6 px-2">
        <ChartBarIcon class="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
        <h2 class="mt-2 text-lg text-gray-400">No funnels to show</h2>
      </div>
    </div>

  </AppModal>
</template>

<script setup>
import moment from 'moment'
import { ref, watch, inject, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import { funnelApi } from '@/domain/funnels/api/funnelApi'
import { useInfiniteScroll } from '@/app/composables/base/useInfiniteScroll'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { ChevronUpIcon, MinusIcon } from '@heroicons/vue/20/solid'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import FunnelFilters from '@/views/funnels/components/filters/FunnelFilters.vue'

const route = useRoute()
const authStore = useAuthStore()
const funnelsAlreadyAttachedIds = inject('funnelsAlreadyAttachedIds')
const isAddFunnelsModalOpen = inject('isAddFunnelsModalOpen')
const isShowingOrganizations = inject('isShowingOrganizations')
const isOnlyShowMyFunnels = ref(true)
const selected = ref([])
const { selectedDateRange } = useDatePicker()
const { 
    loadMoreElement, 
    items: funnels, 
    meta,
    isLoading, 
    updateParams
} = useInfiniteScroll(funnelApi.search, {}, { sort: '' }, route.params.organization)

const MAX_FUNNEL_SELECTION = 30;

// Filtering and sorting states
const activeSort = ref('conversion_rate')
const activeSortDirection = ref('desc')
const filters = ref({
  name: '',
  conversion_rate: '',
  assets: '',
  users: '',
  steps_count: '',
  category: '',
})

// Utility function
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function setActiveSort(sort) {
    if (sort === 'category' || sort === 'privacy') {
        // Ensure the category and privacy sort starts with ascending order (A-Z)
        activeSortDirection.value = activeSort.value === sort && activeSortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        if (activeSort.value === sort) {
            activeSortDirection.value = activeSortDirection.value === 'asc' ? 'desc' : 'asc';
        } else {
            activeSortDirection.value = 'desc'; // Default to descending for other sorts
        }
    }
    activeSort.value = sort;
    buildParams();
}

const buildParams = debounce(() => {
  console.log('Building params')
  const formattedSort = activeSortDirection.value === 'desc' ? `-${activeSort.value}` : activeSort.value;

  // Handle organization filter
  if (isOnlyShowMyFunnels.value) {
    filters.value['organization'] = route.params.organization
  } else {
    delete filters.value['organization']
  }

  const formattedFilters = Object.fromEntries(
    Object.entries(filters.value)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '') // Avoid empty values
      .map(([key, value]) => [`filter[${key}]`, value])
  );

  const params = {
    sort: formattedSort,
    period: selectedDateRange.value.key,
    ...formattedFilters,
  };

  updateParams(params);
}, 300); // 300ms debounce delay

const isAllSelected = computed(() => {
  const availableFunnels = funnels.value
    .filter(funnel => !funnelsAlreadyAttachedIds.value.includes(funnel.id))
    .map(funnel => funnel.id);

  return availableFunnels.length > 0 && selected.value.length === availableFunnels.length;
});

const displayedFunnelCount = computed(() => {
  return selected.value.length > 0 ? selected.value.length + ' funnels selected' : meta.total + ' funnels';
});

function selectFunnel(funnelId) {
  if (funnelsAlreadyAttachedIds.value.includes(funnelId)) {
    return; // Prevent selecting an already attached funnel
  }

  const index = selected.value.indexOf(funnelId);
  
  if (index === -1) {
    selected.value.push(funnelId);
  } else {
    selected.value.splice(index, 1);
  }
}

function selectAllFunnels() {
  const availableFunnels = meta.all_ids
    .filter(id => !funnelsAlreadyAttachedIds.value.includes(id))
    .map(id => id);

  if (selected.value.length === availableFunnels.length) {
    // If all are selected, deselect everything
    selected.value = [];
  } else {
    // Otherwise, select up to MAX_FUNNEL_SELECTION
    selected.value = availableFunnels;
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

watch(isOnlyShowMyFunnels, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    console.log('isOnlyShowMyFunnels changed:', newValue);
    buildParams()
  }
});

onMounted(() => {
  buildParams()
})

const emit = defineEmits(['attachFunnels'])
</script>