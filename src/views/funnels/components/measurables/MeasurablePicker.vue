<template>
  <div ref="picker" class="absolute left-[102%] top-[-50px] translate-x-2 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all z-50 sm:rounded-lg">
    <div class="divide-y divide-gray-200">
        <!-- Search -->
        <div class="relative">
            <MagnifyingGlassIcon class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            <input v-model="searchInput" ref="searchElement" class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm" placeholder="Search..." />
        </div>

        <!-- Tabs -->
        <div class="relative">
            <div class="flex justify-between items-center">
                <nav>
                    <button v-for="tab in tabs" :key="tab.name" @click="selectedTab = tab" :class="selectedTab.report == tab.report ? 'border-indigo-500 text-indigo-600' : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'" class="group inline-flex items-center border-b-2 py-4 px-4 text-sm font-medium">
                        <component :is="tab.icon" :class="selectedTab == tab ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'" class="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                        <span>{{ tab.name }}</span>
                    </button>
                </nav>
                <div v-if="report && report.rows" class="text-gray-400 text-sm mr-4">{{ report.rows.length }} of {{ report.rowCount }}</div>
            </div>
        </div>

        <div class="flex transform-gpu divide-x divide-gray-100" as="div">
            <!-- Left -->
            <!-- <div class="max-h-96 w-1/3 scroll-py-4 overflow-y-auto px-6 py-4">
                <h2 v-if="searchInput === ''" class="mb-4 mt-2 text-xs font-semibold text-gray-500">Recent searches</h2>
                <div class="-mx-2 text-sm text-gray-700">
                    <template v-for="person in searchInput === '' ? recent : filteredPeople">
                        <div class="group flex cursor-default select-none items-center rounded-md p-2">
                            <span class="ml-3 flex-auto truncate">John Doe</span>
                        </div>
                    </template>
                </div>
            </div> -->

            <!-- Right -->
            <div class="h-[50vh] w-[40vw] flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
                <table v-if="!loading && report.rows" class="min-w-full max-w-full divide-y divide-gray-300">
                    <thead>
                    <tr class="divide-x divide-gray-200">
                        <th v-for="header in report.dimensionHeaders" scope="col" class="py-3 px-4 text-left">
                        <div class="text-sm font-semibold text-gray-900">{{ dictionary[header.name].displayName ?? header.name }}</div>
                        <div class="mt-0.5 text-xs italic font-normal text-gray-400">{{ header.name }}</div>
                        </th>
                        <th v-for="header in report.metricHeaders" scope="col" class="py-3 px-4 text-left">
                        <div class="text-sm font-semibold text-gray-900">{{ dictionary[header.name].displayName ?? header.name }}</div>
                        <div class="mt-0.5 text-xs italic font-normal text-gray-400">{{ header.name }}</div>
                        </th>
                    </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                    <tr v-for="row in filteredReportRows" class="divide-x divide-gray-200 cursor-pointer hover:bg-gray-50">
                        <!-- <td v-for="value in row.dimensionValues" @click="emit('measurableSelected', value)" class="py-3 px-4 text-sm text-gray-500 break-all">{{ value.value }}</td> -->
                        <td v-for="value in row.dimensionValues" @click="updateMeasurable(value.value)" class="py-3 px-4 text-sm text-gray-500 break-all">{{ value.value }}</td>
                        <td v-for="value in row.metricValues" class="py-3 px-4 text-sm font-medium text-gray-900 break-all">{{ value.value }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- <div class="px-6 py-14 text-center text-sm sm:px-14">
            <p class="mt-4 font-semibold text-gray-900">No people found</p>
            <p class="mt-2 text-gray-500">We couldn’t find anything with that term. Please try again.</p>
        </div> -->
    </div>       
  </div>
  <!-- <teleport :to="measurablePickerTarget" :disabled="false"> -->
    <!-- ...the picker -->
  <!-- </teleport> -->
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { useMeasurablePicker } from '@/views/funnels/components/measurables/useMeasurablePicker'
// import useClickOutside from '@/app/composables/base/useClickOutside'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { EyeIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  modelValue: { 
    type: String
  },
  activeTab: {
    type: Number
  }
})

const { selectedDateRange } = useDatePicker()
const { selectedConnection } = useConnections()
const { closeMeasurablePicker } = useMeasurablePicker()

const tabs = ref([
  { 
    name: 'Page users',
    report: 'pageUsers',
    icon: EyeIcon,
  },
  { 
    name: 'Page + query string users',
    report: 'pagePlusQueryStringUsers',
    icon: EyeIcon,
  },  
  { 
    name: 'Outbound link users',
    report: 'outboundLinkUsers',
    icon: ArrowRightOnRectangleIcon,
  },
])

const picker = ref(null)
const selectedTab = ref(tabs.value[props.activeTab])
const searchInput = ref('')
const searchElement = ref()
const loading = ref(true)
const report = ref()

const filteredReportRows = computed(() => {
  return report.value.rows.filter(row => {
    if (JSON.stringify(row.dimensionValues).includes(searchInput.value)) {
      return row
    }
  })
})

function runReport() {
  loading.value = true

  gaDataApi[selectedTab.value.report](selectedConnection.value.id, {
    startDate: selectedDateRange.value.startDate,
    endDate: selectedDateRange.value.endDate,
    // contains: containsFilters.value.map(filter => filter)
    // contains: containsFilters.value
  }).then(response => {
    if (response.data.data.error) {
      console.log(response.data.data.error)
      return
    }
    loading.value = false
    report.value = response.data.data
  })
}

function updateMeasurable(measurable) {
  emit('update:modelValue', measurable)
  closeMeasurablePicker()
}

watch(selectedTab, () => {
  console.log('Request changed...')
  runReport()
})

// onClickOutside((picker) => {
//   emit('close')
// })

onClickOutside(picker, () => {
  closeMeasurablePicker()
})

onMounted(() => {
    runReport()
    console.log('mounted...')

    // nextTick(() => {
    //     searchElement.value.focus()
    // })
})

const dictionary = {
  pagePath: {
    displayName: 'Page path',
  },
  pagePathPlusQueryString: {
    displayName: 'Page path + query string',
  },
  screenPageViews: {
    displayName: 'Views',
  },
  totalUsers: {
    displayName: 'Users',
  },
  linkUrl: {
    displayName: 'Link',
  },
  linkDomain: {
    displayName: 'Domain',
  },
  eventCount: {
    displayName: 'Clicks',
  }
}

const emit = defineEmits(['update:modelValue'])
</script>
  