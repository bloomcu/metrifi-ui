<template>
  <LayoutDefault v-if="funnel"  width="full" class="min-h-screen flex flex-col">
    <header class="border-b p-3 flex items-center justify-between">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <AppButton :to="{name: 'funnels'}" variant="tertiary" size="base">
          <ArrowLeftIcon class="h-5 w-5 shrink-0" />
        </AppButton>

        <AppInput v-model="funnel.name"/>

        <div class="flex items-center text-sm">
          <svg class="w-4 h-4 mr-2" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
          {{ funnel.connection.name }}
        </div>
      </div>

      <div class="flex items-center gap-3">
        <!-- Datepicker -->
        <DatePicker @changed="runReport()"/>

        <!-- Zoom -->
        <AppSelect 
          v-model="zoom" 
          :options="[
            {label: 'No zoom', value: 0},
            {label: 'Zoom: Low', value: 40},
            {label: 'Zoom: Middle', value: 80},
            {label: 'Zoom: High', value: 120},
          ]"
        />

        <AppButton @click="updateFunnel()" :loading="saving" variant="secondary">Save Funnel</AppButton>
        <AppButton @click="runReport()">Run Report</AppButton>
      </div>
    </header>

    <div class="flex-1 flex flex-col sm:flex-row">

      <!-- Left: Funnel steps -->
      <nav class="w-[25rem] border-r">
        <!-- Header -->
        <div class="flex items-center justify-between border-b p-3">
          <p>Steps</p>
          <button @click.stop="addStep()" type="button" class="group inline-flex items-center rounded-md p-1 text-white bg-indigo-600 hover:bg-indigo-500 active:translate-y-px">
            <PlusIcon class="h-5 w-5 shrink-0" />
          </button>
        </div>

        <!-- Steps -->
        <div v-if="funnel.steps.length" class="p-3">
          <VueDraggableNext 
            :list="funnel.steps" 
            :animation="150"
            class="flex flex-col gap-3"
          >
            <div v-for="(step, index) in funnel.steps" @click="activeStepId = step.id" class="group flex items-center justify-between rounded-lg px-2 py-3 text-sm leading-6 font-medium cursor-pointer border border-gray-200 text-gray-700 bg-white hover:text-indigo-600 hover:bg-gray-50">
              <div class="flex items-center gap-x-2">
                <Bars2Icon class="h-4 w-4 shrink-0 cursor-grab text-gray-400 group-hover:text-indigo-600" />
                <span class="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">{{ index + 1 }}</span>
                <p>{{ step.name }}</p>
              </div>
              
              <button @click.stop="destroyStep(index, step.id)" class="mr-1 p-1 rounded-md invisible text-gray-400 hover:text-red-500 hover:bg-red-100 group-hover:visible active:translate-y-px">
                <XMarkIcon class="h-5 w-5 shrink-0" />
              </button>
            </div>
          </VueDraggableNext>
        </div>
        
        <!-- Empty state -->
        <div v-else class="py-12 text-center">
          <QueueListIcon class="mx-auto mb-2 h-6 w-6 text-indigo-600" aria-hidden="true" />
          <p class="mb-3 text-md font-medium text-gray-900">No steps</p>
          <AppButton @click="addStep()" :loading="saving" variant="secondary">Add Step</AppButton>
        </div>
      </nav>

      <!-- Center: Active Step -->
      <aside v-if="activeStep" class="w-[25rem] border-r">
        <!-- Header -->
        <div class="flex items-center justify-between border-b p-3">
          <p>{{ activeStep.name }}</p>  
          <button @click="activeStepId = null" type="button" class="group inline-flex items-center rounded-md p-1 bg-gray-100 hover:bg-gray-150 active:translate-y-px">
            <ChevronLeftIcon class="h-5 w-5 shrink-0 text-gray-400 group-hover:text-indigo-600" />
          </button>
        </div>

        <!-- Options -->
        <div class="flex flex-col gap-4 p-3">
          <AppSelect 
            v-model="activeStep.metric" 
            label="Metric"
            :options="[
              {label: 'Page views', value: 'pageViews'},
              {label: 'Outbound link clicks', value: 'outboundLinkClick'},
              {label: 'Element clicks', value: 'elementClick'},
              {label: 'Form submissions', value: 'formSubmission'},
            ]"
          />

          <AppInput v-model="activeStep.name" label="Step name" placeholder="Enter a step name..." />

          <div>
            <p class="block mb-1 text-sm font-medium text-gray-900">Measurables</p>
            <AppInput v-model="activeStep.measurables[0]" placeholder="Enter a page path..." class="mb-2"/>
            <AppInput v-model="activeStep.measurables[1]" placeholder="Enter a page path..." class="mb-2"/>
            <AppInput v-model="activeStep.measurables[3]" placeholder="Enter a page path..." class="mb-2"/>
          </div>
          <!-- <pre>{{ activeStep }}</pre> -->
        </div>
      </aside>

      <!-- Right: Chart -->
      <div v-if="!loading" class="mx-auto w-full max-w-6xl overflow-hidden p-10">
        <Chart 
          :metric="metric" 
          :zoom="zoom"
          :labels="funnel.steps.map(step => step.name)"
          :data="funnel.steps.map(step => Number(step.total))"
        />
        <!-- <pre>{{ funnel }}</pre> -->
      </div>
    </div>

    <!-- TODO: Add loading state -->
  </LayoutDefault>
