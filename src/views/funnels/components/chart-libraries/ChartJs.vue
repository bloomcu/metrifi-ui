<template>
    <div>
        <Line :options="chart.options" :data="chart.data"></Line>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { Line } from 'vue-chartjs'
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const chart = ref({
    options: {
        responsive: true
    },
    data: {
        labels: ['Step 1', 'Step 2', 'Step 3'],
        datasets: [
            {
                label: 'Mortgage',
                data: [100, 4.68, 7.14],
                // fill: false,
                // borderColor: 'green'
            },
            {
                label: 'Auto Loan',
                data: [100, 35.79, 10.28],
                // fill: false,
                // borderColor: 'blue'
            }
        ]
    }
})
</script>