<template>
    <div class="flex gap-6 mt-6">
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
                            v-for="step in report.steps" 
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
                    <div v-for="(step, index) in report.steps" @click="emit('stepSelected', step)" class="flex-1 text-sm cursor-pointer hover:text-indigo-600">
                        <!-- Label: E.g., "Homepage" -->
                        <ChartLabel :name="step.name" />

                        <!-- Metric: E.g., "1,000 Page views" -->
                        <p>{{ Number(step.users).toLocaleString() }} users</p>

                        <!-- Conversion rate: E.g., "100%" -->
                        <!-- <p v-if="index != 0">{{ conversions[index] }}% conversion rate</p> -->
                        <p v-if="step.conversionRate">{{ step.conversionRate }} conversion rate</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right -->
        <div class="w-[14rem]">
            <!-- Overall conversion rate -->
            <div class="flex flex-col gap-1 text-center rounded-md bg-white border shadow p-4">
                <p>Overall</p>
                <span class="text-3xl font-medium">{{ report.overallConversionRate }}</span>
                <p>conversion rate</p>
            </div>
        </div>
    </div>

</template>

<script setup>
import { computed } from 'vue'
import ChartBar from '@/views/funnels/components/chart/ChartBar.vue'
import ChartLine from '@/views/funnels/components/chart/ChartLine.vue'
import ChartLabel from '@/views/funnels/components/chart/ChartLabel.vue'

const props = defineProps({
    report: Object,
    startDate: String,
    endDate: String,
    zoom: Number,
    updating: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['stepSelected'])

const maxValue = computed(() => Math.max(...props.report.steps.map((step) => step.users)))

// const conversions = computed(() => {
//     let steps = props.funnel.steps

//     let array = []
//         array.push(100) // First conversion rate is always 100%

//     steps.forEach((step, index) => {
//         let cr = (steps[index + 1]?.total / step.total)
        
//         if (cr === Infinity || isNaN(cr)) {
//             array.push('0.00')
//             return
//         }

//         let formatted = cr * 100 // Get a percentage
//             formatted = formatted.toFixed(2) // Round to 2 decimal places
//             formatted = formatted.substring(0, 4) // Trim to 2 decimal places

//         array.push(formatted)
//     })

//     return array
// })

// const overallConversionRate = computed(() => {
//   let steps = props.funnel.steps
//   if (!steps.length) return '0.00'
  
//   let lastStep = steps[steps.length - 1]
//   let firstStep = steps[0]
//   let ocr = (lastStep.total / firstStep.total)
//   if (!ocr || ocr === Infinity) return '0.00'

//   let formatted = ocr * 100 // Get a percentage
//       formatted = formatted.toFixed(2) // Round to 2 decimal places
//       formatted = formatted.substring(0, 4) // Trim to 2 decimal places
  
//   return formatted
// })
</script>