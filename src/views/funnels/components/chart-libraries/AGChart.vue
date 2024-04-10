<template>
    <ag-charts-vue :options="options"></ag-charts-vue>
</template>

<script setup>
import { ref, computed } from 'vue'
import { AgChartsVue } from 'ag-charts-vue3'

const props = defineProps({
    funnels: Array,
})

function formatter({ value }) {
    console.log(value)
    return value
//   return value[0].toUpperCase() + value.substring(1);
};

const options = ref({
    legend: { 
        enabled: true,
        item: {
            label: { formatter }
        }
    },
    // Series: Defines which chart type and data to use
    series: [
        { 
            yName: 'Mortgage',
            type: 'line', 
            // fill: 'green',
            xKey: 'order', 
            yKey: 'conversion', 
            data: [
                { order: 'Step 1', step: 'Loans', users: 299, conversion: 100 },
                { order: 'Step 2', step: 'Mortgage', users: 14, conversion: 4.68 },
                { order: 'Step 3', step: 'Application starts', users: 1, conversion: 7.14 },
            ]
        },
        { 
            yName: 'Auto Loan',
            type: 'line', 
            // fill: 'blue',
            xKey: 'order', 
            yKey: 'conversion', 
            data: [
                { order: 'Step 1', step: 'Home equity', users: 53, conversion: 100 },
                { order: 'Step 2', step: 'Auto loan', users: 1, conversion: 35.79 },
                { order: 'Step 3', step: 'App completed', users: 6, conversion: 10.28 },
            ]
        },
    ],
});

const revenue = computed(() => {
    let users = props.report.steps[props.report.steps.length - 1].users
    let value = props.conversion_value
    let rev = users * value

    return (rev / 100).toLocaleString("en-US", {style:"currency", currency:"USD"});
})
</script>