<template>
  <LayoutAdmin>
    <template #topbar>
      <div class="relative border-b border-gray-200 pb-5 sm:pb-0">
        <!-- Title -->
        <div class="md:flex md:items-center md:justify-between">
          <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">All Dashboards</h1>
          <div class="flex gap-3 md:absolute md:right-0">
            <AppButton @click="analyzeAllDashboards()">Analyze all dashboards</AppButton>
          </div>
        </div>

        <!-- Analysis type tabs -->
        <div class="mt-4">
          <nav class="flex justify-between">
            <div class="flex space-x-6">
              <button @click="activeAnalysisType = 'median_analysis'" :class="[activeAnalysisType == 'median_analysis' ? 'border-violet-500 text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-5 pb-1 text-lg font-medium']">Average</button>
              <button @click="activeAnalysisType = 'max_analysis'" :class="[activeAnalysisType == 'max_analysis' ? 'border-violet-500 text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-5 pb-1 text-lg font-medium']">Maximum</button>
            </div>
          </nav>
        </div>

        <!-- Sorting tabs -->
        <div class="mt-2">
          <div class="hidden sm:block">
            <nav class="-mb-px flex justify-between">
              <div class="flex space-x-4">
                <button @click="setActiveSort('bofi_performance')" :class="[activeSort == 'bofi_performance' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap px-1 py-4 text-sm font-medium']">
                  Step opportunity
                  <span class="inline-flex ml-2 rounded bg-violet-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'bofi_performance'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('subject_funnel_performance')" :class="[activeSort == 'subject_funnel_performance' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap px-1 py-4 text-sm font-medium']">
                  Conversion rate
                  <span class="inline-flex ml-2 rounded bg-violet-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'subject_funnel_performance'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('subject_funnel_users')" :class="[activeSort == 'subject_funnel_users' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap pr-1 py-4 text-sm font-medium']">
                  Users
                  <span class="inline-flex ml-2 rounded bg-violet-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'subject_funnel_users'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('bofi_asset_change')" :class="[activeSort == 'bofi_asset_change' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap px-1 py-4 text-sm font-medium']">
                  Potential assets
                  <span class="inline-flex ml-2 rounded bg-violet-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'bofi_asset_change'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>
              </div>

              <div class="flex space-x-4">
                <button @click="setActiveSort('name')" :class="[activeSort == 'name' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap px-1 py-4 text-sm font-medium']">
                  Name
                  <span class="inline-flex ml-2 rounded bg-violet-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'name' " :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('updated_at')" :class="[activeSort == 'updated_at' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap px-1 py-4 text-sm font-medium']">
                  Updated
                  <span class="inline-flex ml-2 rounded bg-violet-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'updated_at'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </template>

    <!-- Dashboards -->
    <div v-if="dashboards && sortedDashboards.length" class="flex flex-col gap-4 mb-20">
      <RouterLink 
        v-for="dashboard in sortedDashboards" 
        :to="{name: 'dashboard', params: {organization: dashboard.organization.slug, dashboard: dashboard.id}}"
        target="_blank"
        class="group relative flex flex-col cursor-pointer overflow-hidden rounded-lg shadow-sm border bg-white hover:shadow-md"
      >          
        <div class="flex flex-col space-y-4 px-4 py-4">
          <!-- Card header -->
          <div :class="dashboard.median_analysis && dashboard.max_analysis ? 'border-b pb-4' : ''" class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <ChartBarIcon class="w-5 text-violet-500"/>
              <h3 class="text-xl font-medium text-gray-900">{{ dashboard.name }}</h3>
            </div>
            
            <div class="flex items-center gap-3">
              <!-- Users count -->
              <!-- <span v-if="dashboard.latest_analysis && dashboard.latest_analysis.subject_funnel_users" class="text-sm text-gray-500 border-r border-gray-300 pr-3">{{ dashboard.latest_analysis.subject_funnel_users }} users</span> -->

              <!-- Funnels count -->
              <span class="text-sm text-gray-500 border-r border-gray-300 pr-3">{{ dashboard.funnels_count }} funnels</span>

              <!-- Dashboard updated at -->
              <span class="text-sm text-gray-500 pr-3">Modified {{ moment(dashboard.updated_at).fromNow() }}</span>
            </div>
          </div>

          <!-- Issue -->
          <AnalysisWarning v-if="dashboard.warning" :warning="dashboard.warning" class="py-2"/>
          <AnalysisIssue v-if="dashboard.issue" :issue="dashboard.issue"/>

          <!-- Analysis in progress -->
          <div v-if="dashboard.analysis_in_progress" class="mb-3">
            <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
            Analysis in progress...
          </div>

          <!-- Analysis -->
          <div v-else-if="!dashboard.issue && dashboard[activeAnalysisType]">
            <AnalysisExcerpt :analysis="dashboard[activeAnalysisType]"/>

            <div class="divide-x divide-gray-300 border-t pt-3 text-sm text-gray-400">
              <span class="pr-2">Analysis created {{ moment(dashboard[activeAnalysisType].created_at).fromNow() }}</span> 
              <span class="pl-2">28 day period {{ moment(dashboard[activeAnalysisType].start_date).format('MMM DD, Y') }} - {{ moment(dashboard[activeAnalysisType].end_date).format('MMM DD, Y') }}</span>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>

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
    <div v-else class="flex flex-col items-center justify-center border border-violet-400 border-dashed rounded-lg py-6 px-2 cursor-pointer hover:bg-violet-50">
      <Squares2X2Icon class="mx-auto h-10 w-10 text-violet-500" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-violet-500">No dashboards to show</h2>
    </div>
  </LayoutAdmin>
</template>

<script setup>
import moment from "moment"
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminDashboardApi } from '@/domain/admin/api/adminDashboardApi.js'
import { Squares2X2Icon } from '@heroicons/vue/24/outline'
import { ChartBarIcon } from '@heroicons/vue/24/solid'
import { ChevronUpIcon, MinusIcon } from '@heroicons/vue/20/solid'
import LayoutAdmin from '@/app/layouts/LayoutAdmin.vue'
import AnalysisExcerpt from '@/domain/analyses/components/AnalysisExcerpt.vue'
import AnalysisIssue from '@/domain/analyses/components/AnalysisIssue.vue'
import AnalysisWarning from '@/domain/analyses/components/AnalysisWarning.vue'