</template>
  
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useDateRange } from '@/app/composables/useDateRange'
import { useRoute } from 'vue-router'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { Bars2Icon, QueueListIcon } from '@heroicons/vue/24/outline'
import { ArrowLeftIcon, PlusIcon, XMarkIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import AppInlineEditor from '@/app/components/base/forms/AppInlineEditor.vue'
import DatePicker from '@/app/components/datepicker/DatePicker.vue'
import Chart from '@/views/funnels/components/chart/Chart.vue'

const { selectedDateRange } = useDateRange()
const route = useRoute()

const loading = ref(true)
const saving = ref(false)

const funnel = ref()

const activeStepId = ref()
const activeStep = computed(() => funnel.value.steps.find(step => step.id === activeStepId.value))

// const activeStepIndex = ref()
// const activeStep = computed(() => funnel.value.steps[activeStepIndex.value])

const metric = 'Page views'
const zoom = ref(0);

function addStep() {
  console.log('Adding step...')

  funnelApi.storeStep(route.params.organization, route.params.funnel, {
    metric: 'pageViews',
    name: 'New step',
    description: null,
  }).then(response => {
    let step = response.data.data
    funnel.value.steps.push(step)
    activeStepId.value = step.id
  })
}

function updateStep(step) {
  console.log('Updating step...')

  funnelApi.updateStep(route.params.organization, route.params.funnel, step.id, {
    metric: step.metric,
    name: step.name,
    description: step.description,
    measurables: step.measurables,
  })
}

function updateFunnel() {
  console.log('Updating funnel...')
  saving.value = true

  // Update the funnel
  funnelApi.update(route.params.organization, route.params.funnel, {
    name: funnel.value.name,
    description: funnel.value.description,
  })

  // Update funnel steps
  funnel.value.steps.forEach((step) => {
    updateStep(step)
  })

  setTimeout(() => saving.value = false, 2000);
}

function destroyStep(index, id) {
  console.log('Destroying step...')

  funnelApi.destroyStep(route.params.organization, route.params.funnel, id)
    .then(() => {
      funnel.value.steps.splice(index, 1)
    })
}

function runReport() {
  console.log('Running report...')

  loading.value = true

  funnel.value.steps.forEach((step) => {
     // TODO: This can be removed if we validate runReport to only run if there are measurables in each step
    if (!step.measurables.length) { 
      step.total = '0'
      return
    }

    gaDataApi.fetchPageViews(1, {
      startDate: selectedDateRange.value.startDate,
      endDate: selectedDateRange.value.endDate,
      pagePaths: step.measurables,
    }).then(response => {
      if (response.data.data.error) {
        console.log(response.data.data.error)
        return
      }
      let report = response.data.data
      step.total = report.totals[0].metricValues ? report.totals[0].metricValues[0].value : '0'
    })
  })

  loading.value = false
}

watch(selectedDateRange, () => {
  console.log('Date range changed...')
  runReport()
})

onMounted(() => {
  funnelApi.show(route.params.organization, route.params.funnel).then(response => {
    funnel.value = response.data.data
    runReport()
  })
})

// const funnel = ref({
//   id: 1,
//   user: {
//     id: 1,
//     name: 'Ryan Harmon',
//     email: 'john@doe.com',
//     role: 'admin',
//     created_at: '2024-01-23T23:47:12.000000Z'
//   },
//   connection: null,
//   name: 'New funnel',
//   description: 'This is the funnel descriptions',
//   steps: [
//     // {
//     //   id: 1,
//     //   order: 1,
//     //   metric: 'pageViews',
//     //   name: 'Homepage',
//     //   description: null,
//     //   measurables: [
//     //     '/',
//     //   ],
//     //   total: '0'
//     // },
//     {
//       id: 2,
//       order: 2,
//       metric: 'pageViews',
//       name: 'Loans',
//       description: null,
//       measurables: [
//         '/personal/loans/',
//       ],
//       total: '0'
//     },
//     {
//       id: 3,
//       order: 3,
//       metric: 'pageViews',
//       name: 'Auto Loan',
//       description: null,
//       measurables: [
//         '/personal/loans/vehicle/auto-loans/',
//       ],
//       total: '0'
//     },
//     // {
//     //   id: 4,
//     //   order: 4,
//     //   metric: 'pageViews',
//     //   name: 'Application',
//     //   description: null,
//     //   measurables: [
//     //     '/personal/loans/vehicle/auto-loans/application/'
//     //   ],
//     //   total: '0'
//     // },
//   ]
// })
</script>

<style lang="scss">
.draggable-ghost {
  border-radius: 10px;
  // height: 52px;
  
  * { 
    visibility: hidden; 
  }
}

.draggable-drag { 
  opacity: 0.5;
}
</style>
