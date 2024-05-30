<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Benchmarks</h1>
      <!-- <AppButton @click="storeNewBenchmark" variant="secondary">
        Create blank benchmark
      </AppButton> -->
    </template>

    <!-- Filters -->
    <div class="flex gap-3 mb-4">
      <AppInput v-model="search" placeholder="Filter" class="w-4/12"/>
      <CategoryPicker v-model="category"/>
    </div>

    <!-- Benchmarks -->
    <table v-if="benchmarks && benchmarks.length" class="min-w-full table-fixed overflow-hidden divide-y divide-gray-300 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
      <thead>
        <tr class="">
          <th scope="col" class="py-3.5 pl-4 pr-4 sm:pl-6 text-left text-sm font-medium text-gray-900">Benchmark</th>
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">Category</th>
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">Bottom</th>
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">Median</th>
          <th scope="col" class="py-3.5 text-left text-sm font-medium text-gray-900">Top</th>
          <th scope="col" class="py-3.5 text-left text-sm font-medium text-gray-900">Calculated</th>
          <th scope="col" class="py-3.5"></th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">
        <tr 
          v-for="benchmark in filteredBenchmarks" 
          :key="benchmark.id" 
          @click="router.push({name: 'benchmark', params: {benchmark: benchmark.id}})" 
          class="hover:bg-gray-50 cursor-pointer"
        >
          <!-- Benchmark -->
          <td class="py-4 pr-4 text-sm w-[25%] sm:pl-6">
            <!-- <div class="flex-auto"> -->
              <p v-html="highlightSearchedText(benchmark.name)" class="mb-1 text-base font-medium leading-6 text-gray-900"></p>
            <!-- </div> -->
          </td>

          <!-- Category -->
          <td class="whitespace-nowrap py-4 pr-4 text-sm text-gray-400">
            <div class="flex items-center text-sm mr-2">
              {{ benchmark.category ? benchmark.category.title : '' }}
            </div>
          </td>

          <!-- Bottom -->
          <td class="whitespace-nowrap py-4 pr-4 text-sm text-gray-400">
            {{ benchmark.bottom }}%
          </td>

          <!-- Median -->
          <td class="whitespace-nowrap py-4 pr-4 text-sm text-gray-400">
            {{ benchmark.median }}%
          </td>

          <!-- Top -->
          <td class="whitespace-nowrap py-4 pr-4 text-sm text-gray-400">
            {{ benchmark.median }}%
          </td>

          <td class="whitespace-nowrap py-4 pr-4 text-sm text-gray-400">
            {{ moment(benchmark.calculated_at).fromNow() }}
          </td>

          <!-- Options -->
          <td scope="col" class="py-4 pr-4">
            <div class="flex justify-end gap-2">
              <!-- <AppButton @click.stop="replicateBenchmark(benchmark.id)" variant="tertiary">Make a copy</AppButton> -->
              <!-- <AppButton @click.stop="destroyBenchmark(benchmark.id)" variant="tertiary">Delete</AppButton> -->
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- State: Loading -->
    <div v-else-if="isBenchmarksLoading" class="animate-pulse space-y-4">
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
    
    <!-- Empty state: No benchmarks -->
    <div v-else class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <ChartBarIcon class="mx-auto h-10 w-10 text-indigo-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-gray-900">No benchmarks</h2>
      <p class="mt-1 text-gray-400">Get started by creating a benchmark.</p>
    </div>
  </LayoutWithSidebar>
</template>

<script setup>
import moment from 'moment'
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import useBenchmarks from '@/domain/benchmarks/composables/useBenchmarks'
import CategoryPicker from '@/app/components/category-picker/CategoryPicker.vue'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'

const router = useRouter()

const {
  benchmarks, 
  isBenchmarksLoading, 
  indexBenchmarks, 
  storeBenchmark, 
}  = useBenchmarks()

const search = ref(null)
const category = ref(null)
const filteredBenchmarks = computed(() => {
  if (!search.value) {
    return benchmarks.value
  }

  return benchmarks.value.filter(benchmark => {
    return benchmark.name.toLowerCase().indexOf(search.value.toLowerCase()) > -1
  })
})

function highlightSearchedText(text) {
  if (!search.value) return text
  return text.replaceAll(search.value, `<span style="background-color: #fde047; padding: 2px 5px; border-radius: 5px;">${search.value}</span>`)
}

function storeNewBenchmark() {
  storeBenchmark({
    name: 'New benchmark',
  })
}

// function replicateBenchmark(benchmarkId) {
//   benchmarkApi.replicate(route.params.organization, benchmarkId)
//     .then(response => {
//       benchmarks.value.unshift(response.data.data)
//     })
// }

watch(category, () => {
  indexBenchmarks({
    'filter[category.id]': category.value ? category.value.id : null
  })
})

onMounted(() => {
  indexBenchmarks()
})
</script>
