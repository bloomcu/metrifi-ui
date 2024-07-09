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
        <AppButton @click="showNotes()" variant="tertiary" size="base" class="flex items-center gap-2">
          <!-- <ChatBubbleBottomCenterIcon class="h-5 w-5 shrink-0" /> -->
          Notes
        </AppButton>

        <!-- Run analysis -->
        <AppButton v-if="!analysisStore.analysis" @click="createAnalysis()" :loading="analysisStore.isLoading" variant="tertiary" size="base" class="flex items-center gap-2">
          <!-- <ChatBubbleBottomCenterIcon class="h-5 w-5 shrink-0" /> -->
          Run analysis
        </AppButton>

        <!-- Zoom -->
        <!-- <Zoom v-model="dashboard.zoom" @update:modelValue="updateDashboard"/> -->
      </div>
    </header>

    <!-- <div class="mb-4">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex" aria-label="Tabs">
          <button @click="showAnalysis()" :class="isShowingAnalysis ? 'border-b-indigo-500 text-indigo-600' : 'border-b-transparent text-gray-500 hover:border-b-gray-300 hover:text-gray-700'" class="w-1/2 border border-b-2 rounded-md px-1 py-4 text-center text-sm font-medium">Analysis</button>
          <button @click="showNotes()" :class="isShowingNotes ? 'border-b-indigo-500 text-indigo-600' : 'border-b-transparent text-gray-500 hover:border-b-gray-300 hover:text-gray-700'" class="w-1/2 border border-b-2 border-r-0 rounded-md px-1 py-4 text-center text-sm font-medium">Notes</button>
        </nav>
      </div>
    </div> -->

    <!-- Notes -->
    <div v-if="isShowingNotes" class="mb-4">
      <div v-if="isEditingNotes" class="p-6 border-2 border-gray-200 rounded-2xl bg-gray-50">
        <AppRichtext v-model="dashboard.notes" class="mb-2"/>
        <div class="flex items-center gap-2">
          <AppButton @click="updateDashboard()">Update notes</AppButton>
          <AppButton @click="isEditingNotes = false" variant="tertiary">Cancel</AppButton>
        </div>
      </div>

      <div v-else class="relative p-6 border-2 border-gray-200 rounded-2xl bg-white">
        <AppButton @click="isEditingNotes = true" variant="link" class="flex items-center gap-2 absolute right-6 top-3">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          Edit notes
        </AppButton>
        <div v-html="dashboard.notes" class="prose prose-h2:mb-2 prose-h3:mb-1.5 prose-p:my-1 py-2 px-4"></div>
      </div>
    </div>

    <!-- Analysis -->
    <div v-if="analysisStore.analysis && isShowingAnalysis" class="mb-4">
      <div v-if="isEditingAnalysis" class="p-6 border-2 border-gray-200 rounded-2xl bg-gray-50">
        <AppRichtext v-model="analysisStore.analysis.content" class="mb-2"/>
        <div class="flex items-center gap-2">
          <AppButton @click="updateAnalysis()">Update analysis</AppButton>
          <AppButton @click="isEditingAnalysis = false" variant="tertiary">Cancel</AppButton>
        </div>
      </div>

      <div v-else class="relative p-6 border-2 border-gray-200 rounded-2xl bg-white">
        <p class="text-xl font-medium leading-6 text-gray-900 tracking-tight">Analysis</p>

        <div class="absolute right-6 top-3 flex items-center gap-2">
          <!-- Edit analysis -->
          <!-- <AppButton @click="isEditingAnalysis = true" variant="link" class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Edit analysis
          </AppButton> -->

          <!-- Re-run analysis -->
          <AppButton @click="reRunAnalysis()" variant="link" class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Re-run analysis
          </AppButton>

          <!-- Close analysis -->
          <AppButton @click="showAnalysis()" variant="link" class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            Close analysis
          </AppButton>
        </div>
        
        <p v-if="analysisStore.isLoading" class="flex items-center gap-2 text-base font-semibold leading-6 text-gray-900">
          <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
          </svg>
          Loading analysis
        </p>

        <div v-if="analysisStore.analysis" v-html="analysisStore.analysis.content" class="prose prose-h2:mb-2 prose-h3:mb-1.5 prose-p:my-1 py-2"></div>

        <div class="border-t pt-4 text-sm text-gray-400">
          Analysis created {{ moment(analysisStore.analysis.created_at).fromNow() }}
        </div>
      </div>
    </div>

    <div v-if="analysisStore.analysis && !isShowingAnalysis" @click="showAnalysis()" class="mb-4 px-6 py-4 border-2 border-gray-200 rounded-2xl bg-white cursor-pointer hover:bg-gray-50">
      <p class="text-xl font-medium leading-6 text-gray-900 tracking-tight">
        Show analysis
        <span class="text-gray-400 text-sm font-normal">(Created on {{ moment(analysisStore.analysis.created_at).fromNow() }})</span>
      </p>
    </div>

    <!-- Funnels -->
    <!-- <div class="grid grid-cols-1 gap-y-2 xl:grid-cols-2 xl:gap-x-4 xl:gap-y-4"> -->
    <VueDraggableNext 
      :list="funnels" 
      :animation="150"
      @change="handleDragEvent($event)"
      class="grid grid-cols-1 gap-y-2 xl:grid-cols-2 xl:gap-x-4 xl:gap-y-4"
    >
      <div v-for="(funnel, index) in funnels" class="p-6 border-2 border-gray-200 rounded-2xl bg-white">
        <!-- Funnel and organization name -->
        <div class="flex items-center justify-between">
          <p class="text-xl font-medium leading-6 text-gray-900 tracking-tight">{{ funnel.name }}</p>
          <p v-if="isShowingOrganizations" class="text-gray-400">{{ funnel.organization.title }}</p>
        </div>

        <!-- Chart -->
        <Chart 
          :report="funnel.report" 
          :conversion_value="funnel.conversion_value"
          :startDate="selectedDateRange.startDate" 
          :endDate="selectedDateRange.endDate" 
          :updating="isReportLoading"
          @stepSelected="handleStepSelected"
        />

        <!-- <AppButton @click="duplicateFunnel(funnel)" variant="tertiary" class="mt-2 mr-2 text-xs">Duplicate</AppButton> -->
        <AppButton @click="detachFunnel(index, funnel.id)" variant="secondary" class="mt-4 mr-2 text-xs">Remove</AppButton>
        <AppButton 
          v-if="authStore.user.role === 'admin' || authStore.user.organization.slug === funnel.organization.slug"
          @click="openFunnel(funnel)" 
          variant="secondary" 
          class="mt-2 text-xs"
        >
          Edit
        </AppButton>
      </div>

      <div @click="toggleModal()" class="flex items-center justify-center border border-indigo-400 border-dashed rounded-2xl py-8 px-2 cursor-pointer hover:bg-indigo-50">
        <h2 class="text-lg font-medium text-indigo-600">Add a funnel</h2>
      </div>
    </VueDraggableNext>
    <!-- </div> -->

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
import { useFunnels } from '@/domain/funnels/composables/useFunnels'
import { useStepDetailsTray } from '@/domain/funnels/components/step-details/useStepDetailsTray'

