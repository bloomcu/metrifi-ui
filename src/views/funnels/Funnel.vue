<template>
  <LayoutDefault v-if="funnel"  width="full" class="min-h-screen flex flex-col">
    <header class="border-b p-3 flex items-center justify-between">
      Header
      <AppButton @click="runReport()">Run Report</AppButton>
    </header>

    <div class="flex-1 flex flex-col sm:flex-row">

      <!-- Funnel steps -->
      <nav class="w-[25rem] border-r">
        <!-- Header -->
        <div class="flex items-center justify-between border-b p-3">
          <p>Funnel steps</p>  
          <button @click="addStep()" type="button" class="group inline-flex items-center rounded-md p-1 bg-indigo-600 hover:bg-indigo-500 active:translate-y-px">
            <PlusIcon class="h-5 w-5 shrink-0 text-white" />
          </button>
        </div>

        <!-- Steps -->
        <div v-if="funnel.steps.length" class="flex flex-col gap-3 p-3">
          <div v-for="step in funnel.steps" @click="activeStepId = step.id" class="group flex items-center gap-x-2 rounded-lg px-2 py-3 text-sm leading-6 font-medium cursor-pointer text-gray-700 bg-white border hover:text-indigo-600 hover:bg-indigo-50">
            <Bars2Icon class="h-4 w-4 shrink-0 cursor-grab text-gray-400 group-hover:text-indigo-600" />
            <span class="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">{{ step.order }}</span>
            <p>{{ step.name }}</p>
          </div>
        </div>
        
        <!-- Empty state -->
        <div v-else @click="addStep()" class="text-center bg-slate-50 hover:bg-slate-100 rounded-2xl py-12 px-2 cursor-pointer">
          <QueueListIcon class="mx-auto h-6 w-6 text-indigo-600" aria-hidden="true" />
          <p class="mt-2 text-md font-medium text-gray-900">No steps</p>
          <AppButton variant="link">Add step</AppButton>
        </div>
      </nav>

      <!-- Active Step -->
      <aside v-if="activeStep" class="w-[25rem] border-r">
        <!-- Header -->
        <div class="flex items-center justify-between border-b p-3">
          <p>{{ activeStep.name }}</p>  
          <button @click="activeStepId = null" type="button" class="group inline-flex items-center rounded-md p-1 bg-gray-50 hover:bg-gray-100 active:translate-y-px">
            <XMarkIcon class="h-5 w-5 shrink-0 text-gray-400 group-hover:text-indigo-600" />
          </button>
        </div>

        <!-- Description -->
        <!-- <div class="border-b p-2">
          <p class="text-sm leading-5 text-gray-400">{{ activeStep.description }}</p>
        </div> -->

        <!-- Options -->
        <div class="flex flex-col gap-3 p-3">
          <div>
            <!-- <p class="block text-sm font-medium text-gray-900">Metric</p> -->
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
          </div>

          <div>
            <p class="block mb-1 text-sm font-medium text-gray-900">Measurables</p>
            <AppInput v-model="activeStep.measurables[0]" class="mb-2" placeholder="Enter a page path..."/>
            <AppInput v-model="activeStep.measurables[1]" class="mb-2" placeholder="Enter a page path..."/>
            <AppInput v-model="activeStep.measurables[3]" class="mb-2" placeholder="Enter a page path..."/>
          </div>
          <!-- <pre>{{ activeStep }}</pre> -->
        </div>
      </aside>

      <!-- Chart -->
      <div class="mx-auto w-full max-w-6xl p-10">
        <Chart/>
        <!-- <pre>{{ funnel }}</pre> -->
      </div>
    </div>

    <!-- TODO: Add loading state -->
  </LayoutDefault>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { Bars2Icon, QueueListIcon } from '@heroicons/vue/24/outline'
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import Chart from '@/views/funnels/components/chart/Chart.vue'

const route = useRoute()
// const funnel = ref()
// const report = ref()
const activeStepId = ref(null)
const activeStep = computed(() => funnel.value.steps.find(step => step.id === activeStepId.value))

function runReport() {
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
      
      // console.log(response.data.data)
      let report = response.data.data
      step.total = report.totals[0].metricValues[0].value
    })
  })
}

onMounted(() => {
  // runReport()

  // funnelApi.show(route.params.organization, route.params.funnel).then(response => {
  //   funnel.value = response.data.data
  // })
})

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
    //   ]
    // },
    {
      id: 2,
      order: 2,
      metric: 'pageViews',
      name: 'Loans',
      description: null,
      measurables: [
        '/personal/loans/',
      ]
    },
    {
      id: 3,
      order: 3,
      metric: 'pageViews',
      name: 'Auto Loan',
      description: null,
      measurables: [
        '/personal/loans/vehicle/auto-loans/',
      ]
    },
    {
      id: 4,
      order: 4,
      metric: 'pageViews',
      name: 'Auto Loan Application',
      description: null,
      measurables: [
        '/personal/loans/vehicle/auto-loans/application/'
      ]
    },
  ]
})

function addStep() {
  // funnelApi.storeStep(route.params.organization, route.params.funnel, {
  //   metric: 'pageViews',
  //   name: 'New step',
  //   description: null,
  // }).then(response => {
  //   funnel.value.steps.push(response.data.data)
  // })

  funnel.value.steps.push({
    metric: 'pageViews',
    name: 'New step',
    description: null,
    measurables: [
      ''
    ]
  })
}
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
