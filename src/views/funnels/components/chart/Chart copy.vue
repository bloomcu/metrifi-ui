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
                        <ChartBar 
                            v-for="step in funnel.steps" 
                            :value="step.users" 
                            :max="maxValue" 
                            :zoom="zoom"
                            :updating="updating"
                            @click="emit('stepSelected', step)"
                        />
                    </div>
                </div>

                <div class="h-[10px]" />

                <div class="flex flex-[8] gap-3">
                    <div v-for="(step, index) in funnel.steps" @click="emit('stepSelected', step)" class="flex-1 text-sm cursor-pointer hover:text-indigo-600">
                        <!-- Label: E.g., "Homepage" -->
                        <ChartLabel :name="step.name" />

                        <!-- Metric: E.g., "1,000 users" -->
                        <p>{{ Number(step.users).toLocaleString() }} users</p>
                        <!-- <AppInput v-model="step.users" @input="calculateFunnelConversions(funnel)" type="number"/> -->

                        <!-- Conversion rate: E.g., "100%" -->
                        <p v-if="index != 0">{{ step.conversionRate }}% conversion rate</p>
                        <!-- <AppInput v-if="index != 0" v-model="step.conversionRate" @input="calculateFunnelUsers(funnel)" type="number"/> -->
                    </div>
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
            </div>

            <!-- Overall conversion rate -->
            <div class="flex flex-col gap-1 text-center rounded-md bg-white border shadow p-4">
                <p>Overall</p>
                <span class="text-3xl font-medium">{{ overallConversionRate }}</span>
                <p>conversion rate</p>
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

    <!-- <pre>{{ funnel.steps }}</pre> -->
</template>

<script setup>
import { ref, computed } from 'vue'
import ChartBar from '@/views/funnels/components/chart/ChartBar.vue'
import ChartLine from '@/views/funnels/components/chart/ChartLine.vue'
import ChartLabel from '@/views/funnels/components/chart/ChartLabel.vue'
import { useFunnels } from '@/domain/funnels/composables/useFunnels'
import AppInput from '@/app/components/base/forms/AppInput.vue'

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

const projection = ref([
  {
    "order": 1,
    "name": "Loans",
    "users": "500",
    "conversionRate": "100"
  },
  {
    "order": 2,
    "name": "Auto loan",
    "users": "250",
    "conversionRate": "50"
  },
  {
    "order": 3,
    "name": "Application starts",
    "users": "125",
    "conversionRate": "50"
  }
])

const emit = defineEmits(['stepSelected'])

const maxValue = computed(() => {
    return Math.max(...props.funnel.steps.map(step => step.users))
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