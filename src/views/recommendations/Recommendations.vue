<template>
  <LayoutWithSidebar>
    <template #overlay>
      <!-- Force GA connection first -->
      <div v-if="organizationStore.organization && organizationStore.organization.connections_count == 0" class="fixed h-full w-full items-center bg-white bg-opacity-60 backdrop-blur-sm flex justify-center z-[9999]">
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
          <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Recommendations</h1>
          <div class="flex gap-2">
            <AppButton @click="showGenerateRecommendationModal = true">
              Generate recommendation
            </AppButton>
          </div>
        </div>
    </template>

    <!-- List recommendations -->
    <div v-if="recommendationStore.recommendations.length" class="flex flex-col gap-4 mb-20">
      <div
        v-for="recommendation in recommendationStore.recommendations" 
        @click="recommendation.status === 'draft' ? router.push({ name: 'recommendationEdit', params: { recommendation: recommendation.id }}) : router.push({ name: 'recommendation', params: { recommendation: recommendation.id }})"
        class="group relative flex flex-col cursor-pointer overflow-hidden rounded-lg shadow-sm border bg-white hover:shadow-md"
      >
        <div class="flex flex-col space-y-4 w-full px-4 py-4">
          <!-- Card header -->
          <div class="flex items-start justify-between border-b pb-4">
            <div>
                <h3 class="text-xl font-medium text-gray-900">{{ recommendation.title }}</h3>
                <p v-if="recommendation.step_index !== null" class="text-sm text-gray-700">For step {{ recommendation.step_index + 1 }}</p>
            </div>
            
            <div class="flex items-center gap-2">
                <!-- Versions -->
                <!-- <span class="text-sm text-gray-500 border-r border-gray-300 pr-3">6 versions</span> -->
              
                <!-- Copy -->
                <button @click.stop="replicateRecommendation(recommendation)" class="cursor-pointer font-medium rounded-md p-1.5 text-sm text-gray-400 bg-white hover:bg-gray-200 ring-1 ring-inset ring-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
                    </svg>
                </button>

                <!-- Delete -->
                <!-- TODO: Enable this -->
                <!-- <button @click.stop="destroyDashboard(dashboard.id)" class="cursor-pointer font-medium rounded-md p-1.5 text-sm text-gray-400 bg-white hover:bg-gray-200 ring-1 ring-inset ring-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button> -->
            </div>
          </div>

          <div class="flex justify-between text-gray-500 text-sm">
                <div class="flex items-center gap-4">
                    
                    <!-- Created at date -->
                    <div class="flex items-center gap-1">
                        <ClockIcon class="h-3 w-3 text-gray-400" aria-hidden="true" />
                        <span>{{ moment(recommendation.created_at).format('MMM DD, Y') }}</span>
                    </div>

                    <!-- Owner -->
                    <div class="flex items-center gap-1">
                        <UserIcon class="h-3 w-3 text-gray-400" aria-hidden="true" />
                        <span>{{ recommendation.user.name }}</span>
                    </div>
                </div>
                
                <!-- Status -->
                <!-- TODO: Move this into a component -->
                <span v-if="recommendation.status == 'done'" class="bg-[#99ffcc] py-1 px-2.5 rounded-full text-[#2b0f52] text-xs">Done</span>
                <span v-if="recommendation.status == 'draft'" class="bg-slate-300 py-1 px-2.5 rounded-full text-[#2b0f52] text-xs">Draft</span>
                <span v-if="recommendationStore.isInProgress(recommendation.status)" class="bg-[#FFE666] py-1 px-2.5 rounded-full text-[#2b0f52] text-xs">In progress</span>
                <span v-if="recommendationStore.isFailed(recommendation.status)" class="bg-[#FF6D66] py-1 px-2.5 rounded-full text-[#2b0f52] text-xs">Failed</span>
            </div>
        </div>
      </div>
    </div>

    <!-- State: Loading -->
    <div v-else-if="recommendationStore.isLoading" class="animate-pulse space-y-4">
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

    <!-- Empty state: No recommendations -->
    <div v-else @click="storeNewRecommendation()" class="flex flex-col items-center justify-center border border-violet-400 border-dashed rounded-lg py-6 px-2 cursor-pointer hover:bg-violet-50">
      <Squares2X2Icon class="mx-auto h-10 w-10 text-violet-500" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-violet-500">Create a recommendation</h2>
    </div>

    <!-- Generate recommendation -->
    <AppModal 
        size="2xl"
        :open="showGenerateRecommendationModal"
        @closed="showGenerateRecommendationModal = false" 
    >
        <div class="p-6">
            <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Generate recommendation</h3>
            <div class="mt-6 grid grid-cols-2 gap-4">
                <div @click="createFromScratch()" class="flex flex-col items-start justify-start border border-gray-300 rounded-lg p-5 cursor-pointer hover:bg-violet-50 hover:border-violet-400">
                    <PencilSquareIcon class="w-10 h-10 mb-3 text-violet-500" aria-hidden="true" />
                    <p class="text-lg mb-1 font-medium text-gray-900">Start from scratch</p>
                    <p class="text-sm text-gray-500">Give AI instructions to generate a webpage recommendation from scratch.</p>
                </div>
                <RouterLink :to="{name: 'dashboards'}" class="flex flex-col items-start justify-start border border-gray-300 rounded-lg p-5 cursor-pointer hover:bg-violet-50 hover:border-violet-400">
                    <Squares2X2Icon class="w-10 h-10 mb-3 text-violet-500" aria-hidden="true" />
                    <p class="text-lg mb-1 font-medium text-gray-900">Start from a dashboard</p>
                    <p class="text-sm text-gray-500">Select a dashboard and click "Improve" on the funnel step where you want AI to generate a webpage recommendation.</p>
                </RouterLink>
            </div>
        </div>
    </AppModal>
  </LayoutWithSidebar>
</template>

<script setup>
import moment from "moment"
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import { useRecommendationStore } from "@/domain/recommendations/store/useRecommendationStore"
import { useConnections } from '@/domain/connections/composables/useConnections'
import { PencilSquareIcon, Squares2X2Icon } from '@heroicons/vue/24/outline'
import { UserIcon, ClockIcon } from '@heroicons/vue/16/solid'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'

const route = useRoute()
const router = useRouter()

const { connectToGoogle } = useConnections()

const organizationStore = useOrganizationStore()
const recommendationStore = useRecommendationStore()

const showGenerateRecommendationModal = ref(false)

const createFromScratch = () => {
  // Store recommendation
  recommendationStore.store(route.params.organization, {
    title: 'New recommendation',
    dashboard_id: null,
    status: 'draft',
    step_index: null,
    metadata: null
  }).then(() => {
    router.push({ name: 'recommendationEdit', params: { organization: route.params.organization, recommendation: recommendationStore.recommendation.id } })
  })
}

const replicateRecommendation = (recommendation) => {
  recommendationStore.replicate(route.params.organization, recommendation.id).then(() => {
    recommendation.status === 'draft' ?
        router.push({ name: 'recommendationEdit', params: { organization: route.params.organization, recommendation: recommendationStore.recommendation.id } }) :
        router.push({ name: 'recommendation', params: { organization: route.params.organization, recommendation: recommendationStore.recommendation.id } })
  })
}

onMounted(() => {
    recommendationStore.index(route.params.organization)
})
</script>
