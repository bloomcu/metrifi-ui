<template>
  <LayoutWithSidebar>
    <!-- Welcome -->
    <div class="flex items-center mb-8" v-if="benchmark">
      <h2 class="mb-2 text-3xl font-medium text-gray-900">{{ benchmark.name }}</h2>
      <div class="flex flex-1 justify-end gap-3 w-full">
        <!-- Category -->
        <CategoryPicker v-model="benchmark.category" @update:modelValue="updateCategory()" class="w-4/12"/>

        <!-- Calculate -->
        <AppButton variant="secondary" size="base" @click="calculateBenchmark(benchmark.id)" :loading="isBenchmarkCalculating" class="inline-flex items-center">
          Re-calculate
        </AppButton>
      </div>
    </div>

    <!-- Step tabs -->
    <AppCard v-if="benchmark" padding="none" class="flex mb-6">
      <VueApexCharts :options="chart.options" :series="series"></VueApexCharts>
    </AppCard>

    <pre v-if="benchmark">{{ series }}</pre>
  </LayoutWithSidebar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import VueApexCharts from "vue3-apexcharts";
import useBenchmarks from '@/domain/benchmarks/composables/useBenchmarks'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'
import CategoryPicker from '@/app/components/category-picker/CategoryPicker.vue'

const route = useRoute()
const { benchmark, showBenchmark, updateBenchmark, calculateBenchmark, isBenchmarkCalculating } = useBenchmarks()

function updateCategory() {
  updateBenchmark(benchmark.value.id, { category_id: benchmark.value.category.id })
}

// let series = ref([{
//   name: 'Conversions',
//   data: [
//     benchmark.bottom,
//     benchmark.median,
//     benchmark.top,
//   ]
// }])

let series = computed(() => {
  return [{
    name: 'Conversions',
    data: [
      benchmark.value.bottom,
      benchmark.value.median,
      benchmark.value.top,
    ]
  }]
})

const chart = ref({
    options: {
        chart: {
            type: 'line',
            zoom: { enabled: false },
        },
        xaxis: {
            categories: ['Bottom 25%', 'Median', 'Top 25%'],
        },
        // yaxis: {
        //     title: {
        //         text: 'Conversion Rate (%)'
        //     }
        // },
        dataLabels: {
            enabled: true
        },
        // title: {
        //     text: 'Funnels',
        //     align: 'left'
        // },
        // stroke: {
        //     curve: 'smooth'
        // },
        // grid: {
        //     row: {
        //     colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        //     opacity: 0.5
        //     },
        // },
    }
})

onMounted(() => {
  showBenchmark(route.params.benchmark)
})
</script>
