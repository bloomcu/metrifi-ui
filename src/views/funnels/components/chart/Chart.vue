<template>
  <div>
    <div v-if="funnel && funnel.report" class="flex flex-col gap-4">
      <!-- Top -->
      <div class="flex flex-row gap-3">
        <!-- Assets card -->
        <div class="flex flex-1 overflow-hidden rounded-md bg-white py-3">
          <!-- Assets -->
          <div class="flex flex-1 flex-col gap-0.5 -pl-2">
            <div v-if="projection" @click="isEditConversionValueModalOpen = true" class="flex items-center gap-0.5 group cursor-pointer hover:text-violet-600">
              <p>Assets</p>
              <PencilIcon class="inline h-5 w-5 text-violet-500 p-1 rounded-md group-hover:bg-violet-50"/>
            </div>
            <p v-else>Assets</p>
            <span class="text-2xl font-medium">{{ funnel.report.assets.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }}</span>
          </div>

          <!-- Projected assets -->
          <div v-if="projection && projection.length" class="flex flex-1 flex-col gap-0.5 text-violet-500 border-l ml-4 pl-4">
            <p>Projected assets</p>
            <p class="flex items-center gap-1 text-2xl font-medium">
              {{ projectedAssets.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }}
              <span class="text-sm">({{ projectedAssetDifference }})</span>
            </p>
          </div>
        </div>

        <!-- Conversion card -->
        <div class="flex flex-1 overflow-hidden rounded-md bg-white p-3">
          <!-- Conversion -->
          <div class="flex flex-1 flex-col gap-0.5">
            <p>Conversion</p>
            <span class="text-2xl font-medium">{{ overallConversionRate }}%</span>
          </div>

          <!-- Projected conversion -->
          <div v-if="projection && projection.length" class="flex flex-1 flex-col gap-0.5 text-violet-500 border-l ml-4 pl-4">
            <p>Projected conversion</p>
            <p class="flex items-center gap-1 text-2xl font-medium">
              {{ projectedOverallConversionRate }}%
              <span class="text-sm">({{ projectedOverallConversionRateDifference }}%)</span>
            </p>
          </div>
        </div>
      </div>

      <!-- Chart Table -->
      <div class="table w-full border-collapse h-full">
        <div class="table-row h-[400px] align-bottom">
          <template v-for="(step, index) in funnel.report.steps" :key="step.id">
            <div class="table-cell relative p-0 w-[1%]">
              <div class="relative flex h-full items-end gap-0.5">
                <div class="relative flex-1 h-full">
                  <ChartBar 
                    :value="step.users" 
                    :max="maxValue" 
                    :zoom="zoom"
                    :updating="updating"
                    :enableControls="enableControls"
                    :enableStepExpansion="enableStepExpansion"
                    :enableGenerateRecommendation="enableGenerateRecommendation"
                    :enableCursorPointer="enableCursorPointer"
                    @stepSelected="emit('stepSelected', step)"
                    @stepDisabled="emit('stepDisabled', funnel, step)"
                    @stepExpanded="emit('stepExpanded', step)"
                    @generateRecommendation="emit('generateRecommendation', index)"
                  />
                </div>
              </div>
            </div>

            <div v-if="projection && projection.length && projection[index]" class="table-cell relative p-0 w-[1%]">
              <div class="relative flex h-full items-end gap-0.5">
                <!-- Projection Bar -->
                <div class="relative flex-1 h-full">
                  <ChartBar 
                    v-if="projection && projection.length && projection[index]"
                    :value="projection[index].users" 
                    :max="maxValue" 
                    :zoom="zoom"
                    :updating="updating"
                    :isProjection="true"
                    :enableCursorPointer="enableCursorPointer"
                    @stepSelected="emit('stepSelected', step)"
                  />
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Label Row -->
        <div class="table-row">
          <template v-for="(step, index) in funnel.report.steps" :key="step.id">
            <div class="table-cell align-middle px-1.5 pt-4 pb-1">
              <span class="font-semibold">{{ step.name }}</span>
            </div>

            <!-- Projection -->
            <div class="table-cell align-middle px-1.5 pt-4 pb-1" v-if="projection && projection.length && projection[index]">
              <span class="font-semibold">{{ projection[index].name }}</span>
            </div>
          </template>
        </div>

        <!-- Metric Row -->
        <div class="table-row text-[0.88em]">
          <template v-for="(step, index) in funnel.report.steps" :key="step.id">
            <div class="table-cell align-middle px-1.5 py-1.5 text-gray-700 border-b border-gray-200">
              <span class="font-semibold">{{ Number(step.users).toFixed() }}</span> users
            </div>

            <!-- Projection -->
            <div class="table-cell align-middle px-1.5 py-1 text-gray-700 border-b border-gray-200" v-if="projection && projection.length && projection[index]">
              <MetricModifier v-if="index == 0">
                <template #title>
                  <p class="cursor-pointer rounded-md border-0 px-1.5 py-1.5 text-violet-700 bg-violet-50 hover:ring-2 focus:ring-2 hover:ring-violet-600 focus:ring-violet-600">
                    <span class="font-semibold">{{ Number(projection[index].users).toFixed() }}</span> users
                    <PencilIcon class="inline ml-1 -mt-1 h-3 w-3 text-violet-500"/>
                  </p>
                </template>
                <AppInput v-model="projection[index].users" @input="calculateProjectionUsers()" type="number"/>
              </MetricModifier>

              <span v-else><span class="font-semibold">{{ Number(projection[index].users).toFixed() }}</span> users</span>
            </div>
          </template>
        </div>

        <!-- Conversion Rate Row -->
        <div class="table-row text-[0.88em]">
          <template v-for="(step, index) in funnel.report.steps" :key="step.id">
            <div class="table-cell align-middle px-1.5 py-1.5 text-gray-700 border-b border-gray-200">
              <template v-if="index !== 0">
                <span class="font-semibold">{{ Number(step.conversionRate).toFixed(2) }}%</span> conversion
              </template>

              <template v-else>-</template>
            </div>

            <!-- Projection -->
            <div class="table-cell align-middle px-1.5 py-1 text-gray-700 border-b border-gray-200" v-if="projection && projection.length && projection[index]">
              <MetricModifier v-if="index != 0">
                <template #title>
                  <p class="cursor-pointer rounded-md border-0 px-1.5 py-1.5 text-violet-700 bg-violet-50 hover:ring-2 focus:ring-2 hover:ring-violet-600 focus:ring-violet-600">
                    <span class="font-semibold">{{ Number(projection[index].conversionRate).toFixed(2) }}%</span> conversion
                    <PencilIcon class="inline ml-1 -mt-1 h-3 w-3 text-violet-500"/>
                  </p>
                </template>
                <AppInput v-model="projection[index].conversionRate" @input="calculateProjectionUsers()" type="number"/>
              </MetricModifier>

              <template v-else>-</template>
            </div>
          </template>
        </div>

        <!-- Assets Per User Row -->
        <div class="table-row text-[0.88em]">
          <template v-for="(step, index) in funnel.report.steps" :key="step.id">
            <div class="table-cell align-middle px-1.5 py-1.5 text-gray-700 border-b border-gray-200">
              <AppTooltipWrapper>
                <span class="font-semibold">{{ calculateAssetsPerUser(step.users, funnel.report.assets, true) }}</span> APU
                <AppTooltip text="Assets per user" />
              </AppTooltipWrapper>
            </div>

            <!-- Projection -->
            <div class="table-cell align-middle px-1.5 py-1.5 text-gray-700 border-b border-gray-200" v-if="projection && projection.length && projection[index]">
              <AppTooltipWrapper>
                <span class="font-semibold">{{ calculateAssetsPerUser(projection[index].users, projectedAssets, true) }}</span> APU
                <AppTooltip text="Assets per user" />
              </AppTooltipWrapper>
            </div>
          </template>
        </div>

        <!-- Profit Per User Row -->
        <div class="table-row text-[0.88em]">
          <template v-for="(step, index) in funnel.report.steps" :key="step.id">
            <div class="table-cell align-middle px-1.5 py-1.5 text-gray-700">
              <AppTooltipWrapper>
                <span class="font-semibold">{{ calculateProfitPerUser(step.users, funnel.report.assets, true) }}</span> PPU
                <AppTooltip text="Profit per user" />
              </AppTooltipWrapper>
            </div>

            <div class="table-cell align-middle px-1.5 py-1.5 text-gray-700" v-if="projection && projection.length && projection[index]">
              <AppTooltipWrapper>
                <span class="font-semibold">{{ calculateProfitPerUser(projection[index].users, projectedAssets, true) }}</span> PPU
                <AppTooltip text="Profit per user" />
              </AppTooltipWrapper>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- State: Loading (TODO: Make into component, put into Chart component) -->
    <div v-else class="flex gap-6 mt-6">
      <div class="flex-1">
        <div class="flex flex-col w-full">
          <div class="relative flex h-[400px]">
            <div class="animate-pulse flex flex-[8] gap-3 items-end">
              <div class="bg-gray-200 flex-1 h-full rounded-xl"></div>
              <div class="bg-gray-200 flex-1 h-60 rounded-xl"></div>
              <div class="bg-gray-200 flex-1 h-32 rounded-xl"></div>
            </div>
          </div>

          <div class="relative flex mt-2">
            <div class="animate-pulse flex flex-[8] gap-3">
              <div class="bg-gray-200 flex-1 h-4 rounded-xl"></div>
              <div class="bg-gray-200 flex-1 h-4 rounded-xl"></div>
              <div class="bg-gray-200 flex-1 h-4 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-[14rem]">
        <div class="animate-pulse bg-gray-200 flex-1 h-32 rounded-xl"></div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
