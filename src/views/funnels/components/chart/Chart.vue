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
                            v-for="step in funnel.steps" 
                            :value="Number(step.total).toLocaleString()" 
                            :max="maxValue" 
                            :zoom="zoom"
                            @click="emit('stepSelected', step)"
                        />
                    </div>
                </div>

                <div class="h-[10px]" />

                <div class="flex flex-[8] gap-3">
                    <div v-for="(step, index) in funnel.steps" @click="emit('stepSelected', step)" class="flex-1 text-sm cursor-pointer hover:text-indigo-600">
                        <!-- Label: E.g., "Homepage" -->
                        <ChartLabel :name="step.name" />

                        <!-- Metric: E.g., "1,000 Page views" -->
                        <p>{{ step.total }} events</p>

                        <!-- Conversion rate: E.g., "100%" -->
                        <p v-if="index != 0">{{ conversions[index] }}% conversion rate</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right -->
        <div class="w-[14rem]">
            <!-- Overall conversion rate -->
            <div class="flex flex-col gap-1 text-center rounded-md bg-white border shadow p-4">
                <p>Overall</p>
                <span class="text-3xl font-medium">{{ overallConversionRate }}%</span>
                <p>conversion rate</p>
            </div>
        </div>
    </div>

</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
// import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'
import ChartBar from '@/views/funnels/components/chart/ChartBar.vue'
import ChartLine from '@/views/funnels/components/chart/ChartLine.vue'
import ChartLabel from '@/views/funnels/components/chart/ChartLabel.vue'

const props = defineProps({
    funnel: Object,
    startDate: String,
    endDate: String,
    zoom: Number,
})

const emit = defineEmits(['stepSelected'])

const isReporting = ref(false)

const labels = computed(() => props.funnel.steps.map(step => step.name))
const data = computed(() => props.funnel.steps.map(step => Number(step.total).toLocaleString()))
const maxValue = computed(() => Math.max(...props.funnel.steps.map((step) => step.total)))

const conversions = computed(() => {
    let steps = props.funnel.steps

    let array = []
        array.push(100) // First conversion rate is always 100%

    steps.forEach((step, index) => {
        let cr = (steps[index + 1]?.total / step.total)
        
        if (cr === Infinity || isNaN(cr)) {
            array.push('0.00')
            return
        }

        let formatted = cr * 100 // Get a percentage
            formatted = formatted.toFixed(2) // Round to 2 decimal places
            formatted = formatted.substring(0, 4) // Trim to 2 decimal places

        array.push(formatted)
    })

    return array
})

const overallConversionRate = computed(() => {
  let steps = props.funnel.steps
  if (!steps.length) return '0.00'
  
  let lastStep = steps[steps.length - 1]
  let firstStep = steps[0]
  let ocr = (lastStep.total / firstStep.total)
  if (!ocr || ocr === Infinity) return '0.00'

  let formatted = ocr * 100 // Get a percentage
      formatted = formatted.toFixed(2) // Round to 2 decimal places
      formatted = formatted.substring(0, 4) // Trim to 2 decimal places
  
  return formatted
})

// watch(props.funnel.steps, (old, newValue) => {
//     console.log(
//         "Watch props.selected function called with args:",
//         old,
//         newValue
//     );
// }, { deep: true });

// watch(() => props.funnel, 
//   (funnel) => {
//     funnel.steps.forEach((step) => {
//       console.log(step)
//     })
//   },
//   {deep: true}
// );

// function runReport() {
//   console.log('Running report...')
//   let funnel = props.funnel

//   if (!funnel.steps.length) return

//   isReporting.value = true

//   // Iterate each step
//   let stepsProcessed = 0
//   funnel.steps.forEach((step) => {

//     if (!step.measurables.length) { 
//       step.total = '0'
//       return
//     }

//     // Report: Page views
//     if (step.measurables[0].metric === 'pageViews') {
//       gaDataApi.fetchPageViews(funnel.connection_id, {
//         startDate: props.startDate,
//         endDate: props.endDate,
//         pagePaths: step.measurables.map(measurable => measurable.measurable),
//       }).then(response => {
//         if (response.data.data.error) {
//           console.log(response.data.data.error)
//           return
//         }

//         // Set total for this step
//         let report = response.data.data
//         step.total = report.totals[0].metricValues ? report.totals[0].metricValues[0].value : 0
//         stepsProcessed++;
        
//         if (stepsProcessed === funnel.steps.length) {
//             // isReporting.value = false
//             stepsProcessed = 0
//         }
//       }) // End GA page views report
//     }

//     // Report outbound clicks
//     if (step.measurables[0].metric === 'outboundClicks') {
//       gaDataApi.fetchOutboundClicksByPagePath(funnel.connection_id, {
//         startDate: props.startDate,
//         endDate: props.endDate,
//         pagePath: step.measurables[0].pagePath,
//         outboundLinkUrls: step.measurables.map(measurable => measurable.measurable),
//       }).then(response => {
//         if (response.data.data.error) {
//           console.log(response.data.data.error)
//           return
//         }

//         // Set total for this step
//         let report = response.data.data
//         // console.log(report)
//         step.total = report.total
//         stepsProcessed++;
        
//         if (stepsProcessed === funnel.steps.length) {
//         //   isReporting.value = false
//           stepsProcessed = 0
//         }
//       }) // End GA outbound clicks report
//     }
//   }) // End foreach on funnel steps

//   setTimeout(() => isReporting.value = false, 800)
// }

// onMounted(() => {
//   runReport()
// })
</script>