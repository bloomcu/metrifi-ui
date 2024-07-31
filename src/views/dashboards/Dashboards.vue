<template>
  <LayoutWithSidebar>
    <!-- <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Dashboards</h1>
      <div class="flex gap-4">
        <AppButton @click="storeNewDashboard()">
          Create dashboard
        </AppButton>
      </div>
    </template> -->

    <template #topbar>
      <div class="relative __border-b __border-gray-200 pb-5 sm:pb-0">
        <div class="md:flex md:items-center md:justify-between">
          <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Dashboards</h1>
          <div class="flex gap-3 md:absolute md:right-0">
            <!-- <AppButton variant="tertiary">
              Analyze all dashboards
            </AppButton> -->
            <AppButton @click="storeNewDashboard()">
              Create dashboard
            </AppButton>
          </div>
        </div>

        <!-- Sorting -->
        <!-- <div class="mt-4">
          <div class="hidden sm:block">
            <nav class="-mb-px flex space-x-8">
              <button @click="toggleSort('users')" :class="[sorts['users'] ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pr-1 py-4 text-sm font-medium']">
                Users
                <span v-if="sorts['users']" class="group inline-flex ml-2 rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                  <ChevronUpIcon :class="sorts['users'] == 'asc' ? 'rotate-180' : ''" class="h-5 w-5" aria-hidden="true" />
                </span>
              </button>

              <button @click="toggleSort('performance')" :class="[sorts['performance'] ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium']">
                Conversion rate
                <span v-if="sorts['performance']" class="group inline-flex ml-2 rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                  <ChevronUpIcon :class="sorts['performance'] == 'asc' ? 'rotate-180' : ''" class="h-5 w-5" aria-hidden="true" />
                </span>
              </button>

              <button @click="toggleSort('bofiPerformance')" :class="[sorts['bofiPerformance'] ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium']">
                Bofi performance
                <span v-if="sorts['bofiPerformance']" class="group inline-flex ml-2 rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                  <ChevronUpIcon :class="sorts['bofiPerformance'] == 'asc' ? 'rotate-180' : ''" class="h-5 w-5" aria-hidden="true" />
                </span>
              </button>

              <button @click="toggleSort('assetChange')" :class="[sorts['assetChange'] ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium']">
                Potential assets
                <span v-if="sorts['assetChange']" class="group inline-flex ml-2 rounded bg-gray-100 text-gray-900 group-hover:bg-gray-200">
                  <ChevronUpIcon :class="sorts['assetChange'] == 'asc' ? 'rotate-180' : ''" class="h-5 w-5" aria-hidden="true" />
                </span>
              </button>
            </nav>
          </div>
        </div> -->
      </div>
    </template>

    <!-- Dashboards -->
    <!-- <div v-if="dashboards && dashboards.length" class="flex flex-col gap-4"> -->
      <VueDraggableNext 
        v-if="dashboards && dashboards.length"
        :list="dashboards" 
        :animation="150"
        @change="handleDragEvent($event)"
        class="flex flex-col gap-4"
      >
        <div 
          v-for="dashboard in dashboards" 
          @click="router.push({name: 'dashboard', params: {dashboard: dashboard.id}})" 
          class="group relative flex flex-col cursor-pointer overflow-hidden rounded-lg shadow-sm border bg-white hover:shadow-md"
        >          
          <div class="flex flex-col space-y-4 px-4 py-4">
            <!-- Card header -->
            <div :class="dashboard.latest_analysis ? 'border-b pb-4' : ''" class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <ChartBarIcon class="w-5 text-indigo-600"/>
                <h3 class="text-xl font-medium text-gray-900">{{ dashboard.name }}</h3>
              </div>
              
              <div class="flex items-center gap-3">
                <!-- Users count -->
                <span v-if="dashboard.latest_analysis && dashboard.latest_analysis.subject_funnel_users" class="text-sm text-gray-500 border-r border-gray-300 pr-3">{{ dashboard.latest_analysis.subject_funnel_users }} users</span>

                <!-- Funnels count -->
                <span class="text-sm text-gray-500 pr-3">{{ dashboard.funnels.length }} funnels</span>

                <!-- Delete -->
                <button @click.stop="destroyDashboard(dashboard.id)" class="cursor-pointer font-medium rounded-md p-1.5 text-sm text-gray-400 bg-white hover:bg-gray-50 ring-1 ring-inset ring-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Card body: analysis -->
            <div v-if="dashboard.latest_analysis">
              <AnalysisIssue v-if="dashboard.latest_analysis.issue" :issue="dashboard.latest_analysis.issue"/>
              <AnalysisExcerpt v-else :analysis="dashboard.latest_analysis"/>

              <div  class="divide-x divide-gray-300 border-t pt-3 text-sm text-gray-400">
                <span class="pr-2">Analysis created {{ moment(dashboard.latest_analysis.created_at).fromNow() }}</span> 
                <span class="pl-2">28 day period {{ moment(dashboard.latest_analysis.start_date).format('MMM DD, Y') }} - {{ moment(dashboard.latest_analysis.end_date).format('MMM DD, Y') }}</span>
              </div>
            </div>

            <!-- <div class="py-4">
              <span class="text-gray-400">No analysis</span>
            </div> -->
          </div>
        </div>
      </VueDraggableNext>

      <!-- Add dashboard -->
      <!-- <div @click="storeNewDashboard()" class="flex items-center justify-center border border-indigo-400 border-dashed rounded-lg py-6 px-2 cursor-pointer hover:bg-indigo-50">
        <h2 class="text-lg font-medium text-indigo-600">Add a dashboard</h2>
      </div> -->
    <!-- </div> -->

    <!-- State: Loading -->
    <div v-else-if="isLoading" class="animate-pulse space-y-4">
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
    </div>

    <!-- Empty state: No dashboards -->
    <div v-else @click="storeNewDashboard()" class="flex flex-col items-center justify-center border border-indigo-400 border-dashed rounded-lg py-6 px-2 cursor-pointer hover:bg-indigo-50">
      <Squares2X2Icon class="mx-auto h-10 w-10 text-indigo-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-indigo-600">Create a dashboard</h2>
    </div>
  </LayoutWithSidebar>