import { PencilIcon } from '@heroicons/vue/24/solid'
import ChartBar from '@/views/funnels/components/chart/ChartBar.vue'
import AppInput from '@/app/components/base/forms/AppInput.vue'
import MetricModifier from '@/views/funnels/components/metrics/MetricModifier.vue'
import AppTooltip from '@/app/components/base/tooltips/AppTooltip.vue'
import AppTooltipWrapper from '@/app/components/base/tooltips/AppTooltipWrapper.vue'

const props = defineProps({
  funnel: Object,
  conversion_value: [Number, String],
  return_on_assets: [Number, String],
  startDate: String,
  endDate: String,
  zoom: Number,
  enableControls: false,
  enableStepExpansion: false,
  enableGenerateRecommendation: false,
  enableCursorPointer: false,
  updating: {
      type: Boolean,
      default: false
  },
})

const projection = inject('projection', null)
const isEditConversionValueModalOpen = inject('isEditConversionValueModalOpen', null)

const emit = defineEmits(['stepSelected', 'stepDisabled', 'stepExpanded', 'generateRecommendation'])

const calculateProjectionUsers = () => {
  projection.value.forEach((step, index) => {
      // Skip first step in funnel
      if (index === 0) return

      // Conversion rate cannot be higher than 100%
      if (step.conversionRate > 100) step.conversionRate = 100
      
      let users = (step.conversionRate * projection.value[index - 1].users) / 100

      step.users = users
  })
}

