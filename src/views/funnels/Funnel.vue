<template>
  <LayoutDefault v-if="funnel"  width="full" class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="border-b p-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <AppButton :to="{name: 'funnels'}" variant="tertiary" size="base">
          <ArrowLeftIcon class="h-5 w-5 shrink-0" />
        </AppButton>

        <!-- Funnel name -->
        <AppInput v-model="funnel.name" @update:modelValue="updateFunnel"/>

        <!-- Loading/Updating/Reporting indicator -->
        <svg v-if="isLoading || isUpdating" class="inline w-6 h-6 ml-2 text-indigo-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
      </div>

      <div class="flex items-center gap-3">
        <!-- Connection -->
        <!-- <ConnectionIdPicker v-model="funnel.connection_id" :connections="connections" @update:modelValue="updateFunnelConnection" class="w-56"/> -->
        <div class="flex items-center mr-2">
          <svg class="w-4 h-4 mr-2" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
          <span class="text-sm">{{ funnel.connection.name }}</span>
        </div>

        <!-- Datepicker -->
        <DatePicker/>

        <!-- Zoom -->
        <Zoom v-model="funnel.zoom" @update:modelValue="updateFunnel"/>
      </div>
    </header>

    <!-- <pre>
      Pending: {{ pending.length }}
      Completed: {{ completed.length }}
    </pre> -->

    <div class="flex-1 flex flex-col sm:flex-row">

      <!-- Left: Funnel steps -->
      <nav class="min-w-[24rem] max-w-[24rem] border-r">
        <!-- Header -->
        <div class="flex items-center justify-between border-b p-3">
          <p>Steps</p>

          <div class="flex gap-2">
            <!-- Generate with AI -->
            <button @click.stop="toggleModal()" type="button" class="group inline-flex items-center gap-1 rounded-md py-1 px-2 text-sm text-indigo-600 bg-indigo-50 hover:bg-indigo-100 active:translate-y-px">
              <svg v-if="isGeneratingSteps" class="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 100 101"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>
              <svg v-else class="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 576 512"><path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"/></svg>
              {{ isGeneratingSteps ? 'Generating' : 'Generate steps with AI' }}
            </button>
            
            <!-- Add new -->
            <button @click.stop="addStep()" type="button" class="inline-flex items-center rounded-md p-1 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-200 active:translate-y-px">
              <PlusIcon class="h-5 w-5 shrink-0" />
            </button>
          </div>
        </div>

        <!-- Steps -->
        <div v-if="funnel.steps.length" class="p-3">
          <VueDraggableNext 
            :list="funnel.steps" 
            :animation="150"
            @change="handleDragEvent($event)"
            class="flex flex-col gap-3"
          >
            <div 
              v-for="(step, index) in funnel.steps" 
              @click="activeStepId = step.id" 
              :class="activeStepId == step.id ? 'border-indigo-500 border-2 bg-indigo-50' : 'border-gray-200 bg-white hover:bg-gray-50'"
              class="group flex items-center justify-between rounded-lg px-2 py-3 text-sm leading-6 font-medium cursor-pointer border shadow text-gray-700 hover:text-indigo-600"
            >
              <div class="flex items-center gap-x-2">
                <Bars2Icon class="h-4 w-4 shrink-0 cursor-grab text-gray-400 group-hover:text-indigo-600" />
                <span class="inline-flex items-center rounded-md bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700">{{ index + 1 }}</span>
                <p>{{ step.name }}</p>
              </div>
              
              <button @click.stop="deleteStep(index, step.id)" class="mr-1 p-1 rounded-md invisible text-gray-400 hover:text-pink-500 hover:bg-pink-100 group-hover:visible active:translate-y-px">
                <TrashIcon class="h-5 w-5 shrink-0" />
              </button>
            </div>
          </VueDraggableNext>
        </div>
        
        <!-- Empty state -->
        <div v-else class="py-12 text-center">
          <QueueListIcon class="mx-auto mb-2 h-6 w-6 text-indigo-600" aria-hidden="true" />
          <p class="mb-3 text-md font-medium text-gray-900">No steps</p>
        </div>
      </nav>

      <!-- Center: Active Step -->
      <aside v-if="activeStep" class="min-w-[24rem] max-w-[24rem] border-r">
        <!-- Header -->
        <div class="flex items-center justify-between border-b p-3">
          <button @click="activeStepId = null" type="button" class="inline-flex items-center rounded-md p-1 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-200 active:translate-y-px">
            <ChevronLeftIcon class="h-5 w-5 shrink-0" />
          </button>
        </div>

        <!-- Options -->
        <div class="flex flex-col gap-4 p-3">
          <AppInput v-model="activeStep.name" @update:modelValue="updateStepName(activeStep)" label="Step name" placeholder="Enter a step name..." />

          <div>
            <p class="block mb-1 text-sm font-medium text-gray-900">Metrics</p>

            <!-- Measurables -->
            <template v-for="(measurable, index) in activeStep.measurables">

              <!-- Metric: Page users -->
              <div v-if="measurable.metric === 'pageUsers'" class="flex flex-col gap-2 bg-gray-50 rounded-md p-2 mb-2">
                <div class="flex flex-row items-center justify-between">
                  <MetricPicker v-model="measurable.metric" @update:modelValue="updateStepMeasurables(activeStep)" class="w-full"/>
                  <button @click="deleteMeasurable(index)" class="ml-1.5 p-1 rounded-md text-gray-400 hover:text-pink-500 hover:bg-pink-100 active:translate-y-px">
                    <TrashIcon class="h-5 w-5 shrink-0" />
                  </button>
                </div>
                <AppInput v-model="measurable.measurable" @update:modelValue="updateStepMeasurables(activeStep)" placeholder="Page path..."/>
              </div>

              <!-- Metric: Page + query strings  -->
              <div v-if="measurable.metric === 'pagePlusQueryStringUsers'" class="flex flex-col gap-2 bg-gray-50 rounded-md p-2 mb-2">
                <div class="flex flex-row items-center justify-between">
                  <MetricPicker v-model="measurable.metric" @update:modelValue="updateStepMeasurables(activeStep)" class="w-full"/>
                  <button @click="deleteMeasurable(index)" class="ml-1.5 p-1 rounded-md text-gray-400 hover:text-pink-500 hover:bg-pink-100 active:translate-y-px">
                    <TrashIcon class="h-5 w-5 shrink-0" />
                  </button>
                </div>
                <AppInput v-model="measurable.measurable" @update:modelValue="updateStepMeasurables(activeStep)" placeholder="Page path + query strings..."/>
              </div>

              <!-- Metric: Outbound link users -->
              <div v-if="measurable.metric === 'outboundLinkUsers'" class="flex flex-col gap-2 bg-gray-50 rounded-md p-2 mb-2">
                <div class="flex flex-row items-center justify-between">
                  <MetricPicker v-model="measurable.metric" @update:modelValue="updateStepMeasurables(activeStep)" class="w-full"/>
                  <button @click="deleteMeasurable(index)" class="ml-1.5 p-1 rounded-md text-gray-400 hover:text-pink-500 hover:bg-pink-100 active:translate-y-px">
                    <TrashIcon class="h-5 w-5 shrink-0" />
                  </button>
                </div>
                <AppInput v-model="measurable.pagePath" @update:modelValue="updateStepMeasurables(activeStep)" placeholder="Source page path"/>
                <AppInput v-model="measurable.measurable" @update:modelValue="updateStepMeasurables(activeStep)" placeholder="Outbound url"/>
              </div>
            </template>
            
            <!-- Add measurable -->
            <button @click="addMeasurable(activeStep)" type="button" class="flex items-center gap-1 rounded-md p-1 text-sm text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-200 active:translate-y-px">
              <PlusIcon class="h-5 w-5 shrink-0" />
              Add metric
            </button>

            <!-- <pre>{{ activeStep }}</pre> -->
          </div>
        </div>
      </aside>

      <!-- Right: Chart -->
      <div v-if="!isLoading" class="mx-auto w-full max-w-6xl overflow-hidden px-10 py-4">
        <!-- Automation running -->
        <div v-if="isGeneratingSteps" class="rounded-md bg-indigo-50 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0 text-indigo-600">
              <svg class="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 100 101"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-indigo-600">Generating funnel steps, please wait.</p>
            </div>
          </div>
        </div>

        <!-- Automation error -->
        <div v-if="errorGeneratingSteps" class="rounded-md bg-pink-50 p-4 mb-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 text-pink-600">
              <svg class="w-6 h-6 mr-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
            </div>
            <div class="ml-3">
              <p v-html="errorGeneratingSteps" class="text-sm font-medium text-pink-600"></p>
            </div>
          </div>
        </div>

        <!-- <div class="flex gap-6 mt-6"> -->
          <!-- <div class="flex-1"> -->
            <Chart :funnel="funnel" :startDate="selectedDateRange.startDate" :endDate="selectedDateRange.endDate" :zoom="funnel.zoom" />
          <!-- </div> -->

          <!-- Overall -->
          <!-- <div class="w-[14rem]"> -->
            <!-- <div class="flex flex-col gap-1 text-center rounded-md bg-white border shadow p-4"> -->
              <!-- <p>Overall</p> -->
              <!-- <span class="text-3xl font-medium">{{ overallConversionRateComputed }}%</span> -->
              <!-- <p>conversion rate</p> -->
            <!-- </div> -->
          <!-- </div> -->
        <!-- </div> -->

        <!-- Messages -->
        <div v-if="funnel.messages && funnel.messages.length" class="pt-10">
          <p class="text-lg font-medium mb-3">Notifications</p>

          <div class="flex flex-col gap-2">
            <div v-for="message in funnel.messages" class="rounded-md bg-white border shadow overflow-hidden">
              <div @click="message.show = !message.show" class="flex items-center cursor-pointer p-4 hover:bg-emerald-50">
                <div class="flex-shrink-0">
                  <CursorArrowRippleIcon class="h-6 w-6 text-emerald-500" aria-hidden="true" />
                </div>
                <div class="ml-3 flex-1 text-sm md:flex md:justify-between">
                  <p>{{ message.json['links'].length }} outbound link(s) found for the final step of the funnel</p>
                  <div class="flex items-center gap-3">
                    <p class="text-gray-500">{{ moment(message.updated_at).fromNow() }}</p>
                    <button class="flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-500">
                      Details
                      <PlusIcon :class="message.show ? 'rotate-45 h-5 w-5' : 'h-4 w-4'"/>
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="message.show" class="border-t text-sm p-4">
                <div class="mb-5">
                  <p class="mb-1 font-bold">Page path of the final step of the funnel:</p>
                  <p>{{ message.json['pagePath'] }}</p>
                </div>
                <p class="mb-1 font-bold">Outbound links:</p>
                <ol class="list-decimal list-inside space-y-2 mb-5">
                  <li v-for="link in message.json['links']">
                    <a :href="link" class="hover:text-indigo-500 underline" target="_blank">{{ link }}</a>
                  </li>
                </ol>
                <p><span class="font-bold">Suggested action:</span> Consider adding a step to the end of the funnel to track clicks on outbound links.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- <pre>{{ funnel }}</pre> -->
      </div>
    </div>

    <!-- TODO: Add loading state -->

    <GenerateStepsModal :open="isModalOpen" @done="loadFunnel()"/>
  </LayoutDefault>
