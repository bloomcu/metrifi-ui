<template>
  <LayoutDefault v-if="dashboard" width="full" class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="border-b p-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <AppButton :to="{name: 'dashboards'}" variant="tertiary" size="sm">
          <ArrowLeftIcon class="h-5 w-5 shrink-0" />
        </AppButton>

        <!-- Dashboard name -->
        <AppInput v-model="dashboard.name" @update:modelValue="updateDashboard"/>

        <!-- Loading/Updating/Reporting indicator -->
        <svg v-if="isLoading || isReporting || isUpdating" class="inline w-6 h-6 ml-2 text-violet-500 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
      </div>

      <div class="flex items-center gap-3">
        <!-- Datepicker -->
        <DatePicker/>

        <!-- Zoom -->
        <!-- <Zoom v-model="dashboard.zoom" @update:modelValue="updateDashboard"/> -->
      </div>
    </header>

    <!-- Funnels -->
    <div class="flex-1 flex flex-col sm:flex-row">
      <!-- Left: Funnels -->
      <nav class="min-w-[24rem] max-w-[24rem] border-r p-4">
        <VueDraggableNext 
          :list="funnels" 
          :animation="150"
          @change="handleDragEvent($event)"
          class="flex flex-col gap-3"
        >
          <div 
            v-for="(funnel, index) in funnels" 
            class="group flex items-center justify-between rounded-lg px-2 py-3 text-sm leading-6 font-medium cursor-pointer border shadow text-gray-700 hover:text-violet-600"
          >
            <div class="flex items-center gap-x-2">
              <Bars2Icon class="h-4 w-4 shrink-0 cursor-grab text-gray-400 group-hover:text-violet-600" />
              <!-- <span class="inline-flex items-center rounded-md bg-violet-100 px-2 py-1 text-xs font-medium text-violet-500">{{ index + 1 }}</span> -->
              <p>{{ funnel.name }}</p>
              <p>{{ funnel.organization.title }}</p>
            </div>
            
            <button @click.stop="detachFunnel(index, funnel.id)" class="mr-1 p-1 rounded-md invisible text-gray-400 hover:text-pink-500 hover:bg-pink-100 group-hover:visible active:translate-y-px">
              <TrashIcon class="h-5 w-5 shrink-0" />
            </button>
          </div>
        </VueDraggableNext>

        <div @click="toggleModal()" class="flex items-center justify-center border border-violet-400 border-dashed rounded-lg mt-4 py-3 px-2 cursor-pointer hover:bg-violet-50">
          <p class="text-sm text-violet-500">Add a funnel</p>
        </div>
      </nav>

      <!-- Right: Chart -->
      <div class="mx-auto w-full _max-w-6xl overflow-hidden px-10 py-4">
        <!-- <AGChart/> -->
        <!-- <ChartJs/> -->
        <ApexChart :categories="categories" :series="series"/>
        <pre>{{ series }}</pre>
        <!-- <pre>{{ funnels[0].steps }}</pre> -->
      </div>

      <!-- <div class="p-6 border border-gray-200 rounded-xl shadow-lg bg-white">
        <div class="flex items-center justify-between mb-6">
          <p class="text-xl font-medium leading-6 text-gray-900 tracking-tight">{{ funnels[0].name }}</p>
          <p class="text-gray-400">Organization: {{ funnels[0].organization.title }}</p>
        </div>
        <Chart 
          :report="funnels[0].report" 
          :conversion_value="funnels[0].conversion_value"
          :startDate="selectedDateRange.startDate" 
          :endDate="selectedDateRange.endDate" 
          :updating="isReportLoading"
          @stepSelected="handleStepSelected"
        />
      </div>

      <div class="p-6 border border-gray-200 rounded-xl shadow-lg bg-white">
        <div class="flex items-center justify-between mb-6">
          <p class="text-xl font-medium leading-6 text-gray-900 tracking-tight">{{ funnels[1].name }}</p>
          <p class="text-gray-400">Organization: {{ funnels[1].organization.title }}</p>
        </div>
        <Chart 
          :report="funnels[1].report" 
          :conversion_value="funnels[1].conversion_value"
          :startDate="selectedDateRange.startDate" 
          :endDate="selectedDateRange.endDate" 
          :updating="isReportLoading"
          @stepSelected="handleStepSelected"
        />
      </div> -->

      <!-- <pre>{{ funnels[0].report }}</pre> -->
      <!-- <pre>{{ funnels[1].report }}</pre> -->
      
      
    </div>

    <AddFunnelModal :open="isModalOpen" @attachFunnels="attachFunnels"/>

    <StepDetailsTray/>
  </LayoutDefault>
</template>

<script setup>
import debounce from 'lodash.debounce'
import { ref, onMounted, computed, watch, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// import { useFunnels } from '@/domain/funnels/composables/useFunnels'
import { useStepDetailsTray } from '@/domain/funnels/components/step-details/useStepDetailsTray'
import { dashboardApi } from '@/domain/dashboards/api/dashboardApi.js'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { Bars2Icon, TrashIcon } from '@heroicons/vue/24/outline'
import { ArrowLeftIcon } from '@heroicons/vue/24/solid'
import { VueDraggableNext } from 'vue-draggable-next'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import AddFunnelModal from '@/views/dashboards/modals/AddFunnelModal.vue'
import StepDetailsTray from '@/domain/funnels/components/step-details/StepDetailsTray.vue'
import DatePicker from '@/app/components/datepicker/DatePicker.vue'
// import Zoom from '@/views/funnels/components/zoom/Zoom.vue'
import Chart from '@/views/funnels/components/chart/Chart.vue'
// import AGChart from '@/views/funnels/components/chart-libraries/AGChart.vue'
// import ApexChart from '@/views/funnels/components/chart-libraries/ApexChart.vue'
// import ChartJs from '@/views/funnels/components/chart-libraries/ChartJs.vue'

const router = useRouter()
const route = useRoute()

// const { funnels, addFunnel, addFunnelJob, isReportLoading } = useFunnels()
const { selectStep, openTray } = useStepDetailsTray()
const { selectedDateRange } = useDatePicker()

function convertPercentageToNumber(percentageString) {
  // Remove the '%' character and convert the remaining string to a float
  const number = parseFloat(percentageString.replace('%', ''));
  // Divide by 100 to get the decimal equivalent of the percentage
  return number / 100;
}

const categories = ['Step 1', 'Step 2', 'Step 3']

const series = computed(() => {
  return funnels.value.map(funnel => {
    return {
      name: funnel.name,
      data: funnel.steps.map(step => {
        return step.users
        // return convertPercentageToNumber(step.conversionRate)
      })
    }
  })
})

const dashboard = ref()
// const zoom = ref(0)
const isLoading = ref(false)
const isUpdating = ref(false)
const isReporting = ref(false)
const isModalOpen = ref(false)
const isStepDetailsTrayOpen = ref(false)

const funnelsAlreadyAttachedIds = computed(() => {
  return funnels.value.map(funnel => funnel.id)
})

provide('isModalOpen', isModalOpen)
provide('funnelsAlreadyAttachedIds', funnelsAlreadyAttachedIds)

function handleStepSelected(step) {
  selectStep(step)
  openTray()
}

const updateDashboard = debounce(() => {
  console.log('Updating dashboard...')
  isUpdating.value = true

  dashboardApi.update(route.params.organization, route.params.dashboard, {
    name: dashboard.value.name,
    description: dashboard.value.description,
    // zoom: dashboard.value.zoom,
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
  ).then(() => {
    // loadDashboard()
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
    })
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
