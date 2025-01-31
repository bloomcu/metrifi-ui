<template>
    <div class="mb-32">
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
                
            <!-- Barchart -->
            <div class="flex flex-col w-full">
                <div class="relative flex h-[400px]">
                    <div class="absolute w-full h-full flex flex-col justify-between">
                        <ChartLine v-for="percentage in [100, 75, 50, 25, 0]" />
                    </div>

                    <div class="flex flex-[8] z-0">
                        <template v-for="(step, index) in funnel.report.steps" :key="step.id">
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
                        </template>
                    </div>
                </div>

                <div class="h-[10px]" />

                <div class="flex flex-[8] gap-3">
                    <template v-for="(step, index) in funnel.report.steps">
                        <div class="flex-1 text-sm">
                            <!-- Label: E.g., "Homepage" -->
                            <ChartLabel :name="step.name" class="mb-0.5"/>

                            <!-- Metric: E.g., "1,000 users" -->
                            <p class="px-1.5 py-1">
                              <span class="font-semibold">{{ Number(step.users).toFixed() }}</span> users
                            </p>

                            <!-- Conversion rate: E.g., "100%" -->
                            <p v-if="index != 0" class="px-1.5 py-1">
                              <span class="font-semibold">{{ Number(step.conversionRate).toFixed(2) }}%</span> conversion
                            </p>

                            <!-- Assets per user -->
                            <p class="px-1.5 py-1">
                              <span class="font-semibold">{{ calculateAssetsPerUser(step.users, funnel.report.assets, true) }}</span> assets per user
                            </p>

                            <!-- Profit per user -->
                            <p class="px-1.5 py-1">
                              <span class="font-semibold">{{ calculateProfitPerUser(step.users, funnel.report.assets, 0.01, true) }}</span> profit per user
                            </p>
                        </div>
                        
                        <div v-if="projection && projection.length && projection[index]" class="flex-1 text-sm">
                            <!-- Label: E.g., "Homepage" -->
                            <ChartLabel :name="projection[index].name" class="mb-0.5"/>

                            <!-- Metric: E.g., "1,000 users" -->
                            <MetricModifier v-if="index == 0">
                                <template #title>
                                    <p class="cursor-pointer rounded-md border-0 px-1.5 py-1 text-gray-900 bg-violet-50 hover:ring-2 focus:ring-2 hover:ring-violet-600 focus:ring-violet-600">
                                      <span class="font-semibold">{{ Number(projection[index].users).toFixed() }}</span> users
                                      <PencilIcon class="inline ml-1 h-3 w-3 text-violet-500"/>
                                    </p>
                                </template>
                                <AppInput v-model="projection[index].users" @input="calculateProjectionUsers()" type="number"/>
                            </MetricModifier>
                            <p v-else class="px-1.5 py-1">
                              <span class="font-semibold">{{ Number(projection[index].users).toFixed() }}</span> users
                            </p>

                            <!-- Conversion rate: E.g., "100%" -->
                            <MetricModifier v-if="index != 0">
                                <template #title>
                                    <p class="cursor-pointer rounded-md border-0 px-1.5 py-1 text-gray-900 bg-violet-50 hover:ring-2 focus:ring-2 hover:ring-violet-600 focus:ring-violet-600">
                                        <!-- {{ projection[index].conversionRate }}% -->
                                        <span class="font-semibold">{{ Number(projection[index].conversionRate).toFixed(2) }}%</span> conversion
                                        <PencilIcon class="inline ml-1 h-3 w-3 text-violet-500"/>
                                    </p>
                                </template>
                                <AppInput v-model="projection[index].conversionRate" @input="calculateProjectionUsers()" type="number"/>
                            </MetricModifier>

                            <!-- Assets per user -->
                            <p class="px-1.5 py-1">
                              <span class="font-semibold">{{ calculateAssetsPerUser(projection[index].users, projectedAssets, true) }}</span> assets per user
                            </p>

                            <!-- Profit per user -->
                            <p class="px-1.5 py-1">
                              <span class="font-semibold">{{ calculateProfitPerUser(projection[index].users, projectedAssets, 0.01, true) }}</span> profit per user
                            </p>
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
import ChartLine from '@/views/funnels/components/chart/ChartLine.vue'
import ChartLabel from '@/views/funnels/components/chart/ChartLabel.vue'
import AppInput from '@/app/components/base/forms/AppInput.vue'
import MetricModifier from '@/views/funnels/components/metrics/MetricModifier.vue'

const props = defineProps({
    funnel: Object,
    conversion_value: [Number, String],
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

  if (format) return assetsPerUser.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0})
  return assetsPerUser
}

// Calculate profit per user by multiplying the assets per user by ROAA (return on average assets) of 1%
const calculateProfitPerUser = (users, assets, returnOnAssets, format) => {
  let assetsPerUser = calculateAssetsPerUser(users, assets, false)
  let profitPerUser = assetsPerUser * returnOnAssets

  if (format) return profitPerUser.toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0})
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