<template>
    <div class="flex flex-col w-full">
        <div class="relative flex h-[400px]">
            <div class="absolute w-full h-full flex flex-col justify-between">
                <ChartLine v-for="percentage in percentages" :percentage="percentage" />
            </div>
            <div class="flex-[0.5]" />
            <div class="flex flex-[8] gap-3 z-0">
                <!-- <ChartBar v-for="value in data" :value="value" :height="value / maxValue" /> -->
                <ChartBar v-for="value in data" :value="value" :max="maxValue" :zoom="zoom"/>
                <!-- <ChartBar v-for="(item, index) in data" :index="index" :value="item.value" :max="maxValue" /> -->
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
                <div v-for="value in data" class="flex-1 flex text-sm">{{ value ? value.toLocaleString() : 0 }} page views</div>
            </div>
        </div>

        <!-- Conversion rate: E.g., "100%" -->
        <div class="flex">
            <div class="flex-[0.5]"/>
            <div class="flex flex-[8] gap-3">
                <div v-for="conversion in conversions" class="flex-1 flex text-sm">{{ conversion ? conversion + ' conversion' : '' }}</div>
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
    zoom: '',
    metric: {
        type: String,
    },
    labels: {
        type: Array,
    },
    data: {
        type: Array,
    },
    conversions: {
        type: Array,
    },
})

const percentages = [100, 75, 50, 25, 0]

const maxValue = computed(() => {
    return Math.max(...props.data)
    // return Math.max(...props.data.map((value) => value))
})
</script>