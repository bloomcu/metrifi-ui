<template>
  <LayoutDefault v-if="funnelStore.funnel" width="full" class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="border-b flex items-center gap-3 justify-between py-3 px-3">
      <div class="flex items-center gap-2 grow">
        <!-- Back -->
        <AppButton :to="{name: 'funnels'}" variant="tertiary" size="base">
          <ArrowLeftIcon class="h-5 w-5 shrink-0" />
        </AppButton>

        <!-- Settings -->
        <!-- <AppButton @click="isEditFunnelModalOpen = true" variant="tertiary" size="base">
          <Cog6ToothIcon class="h-5 w-5 shrink-0" />
        </AppButton> -->

        <!-- Funnel name -->
        <AppTooltipWrapper class="w-6/12">
          <AppInput v-model="funnelStore.funnel.name" @update:modelValue="updateFunnel"/>
          <AppTooltip v-if="!organizationStore.organization.is_private" text="Funnel name will be visible to people outside of your organization" />
        </AppTooltipWrapper>

        <!-- Category -->
        <CategoryPicker v-model="funnelStore.funnel.category" @update:modelValue="updateFunnel"/>

        <!-- Loading/Updating/Reporting indicator -->
        <svg v-if="funnelStore.isLoading || isUpdating" class="inline w-6 h-6 ml-2 text-violet-500 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
      </div>

      <div class="flex items-center gap-2">
        <!-- Connection -->
        <div class="flex items-center mr-1">
          <svg class="w-4 h-4 mr-2" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
          <span class="text-sm">{{ funnelStore.funnel.connection.name }}</span>
        </div>

        <!-- Datepicker -->
        <DatePicker class="w-[330px]"/>

        <!-- Zoom -->
        <Zoom v-model="funnelStore.funnel.zoom" @update:modelValue="updateFunnel"/>
      </div>
    </header>

    <div class="flex-1 flex flex-col sm:flex-row">
      <!-- Left: Funnel steps -->
      <nav class="min-w-[24rem] max-w-[24rem] border-r">
        <!-- Header -->
        <div class="flex items-center justify-between border-b py-3 pr-4 pl-4 sm:pl-6 lg:pl-8">
          <p>Steps</p>

          <div class="flex gap-2">
            <!-- Generate with AI -->
            <!-- <button @click.stop="toggleModal()" type="button" class="group inline-flex items-center gap-1 rounded-md py-1 px-2 text-sm text-violet-500 bg-violet-50 hover:bg-violet-100 active:translate-y-px">
              <svg v-if="isGeneratingSteps" class="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 100 101"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>
              <svg v-else class="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 576 512"><path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"/></svg>
              {{ isGeneratingSteps ? 'Generating' : 'Generate steps with AI' }}
            </button> -->
            
            <!-- Add new -->
            <button @click.stop="addStep()" type="button" class="inline-flex items-center rounded-md p-1 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-200 active:translate-y-px">
              <PlusIcon class="h-5 w-5 shrink-0" />
            </button>
          </div>
        </div>

        <!-- Steps -->
        <div v-if="funnelStore.funnel.steps.length" class="py-3 pr-4 pl-4 sm:pl-6 lg:pl-8">
          <VueDraggableNext 
            :list="funnelStore.funnel.steps" 
            :animation="150"
            @change="handleDragEvent($event)"
            class="flex flex-col gap-3"
          >
            <div 
              v-for="(step, index) in funnelStore.funnel.steps" 
              @click="activeStepId = step.id" 
              :class="activeStepId == step.id ? 'border-violet-500 border-2 bg-violet-50' : 'border-gray-200 bg-white hover:bg-gray-50'"
              class="group flex items-center justify-between rounded-lg px-2 py-3 text-sm leading-6 font-medium cursor-pointer border shadow text-gray-700 hover:text-violet-600"
            >
              <div class="flex items-center gap-x-2">
                <Bars2Icon class="h-4 w-4 shrink-0 cursor-grab text-gray-400 group-hover:text-violet-600" />
                <span class="inline-flex items-center rounded-md bg-violet-100 px-2 py-1 text-xs font-medium text-violet-500">{{ index + 1 }}</span>
                <p>{{ step.name }}</p>
              </div>
              
              <div class="flex items-center gap-x-1">
                <button @click.stop="deleteStep(index, step.id)" class="mr-1 p-1 rounded-md invisible text-gray-400 hover:text-pink-500 hover:bg-pink-100 group-hover:visible active:translate-y-px">
                  <TrashIcon class="h-5 w-5 shrink-0" />
                </button>
                <span v-if="!step.metrics.length" class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  No metrics
                  <!-- <InformationCircleIcon class="h-5 w-5 shrink-0 ml-0.5" /> -->
                </span>
              </div>
            </div>
          </VueDraggableNext>
        </div>
        
        <!-- Empty state -->
        <div v-else class="py-12 text-center">
          <QueueListIcon class="mx-auto mb-2 h-6 w-6 text-violet-500" aria-hidden="true" />
          <p class="mb-3 text-md font-medium text-gray-900">No steps</p>
        </div>
      </nav>

      <!-- Center: Active Step -->
      <aside v-if="activeStep" class="min-w-[24rem] max-w-[24rem] border-r">
        <!-- Step header -->
        <div class="flex items-center justify-between border-b p-3">
          <button @click="activeStepId = null" type="button" class="inline-flex items-center rounded-md p-1 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-200 active:translate-y-px">
            <ChevronLeftIcon class="h-5 w-5 shrink-0" />
          </button>
        </div>

        <!-- Step metrics -->
        <div class="flex flex-col gap-4 p-3">
          <AppTooltipWrapper>
            <AppInput 
              v-model="activeStep.name" 
              @update:modelValue="updateStepName(activeStep)"
              :hint="activeStep.name.length > 50 ? 'Warning: Step name is too long' : ''" 
              label="Step name" 
              placeholder="Step name" 
            />
            <AppTooltip v-if="!organizationStore.organization.is_private" text="Step name will be visible to people outside of your organization" />
          </AppTooltipWrapper>

          <div>
            <p class="block mb-1 text-sm font-medium text-gray-900">Metrics</p>

            <!-- Metrics -->
            <template v-for="(metric, index) in activeStep.metrics" :key="index">
              <div class="relative">
                <div @click="metric.showPicker = !metric.showPicker" class="flex flex-col gap-2 cursor-pointer bg-gray-50 border border-gray-300 rounded-md p-2 mb-2 hover:bg-gray-100">
                  <div class="flex flex-row items-center justify-between">
                    <div>
                      <p class="text-xs uppercase">Metric:</p>
                      <p class="text-gray-500">{{ metric.metric }}</p>
                    </div>
                    <button @click.stop="deleteMetric(index)" class="ml-1.5 p-1 rounded-md text-gray-400 hover:text-pink-500 hover:bg-pink-100 active:translate-y-px">
                      <TrashIcon class="h-5 w-5 shrink-0" />
                    </button>
                  </div>

                  <div v-if="metric.pagePath" class="">
                    <p class="text-xs uppercase">Page path:</p>
                    <p class="text-gray-500 overflow-x-auto">{{ metric.pagePath }}</p>
                  </div>

                  <div v-if="metric.pagePathPlusQueryString" class="">
                    <p class="text-xs uppercase">Page path + query string:</p>
                    <p class="text-gray-500 overflow-x-auto">{{ metric.pagePathPlusQueryString }}</p>
                  </div>
                  
                  <div v-if="metric.linkUrl" class="">
                    <p class="text-xs uppercase">Link url:</p>
                    <p class="text-gray-500 overflow-x-auto">{{ metric.linkUrl }}</p>
                  </div>

                  <div v-if="metric.formDestination" class="">
                    <p class="text-xs uppercase">Form destination:</p>
                    <p class="text-gray-500 overflow-x-auto">{{ metric.formDestination }}</p>
                  </div>

                  <div v-if="metric.formId" class="">
                    <p class="text-xs uppercase">Form id:</p>
                    <p class="text-gray-500 overflow-x-auto">{{ metric.formId }}</p>
                  </div>

                  <div v-if="metric.formLength" class="">
                    <p class="text-xs uppercase">Form length:</p>
                    <p class="text-gray-500 overflow-x-auto">{{ metric.formLength }}</p>
                  </div>

                  <div v-if="metric.formSubmitText" class="">
                    <p class="text-xs uppercase">Form submit text:</p>
                    <p class="text-gray-500 overflow-x-auto">{{ metric.formSubmitText }}</p>
                  </div>

                  <div v-if="metric.hostname" class="">
                    <p class="text-xs uppercase">Hostname:</p>
                    <p class="text-gray-500 overflow-x-auto">{{ metric.hostname }}</p>
                  </div>
                </div>
              </div>

              <NewMetricPicker 
                  v-if="metric.showPicker"
                  v-model="activeStep.metrics[index]"
                  @update:modelValue="updateStepMetrics(activeStep)"
                />
            </template>
            
            <!-- Add metric -->
            <button @click="addMetric()" type="button" class="flex items-center gap-1 rounded-md p-1 text-sm text-gray-500 border border-gray-300 hover:text-gray-900 bg-gray-50 hover:bg-gray-200 active:translate-y-px">
              <PlusIcon class="h-5 w-5 shrink-0" />
              Add metric
            </button>

          </div>
        </div>
      </aside>

      <!-- Right: Chart -->
      <div class="flex flex-col mx-auto w-full max-w-8xl overflow-hidden px-10 py-4">
        <div class="ml-auto mb-2 z-0">
          <AppButton v-if="!projection.length" @click="showProjection()" variant="secondary">
            {{ funnelStore.funnel.projections.length ? 'Show projection' : 'Create projection' }}
          </AppButton>
          <div v-else class="flex gap-2 ml-auto">
            <AppButton @click="deleteProjection()" variant="link">Delete projection</AppButton>
            <AppButton @click="projection = []" variant="tertiary">Hide projection</AppButton>
            <AppButton @click="saveProjection()" variant="secondary">Save projection</AppButton>
          </div>
        </div>

        <!-- Chart -->
        <Chart 
          :funnel="funnelStore.funnel"
          :conversion_value="funnelStore.funnel.conversion_value"
          :startDate="selectedDateRange.startDate" 
          :endDate="selectedDateRange.endDate" 
          :zoom="funnelStore.funnel.zoom"
          :updating="funnelStore.isLoading"
          :enableCursorPointer="true"
          @stepSelected="selectStep"
        />

        <!-- <ChartLine/> -->

        <!-- Automation running (TODO: Make a notification component for these) -->
        <div v-if="isGeneratingSteps" class="rounded-md bg-violet-50 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0 text-violet-500">
              <svg class="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 100 101"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-violet-500">Generating funnel steps, please wait.</p>
            </div>
          </div>
        </div>

        <!-- Automation error (TODO: Do this in the notification component) -->
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

        <!-- Messages -->
        <div v-if="funnelStore.funnel.messages && funnelStore.funnel.messages.length" class="pt-10">
          <p class="text-lg font-medium mb-3">Notifications</p>

          <div class="flex flex-col gap-2">
            <div v-for="message in funnelStore.funnel.messages" class="rounded-md bg-white border shadow overflow-hidden">
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
                    <a :href="link" class="hover:text-violet-600 underline" target="_blank">{{ link }}</a>
                  </li>
                </ol>
                <p><span class="font-bold">Suggested action:</span> Consider adding a step to the end of the funnel to track clicks on outbound links.</p>
              </div>
            </div>
          </div>
        </div>

      </div>      
    </div>

    <GenerateStepsModal :open="isGenerateStepsModalOpen" @done="showFunnel()"/>
    <EditFunnelModal :open="isEditFunnelModalOpen" />
    <EditConversionValueModal :open="isEditConversionValueModalOpen" />
  </LayoutDefault>
