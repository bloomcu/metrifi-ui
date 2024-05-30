<template>
    <VueApexCharts :options="chart.options" :series="series"></VueApexCharts>
</template>

<script setup>
import { ref } from 'vue'
import VueApexCharts from "vue3-apexcharts";

const props = defineProps({
    categories: {
        type: Array,
        default: () => ['Step 1', 'Step 2', 'Step 3']
    },
    series: {
        type: Array,
        default: () => [
            { 
                name: 'Mortgage',
                data: [100, 4.68, 7.14]
            },
            { 
                name: 'Auto Loan',
                data: [100, 35.79, 10.28]
            },
        ]
    },
})

const chart = ref({
    options: {
        chart: {
            type: 'line',
            zoom: {
                enabled: false
            },
            // animations: {
            //     enabled: false
            // }
        },
        dataLabels: {
            enabled: true
        },
        // stroke: {
        //     curve: 'smooth'
        // },
        title: {
            text: 'Funnels',
            align: 'left'
        },
        // grid: {
        //     row: {
        //     colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        //     opacity: 0.5
        //     },
        // },
        xaxis: {
            categories: props.categories,
        }
    }
})
</script>