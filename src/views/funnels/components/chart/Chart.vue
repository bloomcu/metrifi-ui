<template>
    <div v-if="funnel" class="flex gap-6 mt-6">
        <!-- Left -->
        <div class="flex-1">
            <!-- Bars -->
            <div class="flex flex-col w-full">
                <div class="relative flex h-[400px]">
                    <div class="absolute w-full h-full flex flex-col justify-between">
                        <ChartLine v-for="percentage in [100, 75, 50, 25, 0]" />
                    </div>

                    <div class="flex flex-[8] gap-3 z-0">
                        <template v-for="(step, index) in funnel.steps" >
                            <ChartBar 
                                :value="step.users" 
                                :max="maxValue" 
                                :zoom="zoom"
                                :updating="updating"
                                color="bg-indigo-600 hover:bg-indigo-700"
                                @click="emit('stepSelected', step)"
                            />

                            <ChartBar 
                                v-if="showProjection && projection[index]"
                                :value="projection[index].users" 
                                :max="maxValue" 
                                :zoom="zoom"
                                :updating="updating"
                                color="bg-indigo-400 hover:bg-indigo-500"
                                @click="emit('stepSelected', step)"
                            />
                        </template>
                        
                    </div>
                </div>

                <div class="h-[10px]" />

                <div class="flex flex-[8] gap-3">
                    <template v-for="(step, index) in funnel.steps">
                        <div @click="emit('stepSelected', step)" class="flex-1 text-sm">
                            <!-- Label: E.g., "Homepage" -->
                            <ChartLabel :name="step.name" class="mb-0.5"/>

                            <!-- Metric: E.g., "1,000 users" -->
                            <p class="pt-0.5 pb-1">{{ Number(step.users).toLocaleString() }} users</p>

                            <!-- Conversion rate: E.g., "100%" -->
                            <p v-if="index != 0">
                                {{ step.conversionRate }}%
                                <span>conversion rate</span>
                            </p>
                        </div>
                        
                        <div v-if="showProjection && projection[index]" @click="emit('stepSelected', step)" class="flex-1 text-sm">
                            <!-- Label: E.g., "Homepage" -->
                            <ChartLabel :name="projection[index].name" class="mb-0.5"/>

                            <!-- Metric: E.g., "1,000 users" -->
                            <!-- <p v-if="index == 0" class="cursor-pointer rounded-md border-0 -ml-1 pl-1 py-0.5 text-indigo-600 bg-indigo-50 hover:ring-2 focus:ring-2 hover:ring-indigo-600 focus:ring-indigo-600">
                                {{ Number(projection[index].users).toLocaleString() }} users
                                <PencilIcon class="inline ml-1 h-3 w-3 text-indigo-600"/>
                            </p> -->
                            <MetricModifier v-if="index == 0">
                                <template #title>
                                    <p class="cursor-pointer rounded-md border-0 -ml-1 pl-1 py-0.5 text-gray-900 bg-indigo-50 hover:ring-2 focus:ring-2 hover:ring-indigo-600 focus:ring-indigo-600">
                                        {{ Number(projection[index].users).toLocaleString() }} users
                                        <PencilIcon class="inline ml-1 h-3 w-3 text-indigo-600"/>
                                    </p>
                                </template>
                                <AppInput v-model="projection[index].users" @input="calculateProjectionUsers()" type="number"/>
                            </MetricModifier>

                            <p v-else class="py-0.5">
                                {{ Number(projection[index].users).toLocaleString() }} users
                            </p>

                            <!-- Conversion rate: E.g., "100%" -->
                            <!-- <p v-if="index != 0" class="cursor-pointer rounded-md border-0 -ml-1 pl-1 py-0.5 text-gray-900 bg-indigo-50 hover:ring-2 focus:ring-2 hover:ring-indigo-600 focus:ring-indigo-600">
                                {{ projection[index].conversionRate }}%
                                <span class="_text-xs">conversion rate</span>
                                <PencilIcon class="inline ml-1 h-3 w-3 text-indigo-600"/>
                            </p> -->
                            <MetricModifier v-if="index != 0">
                                <template #title>
                                    <p class="cursor-pointer rounded-md border-0 -ml-1 pl-1 py-0.5 text-gray-900 bg-indigo-50 hover:ring-2 focus:ring-2 hover:ring-indigo-600 focus:ring-indigo-600">
                                        {{ projection[index].conversionRate }}%
                                        <span>conversion rate</span>
                                        <PencilIcon class="inline ml-1 h-3 w-3 text-indigo-600"/>
                                    </p>
                                </template>
                                <AppInput v-model="projection[index].conversionRate" @input="calculateProjectionUsers()" type="number"/>
                            </MetricModifier>
                        </div>
                    </template>
                    
                </div>
            </div>
        </div>

        <!-- Right -->
        <div class="w-[14rem]">
            <!-- Revenue -->
            <div class="flex flex-col gap-1 text-center rounded-md bg-white border shadow p-4 mb-2">
                <!-- TODO: Add edit icon here. Opens modal. Can choose type: Total deposited vs Total loaned -->
                <!-- TODO: Next is calculate value of user at each step by dividing the value by users at each step. -->
                <p>Total value</p>
                <span class="text-3xl font-medium">{{ revenue }}</span>
                <!-- <p>conversion rate</p> -->

                <div v-if="showProjection" class="text-indigo-600 border-t mt-2 pt-2">
                    <p>Projected</p>
                    <span class="text-3xl font-medium mb-2">{{ projectedRevenue }}</span>
                </div>
            </div>

            <!-- Overall conversion rate -->
            <div class="flex flex-col gap-1 text-center rounded-md bg-white border shadow p-4">
                <p>Overall conversion rate</p>
                <span class="text-3xl font-medium">{{ overallConversionRate }}</span>

                <div v-if="showProjection" class="text-indigo-600 border-t mt-2 pt-2">
                    <p>Projected</p>
                    <span class="text-3xl font-medium">{{ projectedOverallConversionRate }}</span>
                </div>
            </div>

            <AppButton @click="toggleProjection()" variant="secondary" class="w-full mt-2">
                {{ showProjection ? 'Close projection' : 'Make projection' }}
            </AppButton>
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

    <!-- <pre>{{ funnel.steps }}</pre> -->
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFunnels } from '@/domain/funnels/composables/useFunnels'
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
    updating: {
        type: Boolean,
        default: false
    }
})

