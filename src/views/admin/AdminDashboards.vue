<template>
  <LayoutAdmin>
    <template #topbar>
      <div class="relative border-b border-gray-200 pb-5 sm:pb-0">
        <!-- Title -->
        <div class="md:flex md:items-center md:justify-between">
          <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Dashboards</h1>
        </div>

        <!-- Sorting -->
        <div class="mt-4">
          <div class="hidden sm:block">
            <nav class="-mb-px flex justify-between">
              <div class="flex space-x-4">
                <button @click="setActiveSort('bofi_performance')" :class="[activeSort == 'bofi_performance' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium']">
                  Biggest opportunity
                  <span class="inline-flex ml-2 rounded bg-gray-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'bofi_performance'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-gray-900 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-gray-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('subject_funnel_performance')" :class="[activeSort == 'subject_funnel_performance' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium']">
                  Conversion rate
                  <span class="inline-flex ml-2 rounded bg-gray-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'subject_funnel_performance'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-gray-900 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-gray-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('subject_funnel_users')" :class="[activeSort == 'subject_funnel_users' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pr-1 py-4 text-sm font-medium']">
                  Users
                  <span class="inline-flex ml-2 rounded bg-gray-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'subject_funnel_users'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-gray-900 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-gray-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('bofi_asset_change')" :class="[activeSort == 'bofi_asset_change' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium']">
                  Potential assets
                  <span class="inline-flex ml-2 rounded bg-gray-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'bofi_asset_change'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-gray-900 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-gray-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>
              </div>

              <div class="flex space-x-4">
                <button @click="setActiveSort('name')" :class="[activeSort == 'name' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium']">
                  Name
                  <span class="inline-flex ml-2 rounded bg-gray-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'name' " :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-gray-900 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-gray-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('updated_at')" :class="[activeSort == 'updated_at' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium']">
                  Last modified
                  <span class="inline-flex ml-2 rounded bg-gray-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'updated_at'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-gray-900 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-gray-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </template>

    <!-- Dashboards -->
    <div v-if="dashboards && sortedDashboards.length" class="flex flex-col gap-4">
      <RouterLink 
        v-for="dashboard in sortedDashboards" 
        :to="{name: 'dashboard', params: {organization: dashboard.organization.slug, dashboard: dashboard.id}}"
        target="_blank"
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
              <!-- <span v-if="dashboard.latest_analysis && dashboard.latest_analysis.subject_funnel_users" class="text-sm text-gray-500 border-r border-gray-300 pr-3">{{ dashboard.latest_analysis.subject_funnel_users }} users</span> -->

              <!-- Funnels count -->
              <span class="text-sm text-gray-500 border-r border-gray-300 pr-3">{{ dashboard.funnels.length }} funnels</span>

              <!-- Dashbaord updated at -->
              <span class="text-sm text-gray-500 pr-3">Modified {{ moment(dashboard.updated_at).fromNow() }}</span>
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
    <div v-else class="flex flex-col items-center justify-center border border-indigo-400 border-dashed rounded-lg py-6 px-2 cursor-pointer hover:bg-indigo-50">
      <Squares2X2Icon class="mx-auto h-10 w-10 text-indigo-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-indigo-600">No dashboards to show</h2>
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

const route = useRoute()
const router = useRouter()

const dashboards = ref()
const isLoading = ref(false)
const isShowingOrganizations = ref(false)

const activeSort = ref('bofi_performance')
const activeSortDirection = ref('asc')

const sortedDashboards = computed(() => {
  if (!activeSort.value) {
    return dashboards.value
  }

  // sort by analysis numerical columns
  if (['subject_funnel_users', 'subject_funnel_performance', 'bofi_performance', 'bofi_asset_change'].includes(activeSort.value)) {
    return [...dashboards.value].sort(function (a, b) {
      if (!a['latest_analysis'] || !b['latest_analysis']) {
        return 0
      }

      var x = parseInt(a['latest_analysis'][activeSort.value], 10)
      var y = parseInt(b['latest_analysis'][activeSort.value], 10)

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

onMounted(() => {
  loadDashboards()
})
</script>
