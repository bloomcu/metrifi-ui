<template>
    <div class="flex flex-col w-full">
        <div class="relative flex h-[400px]">
            <div class="absolute bottom-[1px] w-full h-full flex flex-col justify-between">
                <ChartLine v-for="percentage in percentages" :percentage="percentage" />
            </div>
            <div class="flex-[0.5]" />
            <div class="flex flex-[8] gap-3 z-0">
                <ChartBar v-for="item in data" :height="item.value / maxValue" />
                <!-- <ChartBar v-for="(item, index) in data" :index="index" :value="item.value" :max="maxValue" /> -->
            </div>
        </div>
        <div class="h-[10px]" />
        <div class="flex">
            <div class="flex-[0.5]" />
            <div class="flex flex-[8] gap-3">
                <ChartLabel v-for="(item, index) in data" :index="index" :name="item.name" />
            </div>
        </div>
    </div>
</template>

<script setup>
import ChartBar from '@/views/funnels/components/chart/ChartBar.vue'
import ChartLine from '@/views/funnels/components/chart/ChartLine.vue'
import ChartLabel from '@/views/funnels/components/chart/ChartLabel.vue'

const percentages = [100, 75, 50, 25, 0]

const data = [
    { name: 'Foo', value: 80 },
    { name: 'Bar', value: 34 },
    { name: 'Baz', value: 12 },
    { name: 'Biz', value: 4 },
]

const maxValue = Math.max(...data.map((item) => item.value))
</script>