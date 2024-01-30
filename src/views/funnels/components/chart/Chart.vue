<template>
    <div class="flex flex-col w-full">
        <div class="relative flex h-[400px]">
            <div class="absolute bottom-[1px] w-full h-full flex flex-col justify-between">
                <ChartLine v-for="percentage in percentages" :percentage="percentage" />
            </div>
            <div class="flex-[1]" />
            <div class="flex flex-[8] gap-3 z-0">
                <ChartBar v-for="item in data" :height="item.value / maxValue" />
            </div>
        </div>
        <div class="h-[10px]" />
        <div class="flex">
            <div class="flex-[1]" />
            <div class="flex flex-[8] gap-3">
                <ChartCircle v-for="(item, index) in data" :index="index + 1" />
            </div>
        </div>
        <div class="h-[50px]" />
        <div class="flex">
            <div class="flex-[1]" />
            <div class="flex flex-[8] flex-wrap gap-5">
                <p v-for="(item, index) in data" class="text-content font-light"><span class="font-bold">{{ index + 1 }}. </span>{{ item.name }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import ChartBar from './ChartBar.vue'
import ChartLine from './ChartLine.vue'
import ChartCircle from './ChartCircle.vue'

const percentages = [100, 75, 50, 25, 0]

const data = [
    { name: 'Foo', value: 80 },
    { name: 'Bar', value: 34 },
    { name: 'Baz', value: 12 },
]

const maxValue = Math.max(...data.map((item) => item.value))

// const props = defineProps({
//   title: {
//     type: String,
//   },
// })

// const isOpen = ref(false);

// const toggle = () => {
//     isOpen.value = !isOpen.value;
// };

// provide("isOpen", isOpen);

// const baseClasses = `
//   cursor-pointer
//   font-medium 
//   rounded-md
//   active:translate-y-px
//   disabled:pointer-events-none
//   disabled:opacity-50
//   disabled:shadow-none
//   focus-visible:outline-indigo-700
//   focus-visible:outline 
//   focus-visible:outline-2 
//   focus-visible:outline-offset-2
// `

// const variantClasses = `
//     text-gray-900 
//     bg-white 
//     hover:bg-gray-50 
//     ring-1 
//     ring-inset 
//     ring-gray-300 
//     shadow-sm
// `

// const sizeClasses = `
//     px-3 
//     py-2 
//     text-sm
// `
</script>