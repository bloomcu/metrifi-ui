<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Dashboards</h1>
      <div class="flex gap-4">
        <!-- Show/hide organizations -->
        <!-- <div v-if="authStore.user.role === 'admin'" class="flex items-center py-2">
          <input v-model="isShowingOrganizations" required id="agree" name="agree" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
          <label for="agree" class="ml-2 block text-sm leading-6 text-gray-900">
            Show organizations
          </label>
        </div> -->

        <AppButton @click="storeNewDashboard()">
          Create dashboard
        </AppButton>
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
          class="group relative flex flex-col cursor-pointer overflow-hidden rounded-lg shadow-md border border-gray-200 bg-white hover:shadow-lg"
        >
          <!-- <div class="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-38">
            <img :src="product.imageSrc" :alt="product.imageAlt" class="h-full w-full object-cover object-center sm:h-full sm:w-full" />
          </div> -->
          
          <div class="flex flex-col divide-y space-y-4 px-4 pt-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <ChartBarIcon class="w-5 text-indigo-600"/>
                <h3 class="text-xl font-medium text-gray-900">{{ dashboard.name }}</h3>
              </div>
              
              <button @click.stop="destroyDashboard(dashboard.id)" class="cursor-pointer font-medium rounded-md p-1.5 text-sm text-gray-400 bg-white hover:bg-gray-50 ring-1 ring-inset ring-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>

            <!-- <div 
              v-if="dashboard.latest_analysis" 
              v-html="dashboard.latest_analysis.content" 
              class="prose prose-h2:mb-2 prose-h3:mb-1.5 prose-p:my-1 py-4 space-y-3"
            ></div> -->

            <div class="flex flex-col py-4 space-y-3">
              <p><strong>Conversion rate:</strong> {{ dashboard.subject_funnel_performance }}% {{ dashboard.subject_funnel_performance <= 0 ? 'lower' : 'higher' }} than comparisons</p>
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
import { ref, onMounted } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import { dashboardApi } from '@/domain/dashboards/api/dashboardApi.js'
import { Squares2X2Icon } from '@heroicons/vue/24/outline'
import { ChartBarIcon } from '@heroicons/vue/24/solid'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()

const dashboards = ref()
const isLoading = ref(false)
const isShowingOrganizations = ref(false)

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