import { dashboardApi } from '@/domain/dashboards/api/dashboardApi.js'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { ChatBubbleBottomCenterIcon } from '@heroicons/vue/24/outline'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
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

const { funnels, addFunnel, addFunnelJob, isReportLoading } = useFunnels()
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

const funnelsAlreadyAttachedIds = computed(() => {
  return funnels.value.map(funnel => funnel.id)
})

provide('isModalOpen', isModalOpen)
provide('isShowingOrganizations', isShowingOrganizations)
provide('funnelsAlreadyAttachedIds', funnelsAlreadyAttachedIds)

function handleDragEvent(e) {
  isUpdating.value = true
  let event = e.moved || e.added
  console.log("Funnel Id: ", event.element.id)
  console.log("Order: ", event.newIndex + 1)

  dashboardApi.reorderFunnel(route.params.organization, route.params.dashboard, {
    funnel_id: event.element.id,
    order: event.newIndex + 1
  }).then((response) => {
    console.log(response)
    setTimeout(() => isUpdating.value = false, 500)
  })
}

function showNotes() {
  isShowingNotes.value = !isShowingNotes.value
  isShowingAnalysis.value = false
}

function showAnalysis() {
  isShowingAnalysis.value = !isShowingAnalysis.value
  isShowingNotes.value = false
}

function handleStepSelected(step) {
  selectStep(step)
  openTray()
}

function createAnalysis() {
  analysisStore.store(route.params.organization, route.params.dashboard, {
    subjectFunnelId: dashboard.value.funnels[0].id,
  }).then(() => {
    showAnalysis()
  })
}

function reRunAnalysis() {
  analysisStore.analysis.content = ''

  analysisStore.store(route.params.organization, route.params.dashboard, {
    subjectFunnelId: dashboard.value.funnels[0].id,
  })
}

const updateDashboard = debounce(() => {
  console.log('Updating dashboard...')
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
  console.log('Attaching funnel...')
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
  console.log('Detaching funnel...')
  isUpdating.value = true

  dashboardApi.detachFunnel(
    route.params.organization, 
    route.params.dashboard, 
    funnelId,
  ).then(() => {
    funnels.value.splice(index, 1)
    isUpdating.value = false
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

// function runReport() {
//   console.log('Running report...')
// }

function loadDashboard() {
  console.log('Loading dashboard...')
  
  dashboardApi.show(route.params.organization, route.params.dashboard)
    .then(response => {
      dashboard.value = response.data.data

      dashboard.value.funnels.forEach(funnel => {
        addFunnel(funnel)
      })

      if (dashboard.value.latest_analysis) {
        analysisStore.show(route.params.organization, route.params.dashboard, dashboard.value.latest_analysis.id)
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
  console.log('Date range has changed...')

  dashboard.value.funnels.forEach(funnel => {
    addFunnelJob(funnel)
  })
})

onMounted(() => {
  loadDashboard()
})
</script>
