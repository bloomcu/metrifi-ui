<template>
  <LayoutDefault v-if="dashboard" width="lg" class="min-h-screen flex flex-col px-4">
    <!-- <pre>
      Pending: {{ pending.length }}
      Completed: {{ completed.length }}
    </pre> -->
    
    <!-- Header -->
    <header class="pt-3 pb-4 flex items-center justify-between">
      <div class="flex items-center gap-3 grow">
        <AppButton :to="{name: 'dashboards'}" variant="tertiary" size="base">
          <ArrowLeftIcon class="h-5 w-5 shrink-0" />
        </AppButton>

        <!-- Dashboard name -->
        <AppInput v-model="dashboard.name" @update:modelValue="updateDashboard" class="w-7/12"/>
        <!-- <p class="text-base font-semibold leading-6 text-gray-900">{{ dashboard.name  }}</p> -->

        <!-- Loading/Updating/Reporting indicator -->
        <svg v-if="isLoading || isReporting || isUpdating" class="inline w-6 h-6 ml-2 text-indigo-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
      </div>

      <div class="flex items-center gap-3">
        <!-- Show/hide organizations -->
        <div v-if="authStore.user.role === 'admin'" class="flex items-center py-2 mr-1">
          <input v-model="isShowingOrganizations" required id="agree" name="agree" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
          <label for="agree" class="ml-2 block text-sm font-medium leading-6 text-gray-900">
            Show organizations
          </label>
        </div>
        
        <!-- Datepicker -->
        <DatePicker class="w-[400px]"/>

        <!-- Show notes -->
        <AppButton @click="toggleNotes()" variant="tertiary" size="base" class="flex items-center gap-2">
          Notes
        </AppButton>

        <!-- Run analysis -->
        <AppButton @click="storeAnalysis()" :loading="analysisStore.isLoading" variant="tertiary" size="base" class="flex items-center gap-2">
          Run analysis
        </AppButton>

        <AppButton v-if="dashboard.recommendation" @click="router.push({name: 'recommendation', params:{ recommendation: dashboard.recommendation.id }})" variant="tertiary" size="base" class="flex items-center gap-2">
          View recommendation
        </AppButton>

        <AppButton v-if="!dashboard.recommendation" @click="generateRecommendation()" variant="tertiary" size="base" class="flex items-center gap-2">
          Generate recommendation
        </AppButton>

        <!-- Zoom -->
        <!-- <Zoom v-model="dashboard.zoom" @update:modelValue="updateDashboard"/> -->
      </div>
    </header>

    <!-- Notes -->
    <div v-if="isShowingNotes" class="mb-4">
      <div v-if="isEditingNotes" class="p-6 border-2 border-gray-200 rounded-xl bg-gray-50">
        <AppRichtext v-model="dashboard.notes" class="mb-2"/>
        <div class="flex items-center gap-2">
          <AppButton @click="updateDashboard()">Update notes</AppButton>
          <AppButton @click="isEditingNotes = false" variant="tertiary">Cancel</AppButton>
        </div>
      </div>

      <div v-else class="relative p-6 border-2 border-gray-200 rounded-xl bg-white">
        <AppButton @click="isEditingNotes = true" variant="link" class="flex items-center gap-2 absolute right-6 top-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          Edit notes
        </AppButton>
        <div v-html="dashboard.notes" class="prose prose-h2:mb-2 prose-h3:mb-1.5 prose-p:my-1 py-2 px-4"></div>
      </div>
    </div>

    <!-- Analysis issue -->
    <AnalysisIssue v-if="dashboard.issue" :issue="dashboard.issue" class="py-2"/>

    <!-- Analysis -->
    <div v-else-if="dashboard[activeAnalysisType] && !isShowingAnalysis" @click="showAnalysis()" class="flex items-center gap-2 mb-4 px-6 py-4 border-2 border-gray-200 rounded-xl bg-white cursor-pointer hover:bg-gray-50">
      <p class="text-xl font-medium leading-6 text-gray-900 tracking-tight">Show analysis</p>
      <span class="text-gray-400 text-sm font-normal">Created on {{ moment(dashboard[activeAnalysisType].created_at).fromNow() }}</span>
    </div>

    <div v-else-if="dashboard[activeAnalysisType] && isShowingAnalysis" class="mb-4">
      <div v-if="!isEditingAnalysis" class="relative p-6 border-2 border-gray-200 rounded-xl bg-white">
        <p class="flex items-center text-xl font-medium leading-6 text-gray-900 tracking-tight">
          <span class="mr-3">Analysis</span>
        </p>

        <div class="absolute right-4 top-3 flex items-center">
          <!-- Re-run analysis -->
          <AppButton @click="storeAnalysis()" variant="link" class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
            Rerun analysis
          </AppButton>

          <!-- Close analysis -->
          <AppButton @click="closeAnalysis()" variant="link" class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Close
          </AppButton>
        </div>
        
        <p v-if="analysisStore.isLoading" class="py-4 flex items-center gap-3 text-base font-semibold leading-6 text-gray-900">
          <svg aria-hidden="true" role="status" class="inline w-4 h-4 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
          </svg>
          Loading analysis
        </p>

        <div v-if="!analysisStore.isLoading && dashboard[activeAnalysisType]">
          <!-- Tabs -->
          <nav class="flex justify-between border-b mb-6">
            <div class="flex space-x-6">
              <button @click="activeAnalysisType = 'median_analysis'" :class="[activeAnalysisType == 'median_analysis' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-5 pb-3 text-sm font-medium']">Average</button>
              <button @click="activeAnalysisType = 'max_analysis'" :class="[activeAnalysisType == 'max_analysis' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700', 'flex items-center whitespace-nowrap border-b-2 pt-5 pb-3 text-sm font-medium']">Maximum</button>
            </div>
          </nav>

          <!-- The analysis -->
          <AnalysisExcerpt :analysis="dashboard[activeAnalysisType]" class="pt-2"/>

          <!-- Toggle reference -->
          <button @click="isShowingReference = !isShowingReference" variant="link" class="py-2 mb-2 text-sm font-medium text-gray-500 hover:text-gray-600">
            Toggle reference
          </button>

          <!-- Reference -->
          <div v-if="isShowingReference" v-html="dashboard[activeAnalysisType].reference" class="prose prose-h2:mb-2 prose-h3:mb-1.5 prose-h3:underline prose-p:my-1 text-sm px-4 py-2 bg-gray-50 border rounded-lg mb-3"></div>
        </div>

        <div class="divide-x divide-gray-300 border-t pt-4 text-sm text-gray-400">
          <span class="pr-2">Analysis created {{ moment(dashboard[activeAnalysisType].created_at).fromNow() }}</span> 
          <span class="pl-2">28 day period {{ moment(dashboard[activeAnalysisType].start_date).format('MMM DD, Y') }} - {{ moment(dashboard[activeAnalysisType].end_date).format('MMM DD, Y') }}</span>
        </div>
      </div>
    </div>

    <!-- Funnels -->
    <VueDraggableNext 
      :list="funnelStore.funnels"
      :animation="150"
      @change="reorderFunnel($event)"
      class="grid grid-cols-1 gap-y-2 xl:grid-cols-2 xl:gap-x-4 xl:gap-y-4"
    >
      <div v-for="(funnel, index) in funnelStore.funnels" class="p-6 border-2 border-gray-200 rounded-xl bg-white">
        <!-- Funnel and organization name -->
        <div class="flex items-center justify-between">
          <p class="text-xl font-medium leading-6 text-gray-900 tracking-tight">{{ funnel.name }}</p>
          <p v-if="isShowingOrganizations" class="text-gray-400">{{ funnel.organization.title }}</p>
        </div>

        <!-- Chart -->
        <Chart 
          :funnel="funnel" 
          :conversion_value="funnel.conversion_value"
          :startDate="selectedDateRange.startDate" 
          :endDate="selectedDateRange.endDate" 
          :updating="funnelStore.isLoading"
          :enableControls="true"
          :enableStepExpansion="authStore.user.role === 'admin'"
          @stepDisabled="disableFunnelStep"
          @stepExpanded="expandFunnelStep"
        />

        <!-- <AppButton @click="duplicateFunnel(funnel)" variant="tertiary" class="mt-2 mr-2 text-xs">Duplicate</AppButton> -->

        <AppButton @click="detachFunnel(index, funnel.id)" variant="secondary" class="mt-4 mr-2 text-xs">Remove</AppButton>

        <AppButton 
          v-if="authStore.user.role === 'admin' || authStore.user.organization.slug === funnel.organization.slug"
          @click="openFunnel(funnel)" 
          variant="secondary" 
          class="mt-4 mr-2 text-xs"
        >
          Edit
        </AppButton>

        <AppButton v-if="funnel.pivot.disabled_steps.length" @click="enableFunnelSteps(funnel)" variant="secondary" class="mt-4 text-xs">Enable steps ({{ funnel.pivot.disabled_steps.length }})</AppButton>
      </div>

      <div @click="toggleModal()" class="flex items-center justify-center border border-indigo-400 border-dashed rounded-xl py-8 px-2 cursor-pointer hover:bg-indigo-50">
        <h2 class="text-lg font-medium text-indigo-600">Add a funnel</h2>
      </div>
    </VueDraggableNext>

    <AddFunnelModal :open="isModalOpen" @attachFunnels="attachFunnels"/>

    <StepDetailsTray v-if="authStore.user.role === 'admin'"/>
  </LayoutDefault>