</template>
  
<script setup>
import moment from 'moment'
import debounce from 'lodash.debounce'
import { ref, computed, onMounted, watch, provide } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { useFunnels } from '@/domain/funnels/composables/useFunnels'
import { useRoute } from 'vue-router'
// import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { Bars2Icon, QueueListIcon } from '@heroicons/vue/24/outline'
import { ArrowLeftIcon, PlusIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid'
import { TrashIcon, CursorArrowRippleIcon } from '@heroicons/vue/24/outline'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import GenerateStepsModal from '@/views/funnels/modals/GenerateStepsModal.vue'
// import AppInlineEditor from '@/app/components/base/forms/AppInlineEditor.vue'
import DatePicker from '@/app/components/datepicker/DatePicker.vue'
// import ConnectionIdPicker from '@/domain/connections/components/ConnectionIdPicker.vue'
import Zoom from '@/views/funnels/components/zoom/Zoom.vue'
import MetricPicker from '@/views/funnels/components/metrics/MetricPicker.vue'
import Chart from '@/views/funnels/components/chart/Chart.vue'

const route = useRoute()
const { selectedDateRange } = useDatePicker()
const { connections, selectedConnection, listConnections } = useConnections()
const { funnels, funnel, pending, completed, active, addFunnel, addJob } = useFunnels()

const isModalOpen = ref(false)
const isLoading = ref(false)
const isUpdating = ref(false)
// const isReporting = ref(false)
const isGeneratingSteps = ref(false)
const errorGeneratingSteps = ref()

// const funnel = ref()

const activeStepId = ref()
const activeStep = computed(() => funnel.value.steps.find(step => step.id === activeStepId.value))

provide('funnel', funnel)
provide('isModalOpen', isModalOpen)
provide('isGeneratingSteps', isGeneratingSteps)
provide('errorGeneratingSteps', errorGeneratingSteps)

// const updateFunnelConnection = (() => {
//   console.log('Updating funnel connection...')
//   updateFunnel()
//   runReport()
// })

const updateFunnel = debounce(() => {
  console.log('Updating funnel...')
  isUpdating.value = true

  funnelApi.update(route.params.organization, route.params.funnel, {
    connection_id: funnel.value.connection_id,
    name: funnel.value.name,
    description: funnel.value.description,
    zoom: funnel.value.zoom,
  }).then(() => {
    setTimeout(() => isUpdating.value = false, 800);
  })
}, 800)

const updateStepName = debounce((step) => {
  console.log('Updating step name...')
  isUpdating.value = true

  funnelApi.updateStep(route.params.organization, route.params.funnel, step.id, {
    name: step.name,
  }).then(() => {
    setTimeout(() => isUpdating.value = false, 800);
  })
}, 800)

const updateStepMeasurables = debounce((step) => {
  console.log('Updating step measurables...')
  isUpdating.value = true

  funnelApi.updateStep(route.params.organization, route.params.funnel, step.id, {
    measurables: step.measurables,
  }).then(() => {
    // runReport()
    addJob(funnel.value)
    setTimeout(() => isUpdating.value = false, 800);
  })
}, 800)

function handleDragEvent(e) {
  console.log('Handling drag event...')

  isUpdating.value = true
  let event = e.moved || e.added

  funnelApi.updateStep(route.params.organization, route.params.funnel, event.element.id, {
    order: event.newIndex + 1
  }).then(() => {
    setTimeout(() => isUpdating.value = false, 500)
  })
}

function addStep() {
  console.log('Adding step...')

  funnelApi.storeStep(route.params.organization, route.params.funnel, {
    name: 'New step',
    description: null,
    measurables: [{
      metric: 'pageUsers', 
      measurable: ''
    }],
  }).then(response => {
    funnel.value.steps.push(response.data.data)
  })
}

function addMeasurable(step) {
  console.log('Adding measurable...')

  step.measurables.push({
    connection_id: selectedConnection.value.id,
    metric: 'pageUsers', 
    // pagePath:'',
    measurable: '',
  })
}

function deleteMeasurable(index) {
  console.log('Deleting measurable...')
  
  activeStep.value.measurables.splice(index, 1)
  updateStepMeasurables(activeStep.value)
}

function deleteStep(index, id) {
  console.log('Deleting step...')

  funnelApi.destroyStep(route.params.organization, route.params.funnel, id)
    .then(() => {
      funnel.value.steps.splice(index, 1)
    })
}

function toggleModal() { 
  isModalOpen.value = !isModalOpen.value 
}

function loadFunnel() {
  console.log('Loading funnel...')
  
  funnelApi.show(route.params.organization, route.params.funnel)
    .then(response => {
      addFunnel(response.data.data)
      // funnel.value = response.data.data
      // runReport()
    })
}

watch(selectedDateRange, () => {
  console.log('Selecting data range...')
  addJob(funnel.value)
  // runReport()
})

onMounted(() => {
  loadFunnel()
  listConnections()
})
</script>