const calculateAssetsPerUser = (users, assets, format) => {
  let assetsPerUser = assets / users

  if (isNaN(assetsPerUser)) assetsPerUser = 0

  if (format) return assetsPerUser.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 2, maximumFractionDigits: 2})
  return assetsPerUser
}

// Calculate profit per user by multiplying the assets per user by ROAA (return on average assets) of 1%
const calculateProfitPerUser = (users, assets, format) => {
  let assetsPerUser = calculateAssetsPerUser(users, assets, false)
  let profitPerUser = assetsPerUser * (props.return_on_assets / 100)

  if (isNaN(profitPerUser)) profitPerUser = 0

  if (format) return profitPerUser.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 2, maximumFractionDigits: 2})
  return profitPerUser
}

const overallConversionRate = computed(() => {
  if (!props.funnel.report.steps.length) return 0.00

  let firstStepUsers = props.funnel.report.steps[0].users
  let lastStepUsers = props.funnel.report.steps[props.funnel.report.steps.length - 1].users
  let rate = (lastStepUsers / firstStepUsers) * 100

  if (isNaN(rate)) return 0.00
  return rate.toFixed(2)
})

const projectedOverallConversionRate = computed(() => {
  let firstStepUsers = projection.value[0].users
  let lastStepUsers = projection.value[projection.value.length - 1].users
  let rate = (lastStepUsers / firstStepUsers) * 100

  if (isNaN(rate)) return 0.00
  return rate.toFixed(2)
})

const projectedOverallConversionRateDifference = computed(() => {
  let diff = (projectedOverallConversionRate.value - overallConversionRate.value) / overallConversionRate.value * 100
  
  let direction = diff > 0 ? "+" : ""

  return direction + diff.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) // Format with 2 decimal places
})

const projectedAssets = computed(() => {
  // projected assets = number of projected users at eof * assets per conversion
  // But to do this you need to know the number of users at the end of the funnel, real users not rounded

  let users = projection.value[projection.value.length - 1].users
  let value = props.conversion_value
  let assets = users * value

  return (assets / 100)
})

const projectedAssetDifference = computed(() => {
  let diff = projectedAssets.value - props.funnel.report.assets

  let direction = diff > 0 ? "+" : ""

  return direction + diff.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0})
})

const maxValue = computed(() => {
  if (projection) {
      let funnelMax = Math.max(...props.funnel.report.steps.map(step => step.users))
      let projectionMax = Math.max(...projection.value.map(step => step.users))

      return Math.max(funnelMax, projectionMax)
  }
  
  return Math.max(...props.funnel.report.steps.map(step => step.users))
})
</script>