const { calculateFunnelConversions, calculateFunnelUsers } = useFunnels()

const showProjection = ref(false)
const projection = ref([
  {
    "order": 1,
    "name": "Loans",
    "users": "298",
    "conversionRate": "100"
  },
  {
    "order": 2,
    "name": "Auto loan",
    "users": "93",
    "conversionRate": "31.2"
  },
  {
    "order": 3,
    "name": "Application starts",
    "users": "7",
    "conversionRate": "7.53"
  }
])

const toggleProjection = () => {
    showProjection.value = !showProjection.value
}

// const calculateProjectionConversions = () => {
//     console.log('Calculating projection conversions...')

//     projection.value.forEach((step, index) => {
//         // First conversion rate is always 100%
//         if (index === 0) {
//             projection.value[0].conversionRate = '100'
//           return
//         }
        
//         let cr = (step.users / projection.value[index - 1]?.users)
        
//         if (cr === Infinity || isNaN(cr)) {
//             step.conversionRate = '0.00'
//             return
//         }

//         let formatted = cr * 100 // Get a percentage
//             formatted = formatted.toFixed(2) // Round to 2 decimal places
//             formatted = formatted.substring(0, 4) // Trim to 2 decimal places

//         step.conversionRate = formatted
//     })
// }

const calculateProjectionUsers = () => {
    console.log('Calculating projection users...')
    
    projection.value.forEach((step, index) => {
        // Skip first step in funnel
        if (index === 0) return

        // Conversion rate cannot be higher than 100%
        if (step.conversionRate > 100) step.conversionRate = 100
        
        let users = (step.conversionRate * projection.value[index - 1].users) / 100

        step.users = Math.round(users)
    })
}

const projectedOverallConversionRate = computed(() => {
    let firstStepUsers = projection.value[0].users
    let lastStepUsers = projection.value[projection.value.length - 1].users
    let rate = (lastStepUsers / firstStepUsers) * 100

    if (isNaN(rate)) return "0.00%"
    return rate.toFixed(2) + "%"
})

const projectedRevenue = computed(() => {
    let users = projection.value[projection.value.length - 1].users
    let value = props.conversion_value
    let rev = users * value

    return (rev / 100).toLocaleString("en-US", {style:"currency", currency:"USD"});
})

const emit = defineEmits(['stepSelected'])

const maxValue = computed(() => {
    // return Math.max(...props.funnel.steps.map(step => step.users))
    let funnelMax = Math.max(...props.funnel.steps.map(step => step.users))
    let projectionMax = Math.max(...projection.value.map(step => step.users))

    return Math.max(funnelMax, projectionMax)
})

const overallConversionRate = computed(() => {
    let firstStepUsers = props.funnel.steps[0].users
    let lastStepUsers = props.funnel.steps[props.funnel.steps.length - 1].users
    let rate = (lastStepUsers / firstStepUsers) * 100

    if (isNaN(rate)) return "0.00%"
    return rate.toFixed(2) + "%"
})

const revenue = computed(() => {
    let users = props.funnel.steps[props.funnel.steps.length - 1].users
    let value = props.conversion_value
    let rev = users * value

    return (rev / 100).toLocaleString("en-US", {style:"currency", currency:"USD"});
})
</script>