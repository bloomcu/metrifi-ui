<template>
  <LayoutDefault v-if="funnel"  width="full" class="min-h-screen flex flex-col">
    <header class="border-b p-2">Header</header>

    <div class="flex-1 flex flex-col sm:flex-row">
      <!-- Funnel steps -->
      <nav class="w-72 border-r">
        <!-- Header -->
        <div class="flex items-center justify-between border-b p-2">
          <p>Funnel steps</p>  
          <button @click="addStep()" type="button" class="group inline-flex items-center rounded-md p-1 bg-indigo-600 hover:bg-indigo-500 active:translate-y-px">
            <PlusIcon class="h-5 w-5 shrink-0 text-white" />
          </button>
        </div>

        <!-- Steps -->
        <div v-if="funnel.steps.length" class="flex flex-col gap-2 p-2">
          <div v-for="step in funnel.steps" @click="activeStepId = step.id" class="group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-medium cursor-pointer bg-gray-50 text-gray-700 hover:text-indigo-600 hover:bg-gray-100">
            <Bars2Icon class="h-5 w-5 shrink-0 text-gray-400 group-hover:text-indigo-600" />
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
      <aside v-if="activeStep" class="w-96 border-r">
        <!-- Header -->
        <div class="flex items-center justify-between border-b p-2">
          <p>{{ activeStep.name }}</p>  
          <button @click="activeStepId = null" type="button" class="group inline-flex items-center rounded-md p-1 bg-gray-50 hover:bg-gray-100 active:translate-y-px">
            <XMarkIcon class="h-5 w-5 shrink-0 text-gray-400 group-hover:text-indigo-600" />
          </button>
        </div>

        <!-- Step -->
        <div class="border-b p-2">
          <p class="text-sm leading-5 text-gray-400">{{ activeStep.description }}</p>
        </div>
        <div class="flex flex-col gap-3 p-2">
          <AppSelect 
            v-model="activeStep.expression.type" 
            label="Type" 
            :options="[
              {label: 'View', value: 'view'},
              {label: 'Event', value: 'event'},
              {label: 'outbound', value: 'outbound'},
            ]"
          />

          <AppSelect 
            v-model="activeStep.expression.field_name" 
            label="Where" 
            :options="[
              {label: 'Page Path', value: 'pagePath'},
              {label: 'Page Referrer', value: 'pageReferrer'},
              {label: 'Landing Page', value: 'landingPage'},
              {label: 'Outbound Link Url', value: 'linkUrl'},
            ]"
          />
          
          <AppSelect 
            v-model="activeStep.expression.field_operator" 
            label="Operator" 
            :options="[
              {label: 'Exactly matches (=)', value: 'EXACT'},
              {label: 'Contains', value: 'CONTAINS'},
              {label: 'Begins with', value: 'BEGINS_WITH'},
              {label: 'Ends with', value: 'ENDS_WITH'},
            ]"
          />

          <!-- TODO: Use listbox for this -->
          <AppInput v-model="activeStep.expression.field_value" label="Value" hint="E.g., /contact/"/>
        </div>
      </aside>

      <!-- Chart -->
      <div class="flex-1 p-2">
        <!-- 
          Vanilla bar chart
          Source: https://codepen.io/robstinson/pen/ZEpKvjM?editors=1000 
        -->
        <div class="flex items-end flex-grow w-full mt-2 space-x-2 sm:space-x-3">
          <div class="relative flex flex-col items-center flex-grow pb-5 group">
            <span class="absolute top-0 hidden -mt-6 text-xs font-bold group-hover:block">$37,500</span>
            <div class="relative flex justify-center w-full h-16 bg-indigo-400"></div>
            <span class="absolute bottom-0 text-xs font-bold">Jan</span>
          </div>
          <div class="relative flex flex-col items-center flex-grow pb-5 group">
            <span class="absolute top-0 hidden -mt-6 text-xs font-bold group-hover:block">$45,000</span>
            <div class="relative flex justify-center w-full h-20 bg-indigo-400"></div>
            <span class="absolute bottom-0 text-xs font-bold">Feb</span>
          </div>
        </div>

        <!-- <ApexChart class="block" type="bar" :options="chart.options" :series="chart.series"></ApexChart> -->
        <!-- <pre>{{ funnel }}</pre> -->
      </div>
    </div>

    <!-- TODO: Add loading state -->
  </LayoutDefault>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { Bars2Icon, QueueListIcon } from '@heroicons/vue/24/outline'
import { PlusIcon, XMarkIcon } from '@heroicons/vue/24/solid'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import ApexChart from "vue3-apexcharts";

const route = useRoute()
const funnel = ref()
const activeStepId = ref(null)
const activeStep = computed(() => funnel.value.steps.find(step => step.id === activeStepId.value))

const chart = ref({
  options: {
    colors: ['#4f46e5'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadiusApplication: "end",
        borderRadius: 12,
      },
    },
    chart: {
      id: 'funnel',
      animations: {
        enabled: true,
        easing: 'easein',
        speed: 600,
        animateGradually: {
            enabled: true,
            delay: 150
        },
        dynamicAnimation: {
            enabled: false,
            speed: 350
        }
      },
    },
    xaxis: {
      categories: ['Homepage', 'Auto Loan', 'Application']
    }
  },
  series: [
    {
      name: 'Steps',
      data: [600, 321, 45]
    }
  ]
})

function addStep() {
  funnelApi.storeStep(route.params.organization, route.params.funnel, {
    name: 'New step',
    description: 'This is the step description',
  }).then(response => {
    funnel.value.steps.push(response.data.data)
  })
}

onMounted(() => {
  funnelApi.show(route.params.organization, route.params.funnel).then(response => {
    funnel.value = response.data.data
  })
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