</template>

<script setup>
import moment from "moment"
import debounce from 'lodash.debounce'
import { VueDraggableNext } from 'vue-draggable-next'
import { ref, onMounted, computed, watch, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import { useAnalysisStore } from '@/domain/analyses/store/useAnalysisStore'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useFunnelStore } from '@/domain/funnels/store/useFunnelStore'
import { useStepDetailsTray } from '@/domain/funnels/components/step-details/useStepDetailsTray'

import { dashboardApi } from '@/domain/dashboards/api/dashboardApi.js'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { ChatBubbleBottomCenterIcon } from '@heroicons/vue/24/outline'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import AnalysisExcerpt from '@/domain/analyses/components/AnalysisExcerpt.vue'
import AnalysisIssue from '@/domain/analyses/components/AnalysisIssue.vue'
import AddFunnelModal from '@/views/dashboards/modals/AddFunnelModal.vue'
import StepDetailsTray from '@/domain/funnels/components/step-details/StepDetailsTray.vue'
import DatePicker from '@/app/components/datepicker/DatePicker.vue'
import AppRichtext from '@/app/components/base/forms/AppRichtext.vue'
// import Zoom from '@/views/funnels/components/zoom/Zoom.vue'
import Chart from '@/views/funnels/components/chart/Chart.vue'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const analysisStore = useAnalysisStore()
const recommendationStore = useRecommendationStore()
const funnelStore = useFunnelStore()