</template>
  
<script setup>
import moment from 'moment'
import debounce from 'lodash.debounce'
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, watch, provide } from 'vue'
import { VueDraggableNext } from 'vue-draggable-next'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { useConnections } from '@/domain/connections/composables/useConnections'
// import { useFunnels } from '@/domain/funnels/composables/useFunnels'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import { useFunnelStore } from '@/domain/funnels/store/useFunnelStore'
import { useGoogleAnalyticsReports } from '@/domain/services/google-analytics/composables/useGoogleAnalyticsReports'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { Bars2Icon, QueueListIcon, Cog6ToothIcon, TrashIcon, CursorArrowRippleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { ArrowLeftIcon, PlusIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid'
import AppTooltip from '@/app/components/base/tooltips/AppTooltip.vue'
import AppTooltipWrapper from '@/app/components/base/tooltips/AppTooltipWrapper.vue'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import GenerateStepsModal from '@/views/funnels/modals/GenerateStepsModal.vue'
import EditFunnelModal from '@/views/funnels/modals/EditFunnelModal.vue'
import EditConversionValueModal from '@/views/funnels/modals/EditConversionValueModal.vue'
import DatePicker from '@/app/components/datepicker/DatePicker.vue'
import Zoom from '@/views/funnels/components/zoom/Zoom.vue'
import CategoryPicker from '@/app/components/category-picker/CategoryPicker.vue'
import NewMetricPicker from '@/views/funnels/components/new-metric-picker/NewMetricPicker.vue'
import Chart from '@/views/funnels/components/chart/Chart.vue'
// import AGChart from '@/views/funnels/components/chart-libraries/AGChart.vue'

const route = useRoute()
const authStore = useAuthStore()
const organizationStore = useOrganizationStore()
const funnelStore = useFunnelStore()
const { selectedDateRange } = useDatePicker()
const { listConnections } = useConnections()
const { resetReports } = useGoogleAnalyticsReports() // rename to useGoogleAnalyticsData

const isLoading = ref(true)
const isUpdating = ref(false)
const isGeneratingSteps = ref(false)
const errorGeneratingSteps = ref()
const isEditFunnelModalOpen = ref(false)
const isEditConversionValueModalOpen = ref(false)
const isGenerateStepsModalOpen = ref(false)

const projection = ref([])
// const showProjection = ref(false)

const activeStepId = ref()
const activeStep = computed(() => funnelStore.funnel.steps.find(step => step.id === activeStepId.value))

// provide('funnel', funnel)
provide('projection', projection)
provide('isUpdating', isUpdating)
provide('isGeneratingSteps', isGeneratingSteps)
provide('errorGeneratingSteps', errorGeneratingSteps)
provide('isEditFunnelModalOpen', isEditFunnelModalOpen)
provide('isEditConversionValueModalOpen', isEditConversionValueModalOpen)
provide('isGenerateStepsModalOpen', isGenerateStepsModalOpen)

function showProjection() {
  // console.log('Showing projection...')

  if (funnelStore.funnel.projections.length) {
    projection.value = funnelStore.funnel.projections[0]
    return
  }

  funnelStore.funnel.report.steps.forEach((step, index) => {
    projection.value.push({
      name: step.name,
      users: step.users,
      conversionRate: step.conversionRate
    })
  })
}

function saveProjection() {
  // console.log('Saving projection...')

  funnelStore.funnel.projections.push(projection.value)
  updateFunnel()
}

function deleteProjection() {
  // console.log('Deleting projection...')

  funnelStore.funnel.projections = []
  projection.value = []
  updateFunnel()
}

const updateFunnel = debounce(() => {
  // console.log('Updating funnel...')
  isUpdating.value = true

  funnelApi.update(route.params.organization, route.params.funnel, {
    connection_id: funnelStore.funnel.connection_id,
    category_id: funnelStore.funnel.category.id,
    name: funnelStore.funnel.name,
    description: funnelStore.funnel.description,
    zoom: funnelStore.funnel.zoom,
    conversion_value: funnelStore.funnel.conversion_value,
    projections: funnelStore.funnel.projections,
  }).then(() => {
    setTimeout(() => isUpdating.value = false, 800);
  })
}, 800)

const updateStepName = debounce((step) => {
  // console.log('Updating step name...')
  isUpdating.value = true
  
  let steps = funnelStore.funnel.steps.filter(s => s.id !== step.id)
  step.name = getUniqueStepName(steps, step.name)
  
  funnelApi.updateStep(route.params.organization, route.params.funnel, step.id, {
    name: step.name,
  }).then(() => {
    funnelStore.addFunnelJob(funnelStore.funnel)
    setTimeout(() => isUpdating.value = false, 800);
  })
}, 800)

function getUniqueStepName(steps, name, index = 1) {
  let nameHasDuplicates = steps.filter(step => step.name === name).length !== 0

  if (!nameHasDuplicates) {
    return name

  } else {
    let baseName = name.replace(/ \(\d+\)$/, '')
    let uniqueName = baseName+' ('+ index +')'
    return getUniqueStepName(steps, uniqueName, index + 1)
  }
}

const updateStepMetrics = debounce((step) => {
  // console.log('Updating step measurables...')
  isUpdating.value = true

  // Iterate over metrics and delete any that don't have the metric property set
  step.metrics.filter((element, index, array) => {
    if (!element.metric) {
      array.splice(index, 1)
    }
  })

  // Update funnel step
  funnelApi.updateStep(route.params.organization, route.params.funnel, step.id, {
    metrics: step.metrics,
  }).then(() => {
    funnelStore.addFunnelJob(funnelStore.funnel)
    setTimeout(() => isUpdating.value = false, 800);
  })
}, 800)

function handleDragEvent(e) {
  // console.log('Handing drag event...')
  isUpdating.value = true
  let event = e.moved || e.added

  funnelApi.updateStep(route.params.organization, route.params.funnel, event.element.id, {
    order: event.newIndex + 1
  }).then(() => {
    funnelStore.addFunnelJob(funnelStore.funnel)
    setTimeout(() => isUpdating.value = false, 500)
  })
}

function addStep() {
  // console.log('Adding step...')

  let name = getUniqueStepName(funnelStore.funnel.steps, 'New step') 
  // console.log('name; ', name)
  funnelApi.storeStep(route.params.organization, route.params.funnel, {
    name: name,
    description: null,
  }).then(response => {
    funnelStore.funnel.steps.push(response.data.data)
  })
}

function addMetric() {
  // console.log('Adding new metric to step...')

  activeStep.value.metrics.push({
    connection_id: funnelStore.funnel.connection.id,
    metric: '',
    showPicker: true,
  })
}

function deleteMetric(index) {
  // console.log('Deleting metric...')

  activeStep.value.metrics.splice(index, 1)
  updateStepMetrics(activeStep.value)
  funnelStore.addFunnelJob(funnelStore.funnel)
}

function deleteStep(index, id) {
  // console.log('Deleting step...')
  funnelApi.destroyStep(route.params.organization, route.params.funnel, id)
    .then(() => {
      funnelStore.funnel.steps.splice(index, 1)
      funnelStore.addFunnelJob(funnelStore.funnel)
    })
}

function toggleModal() { 
  isGenerateStepsModalOpen.value = !isGenerateStepsModalOpen.value 
}

function showFunnel() {
  // console.log('Loading funnel...')
  funnelStore.show(route.params.organization, route.params.funnel)
}

function selectStep(step) {
  if (authStore.user.role !== 'admin') return
  activeStepId.value = step.id
}

watch(selectedDateRange, () => {
  // console.log('Date range has changed...')
  funnelStore.addFunnelJob(funnelStore.funnel)
  resetReports()
})

onMounted(() => {
  showFunnel()
  listConnections()
})
</script>