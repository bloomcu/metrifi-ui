<template>
  <LayoutDefault v-if="funnel"  width="full" class="min-h-screen flex flex-col">
    <header class="border-b p-3 flex items-center justify-between">
      Header
      <div class="flex items-center gap-3">
        <AppSelect 
          v-model="zoom" 
          :options="[
            {label: 'No zoom', value: 0},
            {label: 'Zoom: Low', value: 40},
            {label: 'Zoom: Middle', value: 80},
            {label: 'Zoom: High', value: 120},
          ]"
        />
        <AppButton @click="runReport()">Run Report</AppButton>
      </div>
    </header>

    <div class="flex-1 flex flex-col sm:flex-row">

      <!-- Left: Funnel steps -->
      <nav class="w-[25rem] border-r">
        <!-- Header -->
        <div class="flex items-center justify-between border-b p-3">
          <p>Funnel steps</p>  
          <button @click="addStep()" type="button" class="group inline-flex items-center rounded-md p-1 text-white bg-indigo-600 hover:bg-indigo-500 active:translate-y-px">
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
            <div v-for="(step, index) in funnel.steps" @click="activeStepIndex = index" class="group flex items-center justify-between rounded-lg px-2 py-3 text-sm leading-6 font-medium cursor-pointer text-gray-700 bg-white border hover:text-indigo-600 hover:bg-gray-50">
              <div class="flex items-center gap-x-2">
                <Bars2Icon class="h-4 w-4 shrink-0 cursor-grab text-gray-400 group-hover:text-indigo-600" />
                <span class="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">{{ index + 1 }}</span>
                <p>{{ step.name }}</p>
              </div>
              
              <button @click="removeStep(index)" class="mr-1 p-1 rounded-md invisible text-gray-400 hover:text-red-500 hover:bg-red-100 group-hover:visible active:translate-y-px">
                <XMarkIcon class="h-5 w-5 shrink-0" />
              </button>
            </div>
          </VueDraggableNext>
        </div>
        
        <!-- Empty state -->
        <div v-else @click="addStep()" class="text-center bg-slate-50 hover:bg-slate-100 rounded-2xl py-12 px-2 cursor-pointer">
          <QueueListIcon class="mx-auto h-6 w-6 text-indigo-600" aria-hidden="true" />
          <p class="mt-2 text-md font-medium text-gray-900">No steps</p>
          <AppButton variant="link">Add step</AppButton>
        </div>
      </nav>

      <!-- Center: Active Step -->
      <aside v-if="activeStep" class="w-[25rem] border-r">
        <!-- Header -->
        <div class="flex items-center justify-between border-b p-3">
          <p>{{ activeStep.name }}</p>  
          <button @click="activeStepIndex = null" type="button" class="group inline-flex items-center rounded-md p-1 bg-gray-100 hover:bg-gray-150 active:translate-y-px">
            <ChevronLeftIcon class="h-5 w-5 shrink-0 text-gray-400 group-hover:text-indigo-600" />
          </button>
        </div>

        <!-- Options -->
        <div class="flex flex-col gap-4 p-3">
          <AppInput v-model="activeStep.name" label="Step name" placeholder="Enter a step name..." />

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
import { ref, computed, onMounted } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useRoute } from 'vue-router'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { Bars2Icon, QueueListIcon } from '@heroicons/vue/24/outline'
import { PlusIcon, XMarkIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import Chart from '@/views/funnels/components/chart/Chart.vue'

const route = useRoute()

const loading = ref(true)
// const funnel = ref()
// const activeStepId = ref()
// const activeStep = computed(() => funnel.value.steps.find(step => step.id === activeStepId.value))

const activeStepIndex = ref()
const activeStep = computed(() => funnel.value.steps[activeStepIndex.value])

const metric = 'Page views'
const zoom = ref(0);

function addStep() {
  funnel.value.steps.push({
    metric: 'pageViews',
    name: 'New step',
    description: null,
    measurables: [
      ''
    ],
    total: '0'
  })

// funnelApi.storeStep(route.params.organization, route.params.funnel, {
//   metric: 'pageViews',
//   name: 'New step',
//   description: null,
// }).then(response => {
//   funnel.value.steps.push(response.data.data)
// })
}

function removeStep(index) {
  funnel.value.steps.splice(index, 1)
}

function runReport() {
  loading.value = true

  funnel.value.steps.forEach((step) => {
    gaDataApi.fetchPageViews(6, {
      startDate: '2024-01-22',
      endDate: 'yesterday',
      pagePaths: step.measurables,
    }).then(response => {
      if (response.data.data.error) {
        console.log(response.data.data.error)
        return
      }
      
      // Update step total
      let report = response.data.data
      step.total = report.totals[0].metricValues ? report.totals[0].metricValues[0].value : '0'
    })
  })

  loading.value = false
}

const funnel = ref({
  id: 1,
  user: {
    id: 1,
    name: 'Ryan Harmon',
    email: 'john@doe.com',
    role: 'admin',
    created_at: '2024-01-23T23:47:12.000000Z'
  },
  connection: null,
  name: 'New funnel',
  description: 'This is the funnel descriptions',
  steps: [
    // {
    //   id: 1,
    //   order: 1,
    //   metric: 'pageViews',
    //   name: 'Homepage',
    //   description: null,
    //   measurables: [
    //     '/',
    //   ],
    //   total: '0'
    // },
    {
      id: 2,
      order: 2,
      metric: 'pageViews',
      name: 'Loans',
      description: null,
      measurables: [
        '/personal/loans/',
      ],
      total: '0'
    },
    {
      id: 3,
      order: 3,
      metric: 'pageViews',
      name: 'Auto Loan',
      description: null,
      measurables: [
        '/personal/loans/vehicle/auto-loans/',
      ],
      total: '0'
    },
    // {
    //   id: 4,
    //   order: 4,
    //   metric: 'pageViews',
    //   name: 'Application',
    //   description: null,
    //   measurables: [
    //     '/personal/loans/vehicle/auto-loans/application/'
    //   ],
    //   total: '0'
    // },
  ]
})

onMounted(() => {
  runReport()

  // funnelApi.show(route.params.organization, route.params.funnel).then(response => {
  //   funnel.value = response.data.data
  // })
})
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
