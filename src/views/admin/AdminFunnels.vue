<template>
  <LayoutAdmin>
    <template #topbar>
      <div class="relative pb-5 sm:pb-0">
        <!-- Title -->
        <div class="md:flex md:items-center md:justify-between">
          <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">All Funnels</h1>
          <!-- <div class="flex gap-3 md:absolute md:right-0">
            <AppButton @click="analyzeAllDashboards()">Analyze all funnels</AppButton>
          </div> -->
        </div>

        <!-- Analysis type tabs -->
        <!-- <div class="mt-4">
          <nav class="flex justify-between">
            <div class="flex space-x-6">
              <button @click="activeAnalysisType = 'median_analysis'" :class="[activeAnalysisType == 'median_analysis' ? 'border-violet-500 text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-5 pb-1 text-lg font-medium']">Average</button>
              <button @click="activeAnalysisType = 'max_analysis'" :class="[activeAnalysisType == 'max_analysis' ? 'border-violet-500 text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-5 pb-1 text-lg font-medium']">Maximum</button>
            </div>
          </nav>
        </div> -->

        <!-- Sorting tabs -->
        <!-- <div class="mt-2">
          <div class="hidden sm:block">
            <nav class="-mb-px flex justify-between">
              <div class="flex space-x-4">
                <button @click="setActiveSort('conversionRate')" :class="[activeSort == 'conversionRate' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
                  Conversion rate
                  <span class="inline-flex ml-2 rounded bg-violet-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'conversionRate'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('users')" :class="[activeSort == 'users' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
                  Users
                  <span class="inline-flex ml-2 rounded bg-violet-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'users'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('steps_count')" :class="[activeSort == 'steps_count' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap pr-1 py-4 text-sm font-medium']">
                  Steps
                  <span class="inline-flex ml-2 rounded bg-violet-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'steps_count'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>
              </div>

              <div class="flex space-x-4">
                <button @click="setActiveSort('name')" :class="[activeSort == 'name' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
                  Name
                  <span class="inline-flex ml-2 rounded bg-violet-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'name' " :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('updated_at')" :class="[activeSort == 'updated_at' ? 'text-violet-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
                  Last modified
                  <span class="inline-flex ml-2 rounded bg-violet-100 __hover:bg-gray-200">
                    <ChevronUpIcon v-if="activeSort == 'updated_at'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </div> -->
      </div>
    </template>

    <!-- Funnels -->
    <table v-if="funnels && funnels.length" class="min-w-full table-fixed overflow-hidden divide-y divide-gray-300 ring-1 ring-gray-300 mb-20 sm:mx-0 sm:rounded-lg">
      <thead>
        <tr class="">
          <th scope="col" class="py-3.5 pl-4 pr-4 sm:pl-4 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('name')" :class="[activeSort == 'name' ? 'text-violet-600' : 'border-transparent', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Name
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'name'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('conversion_rate')" :class="[activeSort == 'conversion_rate' ? 'text-violet-600' : 'border-transparent', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Conversion rate
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'conversion_rate'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('users')" :class="[activeSort == 'users' ? 'text-violet-600' : 'border-transparent', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Users
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'users'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('steps_count')" :class="[activeSort == 'steps_count' ? 'text-violet-600' : 'border-transparent', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Steps
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'steps_count'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('category')" :class="[activeSort == 'category' ? 'text-violet-600' : 'border-transparent', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Category
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'category'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <th scope="col" class="py-3.5 text-left text-sm font-medium text-gray-900">
            <button @click="setActiveSort('updated')" :class="[activeSort == 'updated' ? 'text-violet-600' : 'border-transparent', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Updated
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'updated'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>

          <!-- <th scope="col" class="py-3.5"></th> -->
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">
        <tr v-for="funnel in funnels" :key="funnel.id" @click="router.push({name: 'funnel', params: {funnel: funnel.id}})" class="hover:bg-gray-50 cursor-pointer">
          <!-- Funnel -->
          <td class="py-4 pr-2 text-sm w-2/5 sm:pl-4">
            <div class="flex-auto">
              <p class="mb-1 text-base font-medium leading-6 text-gray-900">{{ funnel.name }}</p>

              <div class="flex gap-2">
                <p class="text-gray-500">{{ funnel.organization.title }}</p>
                <div v-if="funnel.automation_msg" class="flex items-center text-sm leading-5 text-pink-600">
                  <p>{{ funnel.automation_msg }}</p>
                </div>

                <p v-if="funnel.messages.length" class="text-sm leading-5">
                  <span class="mr-1.5 text-gray-400">•</span>
                  <span class="text-green-500">{{ funnel.messages.length }} notification</span>
                </p>
              </div>
            </div>
          </td>

          <!-- Conversion -->
          <!-- <td class="whitespace-nowrap py-4 pr-4 text-sm text-gray-400">
            <p class="mb-0.5">{{ funnel.snapshots ? funnel.snapshots.last28Days.conversionRate + '%' : '' }}</p>
            <p class="text-xs">last 28 days</p>
          </td> -->

          <!-- Conversion rate -->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            <div class="flex items-center text-sm">
              -
            </div>
          </td>

          <!-- Users -->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            <div class="flex items-center text-sm">
              -
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

          <!-- Options -->
          <!-- <td scope="col" class="py-4 pr-4">
            <div class="flex justify-end gap-2">
              <AppButton @click.stop="replicateFunnel(funnel.id)" variant="tertiary">Copy</AppButton>
              <AppButton @click.stop="destroyFunnel(funnel.id)" variant="tertiary">Delete</AppButton>
            </div>
          </td> -->
        </tr>

        <tr ref="loadMoreElement" class="sr-only h-1"></tr>
      </tbody>
    </table>

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

    <!-- Empty state: No funnels -->
    <div v-else class="flex flex-col items-center justify-center border border-violet-400 border-dashed rounded-lg py-6 px-2 cursor-pointer hover:bg-violet-50">
      <ChartBarIcon class="mx-auto h-10 w-10 text-violet-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-violet-600">No funnels to show</h2>
    </div>
  </LayoutAdmin>
</template>

<script setup>
import moment from "moment"
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useInfiniteScroll } from '@/app/composables/base/useInfiniteScroll'
import { adminFunnelApi } from '@/domain/admin/api/adminFunnelApi.js'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import { ChevronUpIcon, MinusIcon } from '@heroicons/vue/20/solid'
import LayoutAdmin from '@/app/layouts/LayoutAdmin.vue'

const route = useRoute()
const router = useRouter()

const { loadMoreElement, items: funnels, isLoading } = useInfiniteScroll(adminFunnelApi.index)

const activeSort = ref('conversionRate')
const activeSortDirection = ref('asc')

function setActiveSort(sort) {
  // Toggle current sort off
  if (activeSort.value == sort) {
    toggleActiveSortDirection()
    return
  }

  // Default Users and Potential assets to desc
  if (['steps_count', 'bofi_asset_change'].includes(sort)) {
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

function loadFunnels() {
  isLoading.value = true

  adminFunnelApi.index().then(response => {
    isLoading.value = false
    funnels.value = response.data.data
  })
}

onMounted(() => {
  loadFunnels()
})
</script>
