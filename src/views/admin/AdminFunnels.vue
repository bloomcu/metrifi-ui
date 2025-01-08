<template>
  <LayoutAdmin>
    <template #topbar>
      <div class="relative pb-5 sm:pb-0">
        <!-- Title -->
        <div class="mb-2 md:flex md:items-center md:justify-between">
          <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">All Funnels</h1>
          <div class="flex items-center gap-3 md:absolute md:right-0">
            <DatePickerSimple/>
            <AppButton @click="snapshotAllFunnels()">Analyze all funnels</AppButton>
          </div>
        </div>

        <!-- Analysis type tabs -->
        <!-- <nav class="flex justify-between">
          <div class="flex space-x-6">
            <button @click="selectedDateRange.key = 'last28Days'" :class="[selectedDateRange.key == 'last28Days' ? 'border-violet-500 text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-3 pb-1 text-lg font-medium']">Last 28 days</button>
            <button @click="selectedDateRange.key = 'last90Days'" :class="[selectedDateRange.key == 'last90Days' ? 'border-violet-500 text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-3 pb-1 text-lg font-medium']">Last 90 days</button>
          </div>
        </nav> -->
      </div>
    </template>

    <!-- <pre>{{ filters }}</pre> -->

    <!-- Filters -->
    <div class="flex items-center justify-between gap-3 bg-violet-50 py-3 px-4 rounded-lg mb-4">
        <div>Filters</div>

      <div class="flex items-center gap-3">
        <AppButton v-if="hasActiveFilters" @click="clearFilters" size="sm" class="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700">
            Clear filters
        </AppButton>
        
        <!-- Filter: name -->
        <AppDropdown class="text-sm">
          <template #title>
            <div v-if="filters.name">
                <span class="font-medium text-left">Name: </span>
                <span class="text-gray-500 text-left">{{ filters.name }}</span>
              </div>
              <span v-else class="text-gray-500 text-left">Name</span>
              <!-- <ChevronDownIcon class="ml-2 h-4 w-4 text-gray-400" /> -->
          </template>
          <input v-model="filters.name" @input="updateFilters" placeholder="Funnel name" class="w-full p-2 border-none focus:ring-0">
        </AppDropdown>

        <!-- Filter: Assets -->
        <AppDropdown class="text-sm">
          <template #title>
            <div v-if="filters.assets">
                <span class="font-medium text-left">Assets: </span>
                <span class="text-gray-500 text-left"> >= {{ computedAssets }}</span>
              </div>
              <span v-else class="text-gray-500 text-left">Assets</span>
          </template>
          <input v-model="computedAssets" placeholder=">=" :maxlength="18" class="w-full p-2 border-none focus:ring-0"/>
        </AppDropdown>

        <!-- Filter: Conversion rate -->
        <AppDropdown class="text-sm">
          <template #title>
            <div v-if="filters.conversion_rate">
                <span class="font-medium text-left">Conversion rate: </span>
                <span class="text-gray-500 text-left"> >= {{ filters.conversion_rate }}%</span>
              </div>
              <span v-else class="text-gray-500 text-left">Conversion rate</span>
          </template>
          <input v-model="filters.conversion_rate" @input="updateFilters" placeholder=">=" class="w-full p-2 border-none focus:ring-0">
        </AppDropdown>

        <!-- Filter: Users -->
        <AppDropdown class="text-sm">
          <template #title>
            <div v-if="filters.users">
                <span class="font-medium text-left">Users: </span>
                <span class="text-gray-500 text-left"> >= {{ filters.users }}</span>
              </div>
              <span v-else class="text-gray-500 text-left">Users</span>
          </template>
          <input v-model="filters.users" @input="updateFilters" placeholder=">=" class="w-full p-2 border-none focus:ring-0">
        </AppDropdown>

        <!-- Filter: Steps -->
        <AppDropdown class="text-sm">
          <template #title>
            <div v-if="filters.steps_count">
                <span class="font-medium text-left">Steps: </span>
                <span class="text-gray-500 text-left"> >= {{ filters.steps_count }}</span>
              </div>
              <span v-else class="text-gray-500 text-left">Steps</span>
          </template>
          <input v-model="filters.steps_count" @input="updateFilters" placeholder=">=" class="w-full p-2 border-none focus:ring-0">
        </AppDropdown>

        <!-- Filter: Privacy -->
        <AppDropdown class="text-sm">
          <template #title>
            <div v-if="filters.privacy">
                <span class="font-medium text-left">Sharing: </span>
                <span class="text-gray-500 text-left">{{ filters.privacy == '0' ? 'Anonymous' : 'Private' }}</span>
              </div>
              <span v-else class="text-gray-500 text-left">Sharing</span>
          </template>

          <div class="p-3 space-y-2">
            <!-- Anonymous Radio Button -->
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" value="" v-model="filters.privacy" class="hidden peer"/>
              <div class="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-violet-500 peer-checked:bg-violet-500"></div>
              <span class="text-gray-700">Any</span>
            </label>

            <!-- Anonymous Radio Button -->
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" value="0" v-model="filters.privacy" class="hidden peer"/>
              <div class="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-violet-500 peer-checked:bg-violet-500"></div>
              <span class="text-gray-700">Anonymous</span>
            </label>

            <!-- Private Radio Button -->
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="radio" value="1" v-model="filters.privacy" class="hidden peer"/>
              <div class="w-4 h-4 rounded-full border border-gray-400 peer-checked:border-violet-500 peer-checked:bg-violet-500"></div>
              <span class="text-gray-700">Private</span>
            </label>
          </div>
        </AppDropdown>

        <!-- Filter: Users -->
        <CategoryPicker v-model="category" @update:modelValue="setCategoryFilter" class="text-sm"/>
      </div>
    </div>

    <!-- Funnels -->
    <table class="min-w-full table-fixed overflow-hidden divide-y divide-gray-300 ring-1 ring-gray-300 mb-4 sm:mx-0 sm:rounded-lg">
      <thead>
        <tr class="">
          <!-- Header: Name -->
          <th scope="col" class="py-3.5 pl-4 pr-4 sm:pl-4 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('name')" :class="[activeSort == 'name' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Name
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'name'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <!-- Header: Assets -->
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('assets')" :class="[activeSort == 'assets' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Assets
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'assets'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <!-- Header: Conversion rate -->
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('conversion_rate')" :class="[activeSort == 'conversion_rate' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Conversion rate
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'conversion_rate'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <!-- Header: Users -->
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('users')" :class="[activeSort == 'users' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Users
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'users'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <!-- Header: Steps -->
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('steps_count')" :class="[activeSort == 'steps_count' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Steps
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'steps_count'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <!-- Header: Privacy -->
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('privacy')" :class="[activeSort == 'privacy' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Sharing
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'privacy'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <!-- Header: Category -->
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('category')" :class="[activeSort == 'category' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Category
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'category'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <!-- Header: Created -->
          <!-- <th scope="col" class="py-3.5 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('created')" :class="[activeSort == 'created' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Created
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'created'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th> -->
        </tr>
      </thead>

      <tbody v-if="funnels && funnels.length" class="divide-y divide-gray-200">
        <tr v-for="funnel in funnels" :key="funnel.id" @click="showFunnel(funnel)" class="hover:bg-gray-50 cursor-pointer">
          <!-- Funnel -->
          <td class="py-4 pr-2 text-sm w-2/5 sm:pl-4">
            <div class="flex-auto">
              <p class="mb-1 text-base font-medium leading-6 text-gray-900">{{ funnel.name }}</p>
              <p class="text-gray-500">{{ funnel.organization.title }}</p>
            </div>
          </td>

          <!-- Assets-->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            <div class="flex items-center text-sm">
              {{ funnel.snapshots[selectedDateRange.key].assets !== null ? funnel.snapshots[selectedDateRange.key].assets.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) : '' }}
            </div>
          </td>

          <!-- Conversion rate -->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            <div class="flex items-center text-sm">
              {{ funnel.snapshots[selectedDateRange.key].conversion_rate !== null ? funnel.snapshots[selectedDateRange.key].conversion_rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%' : '' }}
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

          <!-- Privacy -->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            <div class="flex items-center text-sm">
              {{ funnel.organization.is_private ? 'Private' : 'Anonymous' }}
            </div>
          </td>

          <!-- Category -->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            <div class="flex items-center text-sm">
              <span @click.stop="filters.category = funnel.category.title"  class="cursor-pointer border border-transparent hover:bg-violet-50 hover:border-violet-600">{{ funnel.category ? funnel.category.title : '' }}</span>
            </div>
          </td>

          <!-- Created -->
          <!-- <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            {{ moment(funnel.created_at).fromNow() }}
          </td> -->
        </tr>

        <tr ref="loadMoreElement" class="sr-only h-1"></tr>
      </tbody>
    </table>

    <!-- State: Loading -->
    <!-- <div v-if="isLoading" class="animate-pulse space-y-4">
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
    </div> -->

    <!-- Empty state: No funnels -->
    <div v-if="!funnels || funnels.length === 0" class="flex flex-col items-center justify-center bg-violet-50 rounded-lg py-6 px-2">
      <ChartBarIcon class="mx-auto h-10 w-10 text-violet-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-violet-600">No funnels to show</h2>
    </div>
  </LayoutAdmin>
</template>

<script setup>
import moment from "moment"
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { useInfiniteScroll } from '@/app/composables/base/useInfiniteScroll'
import { adminFunnelApi } from '@/domain/admin/api/adminFunnelApi.js'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import { ChevronUpIcon, MinusIcon } from '@heroicons/vue/20/solid'
import LayoutAdmin from '@/app/layouts/LayoutAdmin.vue'
import AppDropdown from '@/app/components/dropdown/AppDropdown.vue'
import CategoryPicker from '@/app/components/category-picker/CategoryPicker.vue'
import DatePickerSimple from '@/app/components/datepicker/DatePickerSimple.vue'
import AppToggle from "../../app/components/base/forms/AppToggle.vue"

const { selectedDateRange } = useDatePicker()

const router = useRouter()

const { 
    loadMoreElement, 
    items: funnels, 
    isLoading, 
    updateParams 
} = useInfiniteScroll(adminFunnelApi.index, {}, { sort: '' })


const activeSort = ref('')
const activeSortDirection = ref('asc')

const name = ref(null)
const category = ref(null)

const filters = ref({
  name: '',
  assets: '',
  conversion_rate: '',
  users: '',
  steps_count: '',
  privacy: '',
  category: '',
  // created: ''
})

const computedAssets = computed({
  get: () => {
    // Convert to dollars
    let value = filters.value.assets

    // Format to dollars
    return value.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0})
  },
  set: (value) => {
    // Remove any non-digit character:
    value = value.replace(/\D+/g, '')
    
    // Handle empty string non
    if (value === '') {
      value = 0
    }
    // Convert to integer
    value = parseInt(value);

    // Limit to max 1 trillion dollars ($1,000,000,000,000
    if (value > 1000000000000) {
      value = 1000000000000 // in cents
    }

    // Handle edge cases
    if (isNaN(value)) {
      filters.value.assets = 0;
    }

    // Convert to cents
    filters.value.assets = value;
  }
})

function setCategoryFilter(category) {
  if (category === null) {
    filters.value.category = ''
    return
  }

  filters.value.category = category.title
}

function updateFilters() {
  updateQueryParams()
}

function clearFilters() {
  filters.value = {
    name: '',
    assets: '',
    conversion_rate: '',
    users: '',
    steps_count: '',
    privacy: '',
    category: '',
  };

  category.value = null;

  updateQueryParams(); // Ensure the filters are applied immediately
}

const hasActiveFilters = computed(() => {
  return Object.values(filters.value).some((filter) => filter !== null && filter !== '');
});

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
    updateQueryParams();
}

function updateQueryParams() {
  const sortParam = activeSortDirection.value === 'desc' ? `-${activeSort.value}` : activeSort.value;

  const formattedFilters = Object.fromEntries(
  Object.entries(filters.value)
    .filter(([_, value]) => value !== null && value !== undefined) // Allow empty strings
    .map(([key, value]) => [`filter[${key}]`, value]) // Format keys for Spatie QueryBuilder
);

  const queryParams = {
    sort: sortParam,
    period: selectedDateRange.key,
    ...formattedFilters, // Inject formatted filters
    // page: 0
  };

  updateParams(queryParams);
}

function snapshotAllFunnels() {
  isLoading.value = true

  adminFunnelApi.snapshotAll().then(response => {
    isLoading.value = false
  })
}

function showFunnel(funnel) {
  const route = router.resolve({name: 'funnel', params: {funnel: funnel.id, organization: funnel.organization.slug}});
  window.open(route.href, '_blank');
}

// watch activeSort
watch(selectedDateRange.key, (newPeriod) => {
  updateQueryParams()
})

// watch filters
watch(filters.value, () => {
  updateQueryParams()
})

onMounted(() => {
  updateQueryParams()
})
</script>