const route = useRoute()
const router = useRouter()

const dashboards = ref()
const isLoading = ref(false)
const isShowingOrganizations = ref(false)

const activeAnalysisType = ref('median_analysis')

const activeSort = ref('bofi_performance')
const activeSortDirection = ref('asc')

const sortedDashboards = computed(() => {
  if (!activeSort.value) {
    return dashboards.value
  }

  // sort by analysis numerical columns
  if (['subject_funnel_users', 'subject_funnel_performance', 'bofi_performance', 'bofi_asset_change'].includes(activeSort.value)) {
    return [...dashboards.value].sort(function (a, b) {
      if (!a[activeAnalysisType.value] || !b[activeAnalysisType.value]) {
        return 0
      }

      var x = parseInt(a[activeAnalysisType.value][activeSort.value], 10)
      var y = parseInt(b[activeAnalysisType.value][activeSort.value], 10)

      if (x === 0 && y === 0) {
        return 1 / x - 1 / y || 0
      }
      
      if (activeSortDirection.value === 'asc') {
          return x - y
      } else if (activeSortDirection.value === 'desc') {
          return y - x
      }
    })
  }

  // sort by name
  if (activeSort.value === 'name') {
    return [...dashboards.value].sort(function (a, b) {
      if (activeSortDirection.value === 'asc') {
        return a.name.localeCompare(b.name)
      } else if (activeSortDirection.value === 'desc') {
        return b.name.localeCompare(a.name)
      }
    })
  }

  // sort by dashboard updated_at
  if (activeSort.value === 'updated_at') {
    return [...dashboards.value].sort(function (a, b) {
      if (activeSortDirection.value === 'asc') {
        return b.updated_at.localeCompare(a.updated_at)
      } else if (activeSortDirection.value === 'desc') {
        return a.updated_at.localeCompare(b.updated_at)
      }
    })
  }
})

function setActiveSort(sort) {
  // Toggle current sort off
  if (activeSort.value == sort) {
    toggleActiveSortDirection()
    return
  }

  // Default Users and Potential assets to desc
  if (['subject_funnel_users', 'bofi_asset_change'].includes(sort)) {
    activeSortDirection.value = 'desc'
    activeSort.value = sort
    return
  }

  // Set new sort
  activeSortDirection.value = 'asc'
  activeSort.value = sort
}

function toggleActiveSortDirection(sort) {
  activeSortDirection.value = activeSortDirection.value == 'desc' ? 'asc' : 'desc'
}

function loadDashboards() {
  isLoading.value = true

  adminDashboardApi.index().then(response => {
    isLoading.value = false
    dashboards.value = response.data.data
  })
}

function analyzeAllDashboards() {
  isLoading.value = true

  adminDashboardApi.analyzeAll().then(response => {
    isLoading.value = false
    dashboards.value = response.data.data
  })
}

onMounted(() => {
  loadDashboards()
})
</script>
