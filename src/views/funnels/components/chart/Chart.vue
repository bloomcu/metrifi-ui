<template>
    <div class="flex flex-col w-full">
        <div class="relative flex h-[400px]">
            <div class="absolute w-full h-full flex flex-col justify-between">
                <ChartLine v-for="percentage in [100, 75, 50, 25, 0]" :percentage="percentage" />
            </div>
            <div class="flex-[0.5]" />
            <div class="flex flex-[8] gap-3 z-0">
                <ChartBar v-for="value in data" :value="value" :max="maxValue" :zoom="zoom"/>
            </div>
        </div>
        <div class="h-[10px]" />

        <!-- Label: E.g., "Homepage" -->
        <div class="flex mb-0.5">
            <div class="flex-[0.5]"/>
            <div class="flex flex-[8] gap-3">
                <ChartLabel v-for="(label, index) in labels" :name="label" />
            </div>
        </div>

        <!-- Metric: E.g., "1,000 Page views" -->
        <div class="flex mb-0.5">
            <div class="flex-[0.5]"/>
            <div class="flex flex-[8] gap-3">
                <div v-for="value in data" class="flex-1 flex text-sm">{{ value ? value : 0 }} page views</div>
            </div>
        </div>

        <!-- Conversion rate: E.g., "100%" -->
        <div class="flex">
            <div class="flex-[0.5]"/>
            <div class="flex flex-[8] gap-3">
                <div v-for="conversion in conversions" class="flex-1 flex text-sm first:opacity-0">{{ conversion }}% conversion</div>
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
    steps: Array,
    zoom: Number,
})

const labels = computed(() => props.steps.map(step => step.name))

const data = computed(() => props.steps.map(step => Number(step.total).toLocaleString()))

const maxValue = computed(() => Math.max(...props.steps.map((step) => step.total)))

const conversions = computed(() => {
    let steps = props.steps

    let array = []
        array.push(100) // First conversion rate is always 100%

    steps.forEach((step, index) => {
        let cr = (steps[index + 1]?.total / step.total)

        if (isNaN(cr)) return
        
        if (cr === Infinity) {
            array.push(0)
            return
        }

        let formatted = cr * 100 // Get a percentage
            formatted = formatted.toFixed(2) // Round to 2 decimal places
            formatted = formatted.substring(0, 4) // Trim to 2 decimal places

        array.push(formatted)
    })

    return array
})
</script>