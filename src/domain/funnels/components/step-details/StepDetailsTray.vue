<template>
  <template v-if="isOpen">
    <!-- <div @click="toggleTray()" class="fixed inset-0 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-20"></div> -->

    <div class="fixed left-0 top-0 h-full w-96 p-8 transform rounded-r-3xl bg-white shadow-2xl ring-1 ring-gray-900/5">
      <!-- Tray header -->
      <div class="flex items-center justify-between">
        <h3 class="text-xl font-semibold">Step details</h3>
        <svg @click="toggleTray()" class="w-6 h-6 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </div>

      <!-- Tray content -->
      <div class="mt-4">
        <div class="flex flex-col gap-6">
          <div>
            <p class="font-medium text-gray-900">Step name</p>
            <p class="text-gray-500">{{ selectedStep.name }}</p>
          </div>

          <div>
            <p class="mb-1 font-medium text-gray-900">Metrics</p>

            <!-- Measurables -->
            <template v-for="(metric, index) in selectedStep.metrics">
              <!-- Page users metric -->
              <div v-if="metric.metric === 'pageUsers'" class="flex flex-col gap-4 bg-gray-50 rounded-md p-4 mb-2">
                <div class="border-b pb-4">
                  <p class="font-medium text-gray-900">Metric</p>
                  <p class="text-gray-500">{{ metric.metric }}</p>
                </div>

                <div class="overflow-x-auto">
                  <p class="font-medium text-gray-900">Page path</p>
                  <p class="text-gray-500">{{ metric.pagePath }}</p>
                </div>
              </div>

              <!-- Page plus query string users metric -->
              <div v-if="metric.metric === 'pagePlusQueryStringUsers'" class="flex flex-col gap-4 bg-gray-50 rounded-md p-4 mb-2">
                <div class="border-b pb-4">
                  <p class="font-medium text-gray-900">Metric</p>
                  <p class="text-gray-500">{{ metric.metric }}</p>
                </div>

                <div class="overflow-x-auto">
                  <p class="font-medium text-gray-900">Page path + query string</p>
                  <p class="text-gray-500">{{ metric.pagePathPlusQueryString }}</p>
                </div>
              </div>

              <!-- Outbound clicks metrics -->
              <div v-if="metric.metric === 'outboundLinkUsers'" class="flex flex-col gap-2 bg-gray-50 rounded-md p-2 mb-2">
                <div class="border-b pb-4">
                  <p class="font-medium text-gray-900">Metric</p>
                  <p class="text-gray-500">{{ metric.metric }}</p>
                </div>

                <div class="border-b pb-4 overflow-x-auto">
                  <p class="font-medium text-gray-900">Page path</p>
                  <p class="text-gray-500">{{ metric.pagePath }}</p>
                </div>
                
                <div class="overflow-x-auto">
                  <p class="font-medium text-gray-900">Link url</p>
                  <p class="text-gray-500">{{ metric.linkUrl }}</p>
                </div>
              </div>

              <!-- Form user submissions -->
              <div v-if="metric.metric === 'formUserSubmissions'" class="flex flex-col gap-2 bg-gray-50 rounded-md p-2 mb-2">
                <div class="border-b pb-4">
                  <p class="font-medium text-gray-900">Metric</p>
                  <p class="text-gray-500">{{ metric.metric }}</p>
                </div>

                <div class="border-b pb-4 overflow-x-auto">
                  <p class="font-medium text-gray-900">Page path</p>
                  <p class="text-gray-500">{{ metric.pagePath }}</p>
                </div>

                <div class="border-b pb-4 overflow-x-auto">
                  <p class="font-medium text-gray-900">Form destination</p>
                  <p class="text-gray-500">{{ metric.formDestination }}</p>
                </div>

                <div class="border-b pb-4 overflow-x-auto">
                  <p class="font-medium text-gray-900">Form length</p>
                  <p class="text-gray-500">{{ metric.formLength }}</p>
                </div>
                
                <div class="overflow-x-auto">
                  <p class="font-medium text-gray-900">Form submit text</p>
                  <p class="text-gray-500">{{ metric.formSubmitText }}</p>
                </div>
              </div>
            </template>
          </div>
        </div>

      </div>
    </div>
  </template>
</template>

<script setup>
import { useStepDetailsTray } from '@/domain/funnels/components/step-details/useStepDetailsTray'

const { selectedStep, isOpen, toggleTray } = useStepDetailsTray()
</script>
