<template>
  <LayoutAdmin>
    <template #topbar>
      <div class="relative pb-5 sm:pb-0">
        <!-- Title -->
        <div class="mb-5 md:flex md:items-center md:justify-between">
          <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">All Funnels</h1>
          <div class="flex gap-3 md:absolute md:right-0">
            <AppButton @click="snapshotAllFunnels()">Analyze all funnels</AppButton>
          </div>
        </div>

        <!-- Analysis type tabs -->
        <nav class="flex justify-between mb-4">
          <div class="flex space-x-6">
            <button @click="activePeriod = 'last28Days'" :class="[activePeriod == 'last28Days' ? 'border-violet-500 text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-3 pb-1 text-lg font-medium']">Last 28 days</button>
            <button @click="activePeriod = 'last90Days'" :class="[activePeriod == 'last90Days' ? 'border-violet-500 text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-3 pb-1 text-lg font-medium']">Last 90 days</button>
          </div>
        </nav>
      </div>
    </template>

    <!-- Funnels -->
    <table class="min-w-full table-fixed overflow-hidden divide-y divide-gray-300 ring-1 ring-gray-300 mb-4 sm:mx-0 sm:rounded-lg">
      <thead>
        <tr class="">
          <!-- Name -->
          <th scope="col" class="py-3.5 pl-4 pr-4 sm:pl-4 text-left text-sm font-medium text-gray-900">
            <input v-model="filters.name" @input="updateFilters" placeholder="Funnel name" class="mt-1 w-full border rounded px-2 py-1 text-sm">
             
            <button @click="setActiveSort('name')" :class="[activeSort == 'name' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Name
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'name'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <!-- Conversion rate -->
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <input v-model="filters.conversion_rate" @input="updateFilters" placeholder=">=" class="mt-1 w-full border rounded px-2 py-1 text-sm">
             
            <button @click="setActiveSort('conversion_rate')" :class="[activeSort == 'conversion_rate' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Conversion rate
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'conversion_rate'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <!-- Users -->
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <input v-model="filters.users" @input="updateFilters" placeholder=">=" class="mt-1 w-full border rounded px-2 py-1 text-sm">
             
            <button @click="setActiveSort('users')" :class="[activeSort == 'users' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Users
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'users'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <!-- Steps -->
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <input v-model="filters.steps_count" @input="updateFilters" placeholder=">=" class="mt-1 w-full border rounded px-2 py-1 text-sm">
             
            <button @click="setActiveSort('steps_count')" :class="[activeSort == 'steps_count' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Steps
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'steps_count'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <!-- Category -->
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <input v-model="filters.category" @input="updateFilters" placeholder="Exact category name" class="mt-1 w-full border rounded px-2 py-1 text-sm">
             
            <button @click="setActiveSort('category')" :class="[activeSort == 'category' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Category
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'category'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <!-- Created -->
          <th scope="col" class="py-3.5 text-left text-sm font-medium text-gray-900">
            <input v-model="filters.created" @input="updateFilters" placeholder="Filter date" class="mt-1 w-full border rounded px-2 py-1 text-sm invisible">
             
            <button @click="setActiveSort('created')" :class="[activeSort == 'created' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Created
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'created'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>
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

          <!-- Conversion rate -->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            <div class="flex items-center text-sm">
              {{ funnel.snapshots[activePeriod].conversion_rate !== null ? funnel.snapshots[activePeriod].conversion_rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%' : '' }}
            </div>
          </td>

          <!-- Users -->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            <div class="flex items-center text-sm">
              {{ funnel.snapshots[activePeriod].users !== null ? funnel.snapshots[activePeriod].users.toLocaleString() : '' }}
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

          <!-- Created -->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            {{ moment(funnel.created_at).fromNow() }}
          </td>
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
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useInfiniteScroll } from '@/app/composables/base/useInfiniteScroll'
import { adminFunnelApi } from '@/domain/admin/api/adminFunnelApi.js'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import { ChevronUpIcon, MinusIcon } from '@heroicons/vue/20/solid'
import LayoutAdmin from '@/app/layouts/LayoutAdmin.vue'

const router = useRouter()

const { 
    loadMoreElement, 
    items: funnels, 
    isLoading, 
    updateParams 
} = useInfiniteScroll(adminFunnelApi.index, {}, { sort: '' })

const activePeriod = ref('last28Days')
const activeSort = ref('')
const activeSortDirection = ref('asc')
const filters = ref({
  name: '',
  conversion_rate: '',
  users: '',
  steps_count: '',
  category: '',
  // created: ''
})

function setActiveSort(sort) {
    if (activeSort.value === sort) {
        activeSortDirection.value = activeSortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        activeSort.value = sort
        activeSortDirection.value = 'desc'
    }

    updateQueryParams()
}

function updateFilters() {
  updateQueryParams()
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
    period: activePeriod.value,
    ...formattedFilters, // Inject formatted filters
    // page: 0
  };

  updateParams(queryParams);
}

function loadFunnels() {
  isLoading.value = true

  adminFunnelApi.index().then(response => {
    isLoading.value = false
    funnels.value = response.data.data
  })
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
watch(activePeriod, (newPeriod) => {
  updateQueryParams()
})

onMounted(() => {
  updateQueryParams()
})
</script>
