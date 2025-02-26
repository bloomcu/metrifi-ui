<template>
  <LayoutWithSidebar>
    <template #overlay>
      <!-- Force GA connection first -->
      <div v-if="organizationStore.organization && organizationStore.organization.connections_count == 0" class="fixed h-full w-full items-center bg-white bg-opacity-60 backdrop-blur-sm flex justify-center z-50">
        <div class="max-w-3xl lg:-ml-60 flex flex-col text-center items-center justify-center border rounded-xl bg-white shadow-xl mx-4 p-10">
          <svg class="w-10 h-10 mb-4" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
          <h1 class="mb-2 text-3xl font-medium text-gray-900">Connect Google Analytics</h1>
          <p class="text-lg text-gray-700 mb-4">In order to use MetriFi, you need to connect your Google Analytics 4 account.</p>
          <AppButton @click="connectToGoogle()">Connect Google Analytics</AppButton>
        </div>
      </div>
    </template>
    
    <template #topbar>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Funnels</h1>
        <div class="flex gap-2">
          <!-- <DatePickerSimple/> -->
          <AppButton v-if="organizationStore.organization && organizationStore.organization.connections_count !== 0" @click="storeNewFunnel()">
            Create blank funnel
          </AppButton>
        </div>
      </div>
    </template>

    <!-- Automation running -->
    <div v-if="isAutomating" class="rounded-md bg-violet-50 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0 text-violet-500">
          <svg class="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 100 101"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-violet-500">{{ organizationStore.organization.automation_msg }}</p>
        </div>
      </div>
    </div>

    <!-- Automation error -->
    <div v-if="automationError" class="rounded-md bg-pink-50 p-4 mb-4">
      <div class="flex items-center">
        <div class="flex-shrink-0 text-pink-600">
          <svg class="w-6 h-6 mr-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
        </div>
        <div class="ml-3">
          <p v-html="automationError" class="text-sm font-medium text-pink-600"></p>
        </div>
      </div>
    </div>

    <!-- Funnels -->
    <div class="relative">
      <FunnelFilters v-model="filters" :total="meta.total + ' funnels'" @update:modelValue="buildParams()" class="sticky top-0 z-50" />
      
      <table class="min-w-full table-fixed mb-24 sm:mx-0">
        <thead class="sticky top-14 bg-white ring-1 ring-gray-200 ring-inset overflow-hidden z-10">
          <tr>
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

            <!-- Header: updated -->
            <th scope="col" class="py-2.5 text-left text-sm font-medium text-gray-900">
              <button @click="setActiveSort('updated')" :class="[activeSort == 'updated' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
                Updated
                <span class="inline-flex ml-2 rounded bg-violet-100">
                  <ChevronUpIcon v-if="activeSort == 'updated'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                  <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                </span>
              </button>
            </th>

            <!-- Actions -->
            <th scope="col" class="py-2.5"></th>
          </tr>
        </thead>

        <tbody v-if="funnels && funnels.length" class="divide-y divide-gray-200">
          <tr v-for="funnel in funnels" :key="funnel.id" @click="router.push({name: 'funnel', params: {funnel: funnel.id}})" class="hover:bg-gray-50 cursor-pointer">
            <!-- Funnel -->
            <td class="py-4 pr-2 text-sm w-2/5 sm:pl-4">
              <div class="flex-auto">
                <p class="mb-1 text-base font-medium leading-6 text-gray-900">{{ funnel.name }}</p>
              </div>
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

            <!-- Actions -->
            <td class="py-4 px-3 flex gap-1.5">
              <!-- Copy -->
              <button @click.stop="replicateFunnel(funnel.id)" class="cursor-pointer font-medium rounded-md p-1.5 text-sm text-gray-400 bg-white hover:bg-gray-200 ring-1 ring-inset ring-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
                </svg>
              </button>

              <!-- Delete -->
              <button @click.stop="destroyFunnel(funnel.id)" class="cursor-pointer font-medium rounded-md p-1.5 text-sm text-gray-400 bg-white hover:bg-gray-200 ring-1 ring-inset ring-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </td>
          </tr>

          <tr ref="loadMoreElement" class="sr-only h-1"></tr>
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

            <!-- Actions -->
            <td class="whitespace-nowrap py-6 pr-2 text-sm text-gray-400">
              <div class="flex items-center text-sm">
                <div class="h-2.5 bg-gray-200 rounded-full w-10 animate-pulse"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      
    </div>

    <!-- Empty state: No funnels -->
    <div v-if="!funnels || funnels.length === 0" class="flex flex-col items-center justify-center bg-gray-50 rounded-lg py-6 px-2">
      <ChartBarIcon class="mx-auto h-10 w-10 text-gray-400" aria-hidden="true" />
      <h2 class="mt-2 text-lg text-gray-400">No funnels to show</h2>
    </div>
    
    <GenerateFunnelsModal :open="isModalOpen" @done="buildParams()"/>
  </LayoutWithSidebar>
</template>

<script setup>
import moment from 'moment'
import { ref, onMounted, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { useInfiniteScroll } from '@/app/composables/base/useInfiniteScroll'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import { ChevronUpIcon, MinusIcon } from '@heroicons/vue/20/solid'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'
// import DatePickerSimple from '@/app/components/datepicker/DatePickerSimple.vue'
import FunnelFilters from '@/views/funnels/components/filters/FunnelFilters.vue'
import GenerateFunnelsModal from '@/views/funnels/modals/GenerateFunnelsModal.vue'

const route = useRoute()
const router = useRouter()
const { selectedDateRange } = useDatePicker()
const { connectToGoogle } = useConnections()

const organizationStore = useOrganizationStore()


const isModalOpen = ref(false)
const isAutomating = ref(false)
const automationError = ref()

provide('isModalOpen', isModalOpen)
provide('isAutomating', isAutomating)
provide('automationError', automationError)

const { 
    loadMoreElement, 
    items: funnels, 
    isLoading, 
    meta,
    updateParams
} = useInfiniteScroll(
  funnelApi.index, 
  {}, 
  { sort: '' },
  route.params.organization
)

// Filtering and sorting states
const activeSort = ref('updated')
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
  if (sort === 'name' || sort === 'category' || sort === 'privacy') {
        // Ensure the name, category and privacy sort starts with ascending order (A-Z)
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

let pollInterval = 0
function poll() {
  pollInterval = setTimeout(async() => {
    console.log('Polling...')
    await buildParams()
  }, 2000)
}

function stopPoll() {
  clearInterval(pollInterval)
}

function pollOrganization() {
  organizationStore.show().then(() => {
    if (organizationStore.organization.value.automating) {
      isAutomating.value = true
      poll()
      return
    } else {
      isAutomating.value = false
      stopPoll()
    }
  })
}

function storeNewFunnel() {
  funnelApi.store(route.params.organization, {
    name: 'New funnel',
    description: 'This is the funnel description',
    zoom: 0,
    conversion_value: 0,
  }).then(response => {
    let funnel = response.data.data
    router.push({ name: 'funnel', params: { funnel: funnel.id } })
  })
}

function destroyFunnel(funnelId) {
  funnels.value = funnels.value.filter(funnel => funnel.id !== funnelId)
  funnelApi.destroy(route.params.organization, funnelId)
}

function replicateFunnel(funnelId) {
  funnelApi.replicate(route.params.organization, funnelId)
    .then(response => {
      funnels.value.unshift(response.data.data)
    })
}

function toggleModal() {
  isModalOpen.value = !isModalOpen.value 
}

onMounted(() => {
  buildParams()
  organizationStore.show(route.params.organization)
})
</script>
