<template>
  <LayoutAdmin>
    <template #topbar>
      <div class="relative pb-5 sm:pb-0">
        <!-- Title -->
        <div class="md:flex md:items-center md:justify-between">
          <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">All Funnels</h1>
          <div class="flex gap-3 md:absolute md:right-0">
            <AppButton @click="snapshotAllFunnels()">Analyze all funnels</AppButton>
          </div>
        </div>

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
            <button @click="setActiveSort('created')" :class="[activeSort == 'created' ? 'text-violet-600' : 'border-transparent', 'flex items-center whitespace-nowrap py-2 text-sm font-medium']">
              Created
              <span class="inline-flex ml-2 rounded bg-violet-100">
                <ChevronUpIcon v-if="activeSort == 'created'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
              </span>
            </button>
          </th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">
        <tr v-for="funnel in funnels" :key="funnel.id" @click="showFunnel(funnel)" class="hover:bg-gray-50 cursor-pointer">
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

          <!-- Conversion rate -->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            <div class="flex items-center text-sm">
              {{ funnel.snapshots.last28Days.conversion_rate !== null ? funnel.snapshots.last28Days.conversion_rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%' : '' }}
            </div>
          </td>

          <!-- Users -->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            <div class="flex items-center text-sm">
              {{ funnel.snapshots.last28Days.users !== null ? funnel.snapshots.last28Days.users.toLocaleString() : '' }}
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useInfiniteScroll } from '@/app/composables/base/useInfiniteScroll'
import { adminFunnelApi } from '@/domain/admin/api/adminFunnelApi.js'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import { ChevronUpIcon, MinusIcon } from '@heroicons/vue/20/solid'
import LayoutAdmin from '@/app/layouts/LayoutAdmin.vue'

const router = useRouter()

// const { loadMoreElement, items: funnels, isLoading } = useInfiniteScroll(adminFunnelApi.index)
const { 
    loadMoreElement, 
    items: funnels, 
    isLoading, 
    updateParams 
} = useInfiniteScroll(adminFunnelApi.index, {}, { sort: '' })

const activeSort = ref('conversionRate')
const activeSortDirection = ref('asc')

// function setActiveSort(sort) {
//   // Toggle current sort off
//   if (activeSort.value == sort) {
//     toggleActiveSortDirection()
//     return
//   }

//   // Set new sort
//   activeSortDirection.value = 'asc'
//   activeSort.value = sort
// }

// function toggleActiveSortDirection(sort) {
//   activeSortDirection.value = activeSortDirection.value == 'desc' ? 'asc' : 'desc'
// }

function setActiveSort(sort) {
    if (activeSort.value === sort) {
        activeSortDirection.value = activeSortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
        activeSort.value = sort
        activeSortDirection.value = 'desc'
    }

    const sortParam = activeSortDirection.value === 'desc' ? `-${sort}` : sort
    updateParams({ sort: sortParam }) // Pass updated sort parameters
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
    funnels.value = response.data.data
  })
}

function showFunnel(funnel) {
  const route = router.resolve({name: 'funnel', params: {funnel: funnel.id, organization: funnel.organization.slug}});
  window.open(route.href, '_blank');
}

onMounted(() => {
  loadFunnels()
})
</script>
