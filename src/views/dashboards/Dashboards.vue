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

      <!-- Force anonymous sharing -->
      <div v-else-if="organizationStore.organization && organizationStore.organization.is_private" class="fixed h-full w-full items-center bg-white bg-opacity-60 backdrop-blur-sm flex justify-center z-50">
        <div class="max-w-3xl lg:-ml-60 flex flex-col text-center items-center justify-center border rounded-xl bg-white shadow-xl mx-4 p-10">
          <EyeIcon class="w-10 h-10 mb-4 text-violet-500" aria-hidden="true" />
          <h1 class="mb-2 text-3xl font-medium text-gray-900">Turn on anonymous sharing</h1>
          <p class="text-lg text-gray-700">In order to compare your analytics with other organizations, you need to share your data anonymously.</p>

          <!-- Switch -->
          <div v-if="organizationStore.organization" class="my-8 max-w-2xl">
            <fieldset aria-label="Privacy setting" class="text-left">
              <RadioGroup v-model="organizationStore.organization.is_private" class="-space-y-px rounded-md bg-white">
                <RadioGroupOption as="template" v-for="(setting, settingIdx) in privacySettings" :key="setting.name" :value="setting.value" :aria-label="setting.name" :aria-description="setting.description" v-slot="{ checked, active }">
                  <div :class="[settingIdx === 0 ? 'rounded-tl-md rounded-tr-md' : '', settingIdx === privacySettings.length - 1 ? 'rounded-bl-md rounded-br-md' : '', checked ? 'z-10 border-violet-200 bg-violet-50' : 'border-gray-200', 'relative flex cursor-pointer border p-5 focus:outline-none']">
                    <span :class="[checked ? 'border-transparent bg-violet-500' : 'border-gray-300 bg-white', active ? 'ring-2 ring-violet-600 ring-offset-2' : '', 'mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border']" aria-hidden="true">
                      <span class="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <span class="ml-4 flex flex-col">
                      <component :is="setting.icon" :class="[checked ? 'text-violet-500' : 'text-gray-500']" class="-ml-0.5 mb-2 h-5 w-5" aria-hidden="true" />
                      <span :class="[checked ? 'text-violet-700' : 'text-gray-900']" class="block text-sm font-medium mb-2">{{ setting.name }}</span>
                      <span :class="[checked ? 'text-violet-500' : 'text-gray-500']" class="block text-sm">{{ setting.description }}</span>
                    </span>
                  </div>
                </RadioGroupOption>
              </RadioGroup>
            </fieldset>
          </div>

          <p class="text-gray-500">You can change this anytime in the <RouterLink :to="{name: 'settingsSharing'}" class="text-violet-500">Sharing</RouterLink> section of the settings menu.</p>
        </div>
      </div>
    </template>

    <template #topbar>
      <!-- Suggest anonymous sharing -->
      <!-- <div v-if="organizationStore.organization && organizationStore.organization.is_private" @click="router.push({name: 'settingsSharing'})" class="flex items-center justify-between rounded-lg bg-violet-50 p-6 mb-6 cursor-pointer hover:bg-violet-100">
        <div>
          <h3 class="text-xl font-medium text-violet-500 mb-1">Turn on anonymous sharing</h3>      
          <p class="text-gray-500">In order to compare your analytics with other organizations, you need to share your data anonymously.</p>
        </div>
        <AppButton>Enable anonymous sharing</AppButton>
      </div> -->

      <div class="relative border-b border-gray-200 pb-5 sm:pb-0">
        <!-- Title -->
        <div class="mb-5 md:flex md:items-center md:justify-between">
          <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Dashboards</h1>
          <div class="flex gap-3 md:absolute md:right-0">
            <!-- <AppButton variant="tertiary">
              Analyze all dashboards
            </AppButton> -->
            <AppButton v-if="organizationStore.organization && organizationStore.organization.funnels_count !== 0 && !organizationStore.organization.is_private" @click="storeNewDashboard()">
              Create dashboard
            </AppButton>
          </div>
        </div>

        <!-- Analysis type tabs -->
        <nav class="flex justify-between mb-4">
          <div class="flex space-x-6">
            <button @click="activeAnalysisType = 'median_analysis'" :class="[activeAnalysisType == 'median_analysis' ? 'border-violet-500 text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-3 pb-1 text-lg font-medium']">Average</button>
            <button @click="activeAnalysisType = 'max_analysis'" :class="[activeAnalysisType == 'max_analysis' ? 'border-violet-500 text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-3 pb-1 text-lg font-medium']">Maximum</button>
          </div>
        </nav>

        <!-- Total assets -->
        <div v-if="organizationStore.organization && organizationStore.organization.assets" class="bg-white w-2/3 border rounded-lg overflow-hidden">
          <div v-if="activeAnalysisType === 'median_analysis'" class="flex flex-1">
            <div class="flex flex-1 flex-col gap-0.5 px-4 py-3">
                <p>Total assets</p>
                <span class="text-2xl font-medium">{{ organizationStore.organization.assets.median.assets.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }}</span>
            </div>
            <div class="flex flex-1 flex-col gap-0.5 text-violet-500 border-l px-4 py-3">
                <p>Total potential assets</p>
                <p class="flex items-center gap-1 text-2xl font-medium">
                    {{ organizationStore.organization.assets.median.total_potential.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }}
                    <span v-if="organizationStore.organization.assets.max.potential !== 0" class="text-sm">(+{{ organizationStore.organization.assets.median.potential.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }})</span>
                </p>
            </div>
          </div>

          <div v-if="activeAnalysisType === 'max_analysis'" class="flex flex-1">
            <div class="flex flex-1 flex-col gap-0.5 px-4 py-3">
                <p>Total assets</p>
                <span class="text-2xl font-medium">{{ organizationStore.organization.assets.max.assets.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }}</span>
            </div>
            <div class="flex flex-1 flex-col gap-0.5 text-violet-500 border-l px-4 py-3">
                <p>Total potential assets</p>
                <p class="flex items-center gap-1 text-2xl font-medium">
                    {{ organizationStore.organization.assets.max.total_potential.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }}
                    <span v-if="organizationStore.organization.assets.max.potential !== 0" class="text-sm">(+{{ organizationStore.organization.assets.max.potential.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }})</span>
                </p>
            </div>
          </div>

          <div class="px-4 py-2 text-sm text-gray-400 border-t">28 day period {{ moment().subtract(28, 'days').format('MMM DD, Y') }} - {{ moment().subtract(1, 'days').format('MMM DD, Y') }}</div>
        </div>

        <!-- Sorting tabs -->
        <div class="mt-2">
          <div class="hidden sm:block">
            <nav class="-mb-px flex justify-between">
              <div class="flex space-x-4">
                <button @click="setActiveSort('bofi_performance')" :class="[activeSort == 'bofi_performance' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap px-1 py-4 text-sm font-medium']">
                  Step opportunity
                  <span class="inline-flex ml-2 rounded bg-white border">
                    <ChevronUpIcon v-if="activeSort == 'bofi_performance'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('subject_funnel_performance')" :class="[activeSort == 'subject_funnel_performance' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap px-1 py-4 text-sm font-medium']">
                  Conversion rate
                  <span class="inline-flex ml-2 rounded bg-white border">
                    <ChevronUpIcon v-if="activeSort == 'subject_funnel_performance'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('subject_funnel_users')" :class="[activeSort == 'subject_funnel_users' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap pr-1 py-4 text-sm font-medium']">
                  Users
                  <span class="inline-flex ml-2 rounded bg-white border">
                    <ChevronUpIcon v-if="activeSort == 'subject_funnel_users'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('bofi_asset_change')" :class="[activeSort == 'bofi_asset_change' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap px-1 py-4 text-sm font-medium']">
                  Potential assets
                  <span class="inline-flex ml-2 rounded bg-white border">
                    <ChevronUpIcon v-if="activeSort == 'bofi_asset_change'" :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>
              </div>

              <div class="flex space-x-4">
                <button @click="setActiveSort('name')" :class="[activeSort == 'name' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap px-1 py-4 text-sm font-medium']">
                  Name
                  <span class="inline-flex ml-2 rounded bg-white border">
                    <ChevronUpIcon v-if="activeSort == 'name' " :class="activeSortDirection == 'desc' ? 'rotate-180' : ''" class="text-violet-700 h-5 w-5" aria-hidden="true" />
                    <MinusIcon v-else class="text-violet-300 h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button @click="setActiveSort('updated_at')" :class="[activeSort == 'updated_at' ? 'text-violet-500' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap px-1 py-4 text-sm font-medium']">
                  Last modified
                  <span class="inline-flex ml-2 rounded bg-white border">
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

    <!-- Force funnel create first -->
    <div v-if="organizationStore.organization && organizationStore.organization.funnels_count === 0" @click="storeNewFunnel()" class="rounded-lg border border-dashed border-violet-400 p-6 pb-8 mb-8 hover:bg-violet-50 cursor-pointer">
      <ChartBarIcon class="w-10 h-10 mb-6 text-violet-500" aria-hidden="true" />
      <h3 class="mb-2 text-2xl font-medium text-violet-500">You need a funnel</h3>
      <p class="text-lg text-gray-700 mb-4">You need a funnel to compare before creating a dashboard.</p>
      <AppButton>Create a funnel</AppButton>
    </div>

    <!-- List dashboards -->
    <VueDraggableNext 
      v-else-if="dashboards && sortedDashboards.length"
      :list="dashboards" 
      :animation="150"
      @change="handleDragEvent($event)"
      class="flex flex-col gap-4 mb-20"
    >
      <div
        v-for="dashboard in sortedDashboards" 
        @click="router.push({ name: 'dashboard', params: { organization: dashboard.organization.slug, dashboard: dashboard.id }})"
        class="group relative flex flex-col cursor-pointer overflow-hidden rounded-lg shadow-sm border bg-white hover:shadow-md"
      >
        <div class="flex flex-col space-y-4 w-full px-4 py-4">
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

              <!-- Delete -->
              <button @click.stop="destroyDashboard(dashboard.id)" class="cursor-pointer font-medium rounded-md p-1.5 text-sm text-gray-400 bg-white hover:bg-gray-200 ring-1 ring-inset ring-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Analysis in progress -->
          <div v-if="dashboard.analysis_in_progress" class="mb-3">
            <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
            Analysis in progress...
          </div>

          <!-- Issue -->
          <AnalysisIssue v-else-if="dashboard.issue" :issue="dashboard.issue"/>

          <!-- Analysis -->
          <div v-else-if="dashboard[activeAnalysisType]">
            <AnalysisExcerpt :analysis="dashboard[activeAnalysisType]"/>

            <div class="divide-x divide-gray-300 border-t pt-3 text-sm text-gray-400">
              <span class="pr-2">Analysis created {{ moment(dashboard[activeAnalysisType].created_at).fromNow() }}</span> 
              <span class="pl-2">28 day period {{ moment(dashboard[activeAnalysisType].start_date).format('MMM DD, Y') }} - {{ moment(dashboard[activeAnalysisType].end_date).format('MMM DD, Y') }}</span>
            </div>
          </div>
        </div>
      </div>
    </VueDraggableNext>

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
    <div v-else @click="storeNewDashboard()" class="flex flex-col items-center justify-center border border-violet-400 border-dashed rounded-lg py-6 px-2 cursor-pointer hover:bg-violet-50">
      <Squares2X2Icon class="mx-auto h-10 w-10 text-violet-500" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-violet-500">Create a dashboard</h2>
    </div>
  </LayoutWithSidebar>
</template>

<script setup>
import moment from "moment"
import { ref, computed, watch, onMounted } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useRoute, useRouter } from 'vue-router'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { dashboardApi } from '@/domain/dashboards/api/dashboardApi.js'
import { Squares2X2Icon, ChartBarIcon, EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { RadioGroup, RadioGroupOption } from '@headlessui/vue'
import { ChevronUpIcon, MinusIcon } from '@heroicons/vue/20/solid'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'
import AnalysisExcerpt from '@/domain/analyses/components/AnalysisExcerpt.vue'
import AnalysisIssue from '@/domain/analyses/components/AnalysisIssue.vue'

const route = useRoute()
const router = useRouter()

const { connectToGoogle } = useConnections()

const organizationStore = useOrganizationStore()
const dashboards = ref()
const isLoading = ref(false)

const activeAnalysisType = ref('median_analysis')
const activeSort = ref('bofi_performance')
const activeSortDirection = ref('asc')

// Privacy toggle
const privacySettings = [
  { 
    name: 'Private (no sharing)', 
    value: 1, 
    description: 'Your analytics data is not shared with anyone outside of your organization. Data from other organizations is not shared with you.',
    icon: EyeSlashIcon,
  },  
  { 
    name: 'Share anonymously', 
    value: 0, 
    description: 'Your analytics data is anonymously shared with people outside of your organization. Anonymous data from other organizations is shared with you.',
    icon: EyeIcon,
  },
]

const sortedDashboards = computed(() => {
  if (!activeSort.value) {
    return dashboards.value
  }

  // console.log('Active sort: ', activeSort.value)

  // sort by analysis numerical columns
  if (['subject_funnel_users', 'subject_funnel_performance', 'bofi_performance', 'bofi_asset_change'].includes(activeSort.value)) {
    return [...dashboards.value].sort(function (a, b) {
      // console.log('A', a['median_analysis'])
      // console.log('B', b['median_analysis'])

      if (!a[activeAnalysisType.value] || !b[activeAnalysisType.value]) {
        return 0
      }

      // console.log(parseInt(a['median_analysis'][activeSort.value], 10))

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

function showDashboard(dashboardId) {
  router.push({ name: 'dashboard', params: { dashboard: dashboardId } })
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

// Watch privacy toggle
watch(
  () => organizationStore.organization?.is_private,
  (newValue, oldValue) => {
    // Ensure the watcher doesn't trigger unnecessarily
    if (newValue === undefined) return;

    organizationStore.update()
  },
  { deep: true, immediate: false } // Prevent the watcher from firing at initialization
)

onMounted(() => {
  loadDashboards()
  organizationStore.show(route.params.organization)
})
</script>