// const { funnels, addFunnel, addFunnelJob, isReportLoading } = useFunnels()
const { selectStep, openTray } = useStepDetailsTray()
const { selectedDateRange } = useDatePicker()

const dashboard = ref()
const isLoading = ref(false)
const isUpdating = ref(false)
const isReporting = ref(false)
const isModalOpen = ref(false)
const isShowingOrganizations = ref(false)
const isShowingNotes = ref(false)
const isEditingNotes = ref(false)
const isShowingAnalysis = ref(false)
const isEditingAnalysis = ref(false)
const isShowingReference = ref(false)

const activeAnalysisType = ref('median_analysis')

const funnelsAlreadyAttachedIds = computed(() => {
  return funnelStore.funnels.map(funnel => funnel.id)
})

provide('isModalOpen', isModalOpen)
provide('isShowingOrganizations', isShowingOrganizations)
provide('funnelsAlreadyAttachedIds', funnelsAlreadyAttachedIds)

function toggleNotes() {
  isShowingNotes.value = !isShowingNotes.value
  isShowingAnalysis.value = false
}

function showAnalysis() {
  isShowingAnalysis.value = true
  isShowingNotes.value = false
}

function closeAnalysis() {
  isShowingAnalysis.value = false
}

function expandFunnelStep(step) {
  selectStep(step)
  openTray()
}

function storeAnalysis() {
  let subjectFunnel = funnelStore.funnels[0]
  let comparisonFunnels = funnelStore.funnels.filter((funnel, index) => index !== 0)

  // console.log(subjectFunnel)

  analysisStore.store(route.params.organization, route.params.dashboard, {
    subjectFunnelId: funnelStore.funnels.length ? funnelStore.funnels[0].id : null,
    subjectFunnel: subjectFunnel,
    comparisonFunnels: comparisonFunnels,
  }).then((response) => {
    // showAnalysis()
    // analysisStore.median_analysis = dashboard.value.median_analysis
    // analysisStore.max_analysis = dashboard.value.max_analysis
    loadDashboard()
  })
}

