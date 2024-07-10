<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Dashboards</h1>
      <div class="flex gap-4">
        <!-- Show/hide organizations -->
        <div v-if="authStore.user.role === 'admin'" class="flex items-center py-2">
          <input v-model="isShowingOrganizations" required id="agree" name="agree" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
          <label for="agree" class="ml-2 block text-sm leading-6 text-gray-900">
            Show organizations
          </label>
        </div>

        <AppButton @click="storeNewDashboard()">
          Create dashboard
        </AppButton>
      </div>
    </template>

    <!-- Dashboards -->
    <div v-if="dashboards && dashboards.length" class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-6">
      <div 
        v-for="dashboard in dashboards" 
        @click="router.push({name: 'dashboard', params: {dashboard: dashboard.id}})" 
        class="group relative flex flex-col cursor-pointer overflow-hidden rounded-lg shadow-md border border-gray-200 bg-white hover:shadow-lg"
      >
        <!-- <div class="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-38">
          <img :src="product.imageSrc" :alt="product.imageAlt" class="h-full w-full object-cover object-center sm:h-full sm:w-full" />
        </div> -->
        
        <div class="flex flex-col h-full divide-y space-y-6 px-4 pt-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-medium text-gray-900">{{ dashboard.name }}</h3>
            <AppButton @click.stop="destroyDashboard(dashboard.id)" variant="link">Delete</AppButton>
          </div>

          <div class="flex flex-col divide-y">
            <div v-if="dashboard.funnels.length" v-for="funnel in dashboard.funnels" class="flex items-center justify-between justify-self-end py-3">
              <div class="flex flex-row items-center">
                  <ChartBarIcon class="w-4 mr-1 text-indigo-600"/>
                  <p>{{ funnel.name }}</p>
                </div>

              <div class="flex items-center gap-2 divide-x">
                <p v-if="isShowingOrganizations" class="text-sm text-gray-500">{{ funnel.organization.title }}</p>

                <!-- <div class="flex items-center gap-1 pl-2">
                  <p :class="funnel.winning ? 'text-emerald-400' : 'text-gray-500'" class="text-base font-medium">{{ funnel.overall_conversion_rate }}%</p>
                  <p class="text-sm text-gray-500">CR</p>
                </div> -->
              </div>
            </div>
            
            <div v-else class="py-3">
              <span class="text-gray-400">No funnels</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Add dashboard -->
      <!-- <div @click="storeNewDashboard()" class="flex items-center justify-center border border-indigo-400 border-dashed rounded-lg py-6 px-2 cursor-pointer hover:bg-indigo-50">
        <h2 class="text-lg font-medium text-indigo-600">Add a dashboard</h2>
      </div> -->
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
    <div v-else @click="storeNewDashboard()" class="flex flex-col items-center justify-center border border-indigo-400 border-dashed rounded-lg py-6 px-2 cursor-pointer hover:bg-indigo-50">
      <Squares2X2Icon class="mx-auto h-10 w-10 text-indigo-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-indigo-600">Create a dashboard</h2>
    </div>
  </LayoutWithSidebar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

onMounted(() => {
  loadDashboards()
})
</script>