</template>

<script setup>
import moment from "moment"
import { ref, reactive, computed, onMounted } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import { dashboardApi } from '@/domain/dashboards/api/dashboardApi.js'
import { Squares2X2Icon } from '@heroicons/vue/24/outline'
import { ChartBarIcon } from '@heroicons/vue/24/solid'
import { ChevronUpIcon } from '@heroicons/vue/20/solid'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'
import AnalysisExcerpt from '@/domain/analyses/components/AnalysisExcerpt.vue'
import AnalysisIssue from '@/domain/analyses/components/AnalysisIssue.vue'

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()

const dashboards = ref()
const isLoading = ref(false)
const isShowingOrganizations = ref(false)

const sortOptions = ref({
  users: {asc: 'subject_funnel_users', desc: '-subject_funnel_users'},
  performance: {asc: 'subject_funnel_performance', desc: '-subject_funnel_performance'},
  bofiPerformance: {asc: 'bofi_performance', desc: '-bofi_performance'},
  assetChange: {asc: 'bofi_asset_change', desc: '-bofi_asset_change'},
})

const sorts = reactive({
  users: null,
  performance: 'desc',
  bofiPerformance: null,
  assetChange: null,
})

const activeSorts = ref(['-subject_funnel_performance'])

const sortedDashboards = computed(() => {
  if (activeSorts.value.length === 0) {
    return dashboards.value
  }

  return [...dashboards.value].sort(fieldSorter(activeSorts.value))
})

function toggleSort(property) {
  if (sorts[property] == null) {
    sorts[property] = 'desc'
    activeSorts.value.push(sortOptions.value[property].desc)
    return
  }

  if (sorts[property] == 'desc') {
    activeSorts.value.splice(activeSorts.value.indexOf(sorts[property]), 1)
    sorts[property] = 'asc'
    activeSorts.value.push(sortOptions.value[property].asc)
    return
  }

  if (sorts[property] == 'asc') {
    activeSorts.value.splice(activeSorts.value.indexOf(sorts[property]), 1)
    sorts[property] = null
    return
  }
}

function fieldSorter(fields) {
    return function (a, b) {
        return fields
            .map(function (o) {
                var dir = 1;
                if (o[0] === '-') {
                   dir = -1
                   o=o.substring(1)
                }
                if (!a['latest_analysis']) return
                if (!b['latest_analysis']) return

                if (a['latest_analysis'][o] > b['latest_analysis'][o]) return dir
                if (a['latest_analysis'][o] < b['latest_analysis'][o]) return -(dir)
                return 0;
            })
            .reduce(function firstNonZeroValue (p, n) {
                return p ? p : n
            }, 0)
    };
}

// function fieldSorter(fields) {
//   return (a, b) => fields.map(o => {
//       let dir = 1;
//       if (o[0] === '-') { dir = -1; o = o.substring(1); }
//       return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
//   })
//     .reduce((p, n) => p ? p : n, 0)
// }

function loadDashboards() {
  isLoading.value = true

  dashboardApi.index(route.params.organization).then(response => {
    isLoading.value = false
    dashboards.value = response.data.data
  })
}

function storeNewDashboard() {
  console.log(route.params.organization)
  dashboardApi.store(route.params.organization, {
    name: 'New dashboard',
    description: 'This is the dashboard description',
  }).then(response => {
    console.log(response.data.data)
    let dashboard = response.data.data
    router.push({ name: 'dashboard', params: { dashboard: dashboard.id } })
  })
}

function destroyDashboard(dashboardId) {
  dashboards.value = dashboards.value.filter(dashboard => dashboard.id !== dashboardId)
  dashboardApi.destroy(route.params.organization, dashboardId)
}

function handleDragEvent(e) {
  isLoading.value = true
  let event = e.moved || e.added

  dashboardApi.update(route.params.organization, event.element.id, {
    order: event.newIndex + 1
  }).then(() => {
    setTimeout(() => isLoading.value = false, 500)
  })
}

onMounted(() => {
  loadDashboards()
})
</script>
