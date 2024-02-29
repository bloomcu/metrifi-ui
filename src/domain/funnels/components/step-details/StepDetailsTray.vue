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
            <template v-for="(measurable, index) in selectedStep.measurables">
              <!-- Pageviews metrics -->
              <div v-if="measurable.metric === 'pageViews'" class="flex flex-col gap-4 bg-gray-50 rounded-md p-4 mb-2">
                <div class="border-b pb-4">
                  <p class="font-medium text-gray-900">Metric</p>
                  <p class="text-gray-500">{{ measurable.metric }}</p>
                </div>

                <div>
                  <p class="font-medium text-gray-900">Dimension</p>
                  <p class="text-gray-500">{{ measurable.measurable }}</p>
                </div>
              </div>

              <!-- Outbound clicks metrics -->
              <div v-if="measurable.metric === 'outboundClicks'" class="flex flex-col gap-2 bg-gray-50 rounded-md p-2 mb-2">
                <p>{{ measurable.metric }}</p>
                <p>{{ measurable.pagePath }}</p>
                <p>{{ measurable.measurable }}</p>
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