function generateRecommendation() {
  recommendationStore.store(route.params.organization, route.params.dashboard, {
    title: 'Webpage recommendation',
  }).then(() => {
    router.push({ name: 'recommendation', params: { organization: route.params.organization, dashboard: route.params.dashboard, recommendation: recommendationStore.recommendation.id } })
  })
}

// function reRunAnalysis() {
//   analysisStore.analysis.content = ''

//   storeAnalysis()
// }

// function updateAnalysis() {
//   analysisStore.update(route.params.organization, route.params.dashboard, analysisStore.analysis.id, {
//     content: analysisStore.analysis.content,
//   }).then(() => {
//     isEditingAnalysis.value = false
//   })
// }

const updateDashboard = debounce(() => {
  isUpdating.value = true
  isEditingNotes.value = false

  dashboardApi.update(route.params.organization, route.params.dashboard, {
    name: dashboard.value.name,
    notes: dashboard.value.notes,
  }).then(() => {
    setTimeout(() => isUpdating.value = false, 800);
  })
}, 800)

function attachFunnels(funnelIds) {
  isUpdating.value = true

  dashboardApi.attachFunnels(
    route.params.organization, 
    route.params.dashboard, 
    funnelIds,
  ).then((response) => {
    location.reload()
    isUpdating.value = false
  })
}

function detachFunnel(index, funnelId) {
  isUpdating.value = true

  dashboardApi.detachFunnel(
    route.params.organization, 
    route.params.dashboard, 
    funnelId,
  ).then(() => {
    funnelStore.funnels.splice(index, 1)
    isUpdating.value = false
  })
}

function reorderFunnel(e) {
  isUpdating.value = true
  let event = e.moved || e.added

  dashboardApi.reorderFunnel(route.params.organization, route.params.dashboard, {
    funnel_id: event.element.id,
    order: event.newIndex + 1
  }).then((response) => {
    setTimeout(() => isUpdating.value = false, 500)
  })
}

function disableFunnelStep(funnel, step) {
  // TODO: Do this in the funnel store

  // You can't disable all steps, so check to make sure at least 1 step is always enabled
  if (funnel.pivot.disabled_steps.length === funnel.steps.length - 1) {
    return
  }
  
  // Disable step
  funnel.pivot.disabled_steps.push(step.id)

  // Re-calculate funnel report
  funnelStore.addFunnelJob(funnel)
  
  // Update dashboard funnel pivot
  dashboardApi.toggleFunnelStep(route.params.organization, route.params.dashboard, funnel.id, {
    step_id: step.id,
  }).then((response) => {
    setTimeout(() => isUpdating.value = false, 500)
  })
}

function enableFunnelSteps(funnel) {
  // TODO: Do this in the funnel store

  // Disable step
  funnel.pivot.disabled_steps = []

  // Re-calculate funnel report
  funnelStore.addFunnelJob(funnel)
  
  // Update dashboard funnel pivot
  dashboardApi.enableFunnelSteps(route.params.organization, route.params.dashboard, funnel.id)
    .then((response) => {
      setTimeout(() => isUpdating.value = false, 500)
    })
}

// function duplicateFunnel(duplicatedFunnel) {
//   let id = Math.floor(100000 + Math.random() * 900000)
//   duplicatedFunnel.id = id
//   dashboard.value.funnels.push(duplicatedFunnel)
// }

function toggleModal() { 
  isModalOpen.value = !isModalOpen.value 
}

function loadDashboard() {
  funnelStore.funnels = []
  
  dashboardApi.show(route.params.organization, route.params.dashboard)
    .then(response => {
      dashboard.value = response.data.data

      dashboard.value.funnels.forEach(funnel => {
        funnelStore.addFunnel(funnel)
      })

      if (dashboard.value.median_analysis && dashboard.value.max_analysis) {
        analysisStore.median_analysis = dashboard.value.median_analysis
        analysisStore.max_analysis = dashboard.value.max_analysis
        // analysisStore.show(route.params.organization, route.params.dashboard, dashboard.value.latest_analysis.id)
      } else {
        analysisStore.analysis = null
      }
    })
}

function openFunnel(funnel) {
  const routeData = router.resolve({name: 'funnel', params: {
      organization: funnel.organization.slug,
      funnel: funnel.id,
  }});
  
  window.open(routeData.href, '_blank');
}

watch(selectedDateRange, () => {
  dashboard.value.funnels.forEach(funnel => {
    funnelStore.addFunnelJob(funnel)
  })
})

onMounted(() => {
  loadDashboard()
})
</script>
