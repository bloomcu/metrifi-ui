<template>
  <LayoutDefault width="full">
    <div class="flex flex-row gap-12">
      <aside class="basis-72 pr-6 border-r flex flex-col gap-6">
        Steps
      </aside>

      <main class="flex-1">
        <!-- 
          Vanilla bar chart
          Source: https://codepen.io/robstinson/pen/ZEpKvjM?editors=1000 
        -->
        <!-- <div class="flex items-end flex-grow w-full mt-2 space-x-2 sm:space-x-3">
          <div class="relative flex flex-col items-center flex-grow pb-5 group">
            <span class="absolute top-0 hidden -mt-6 text-xs font-bold group-hover:block">$37,500</span>
            <div class="relative flex justify-center w-full h-16 bg-indigo-400"></div>
            <span class="absolute bottom-0 text-xs font-bold">Jan</span>
          </div>
          <div class="relative flex flex-col items-center flex-grow pb-5 group">
            <span class="absolute top-0 hidden -mt-6 text-xs font-bold group-hover:block">$45,000</span>
            <div class="relative flex justify-center w-full h-20 bg-indigo-400"></div>
            <span class="absolute bottom-0 text-xs font-bold">Feb</span>
          </div>
        </div> -->

        <ApexChart type="bar" :options="chart.options" :series="chart.series"></ApexChart>
      </main>
    </div>

    <!-- TODO: Add loading state -->
  </LayoutDefault>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'
import ApexChart from "vue3-apexcharts";

const route = useRoute()
const funnel = ref()

const chart = ref({
  options: {
    colors: ['#4f46e5'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadiusApplication: "end",
        borderRadius: 12,
      },
    },
    chart: {
      id: 'funnel',
      animations: {
        enabled: true,
        easing: 'easein',
        speed: 600,
        animateGradually: {
            enabled: true,
            delay: 150
        },
        dynamicAnimation: {
            enabled: false,
            speed: 350
        }
      },
    },
    xaxis: {
      categories: [1991, 1992, 1993]
    }
  },
  series: [
    {
      name: 'steps',
      data: [30, 40, 45]
    }
  ]
})

function storeFunnelStep(step) {
  // funnelApi.storeStep(route.params.funnel, step).then(response => {
  //   funnel.value = response.data.data
  // })
}

onMounted(() => {
  funnelApi.show(route.params.organization, route.params.funnel).then(response => {
    funnel.value = response.data.data
  })
})
</script>
