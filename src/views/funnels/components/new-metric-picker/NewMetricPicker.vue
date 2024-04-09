<template>
  <!-- <div ref="picker" class="absolute left-full top-0 translate-x-2 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all z-50 sm:rounded-lg"> -->
  <div ref="picker" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all z-50 sm:rounded-lg">
    <div class="divide-y divide-gray-200">
      <!-- Search -->
      <div class="relative">
          <MagnifyingGlassIcon class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" aria-hidden="true" />
          <input v-model="searchInput" ref="searchElement" class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm" placeholder="Search..." />
      </div>

      <!-- Tabs -->
      <div class="relative">
          <nav class="flex space-x-2 p-2" aria-label="Tabs">
            <button v-for="tab in tabs" :key="tab.name" @click.stop="selectTab(tab)" :class="selectedTab.metric == tab.metric ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-100' : ''" class="text-gray-500 rounded-md px-3 py-2 text-sm font-medium hover:text-gray-700 hover:bg-gray-100">
              <span>{{ tab.name }}</span>
            </button>
          </nav>
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
          <div class="min-h-[480px] min-w-[860px] h-[60vh] w-[60vw] flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
            <!-- <pre>{{ reports }}</pre> -->
            
            <table v-if="!isReportLoading && reports[selectedTab.metric]" class="min-w-full max-w-full divide-y divide-gray-300">
                <thead>
                  <tr class="divide-x divide-gray-200">
                      <th v-for="header in reports[selectedTab.metric].dimensionHeaders" scope="col" class="py-3 px-4 text-left">
                      <div class="text-sm font-semibold text-gray-900">{{ dictionary[header.name].displayName ?? header.name }}</div>
                      <div class="mt-0.5 text-xs italic font-normal text-gray-400">{{ header.name }}</div>
                      </th>
                      <th v-for="header in reports[selectedTab.metric].metricHeaders" scope="col" class="py-3 px-4 text-left">
                      <div class="text-sm font-semibold text-gray-900">{{ dictionary[header.name].displayName ?? header.name }}</div>
                      <div class="mt-0.5 text-xs italic font-normal text-gray-400">{{ header.name }}</div>
                      </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr 
                    v-if="selectedTab.metric === 'pageUsers'" 
                    v-for="row in filteredReportRows" 
                    @click="updateMetric({
                      metric: selectedTab.metric,
                      pagePath: row.dimensionValues[0].value,
                    })" 
                    class="divide-x divide-gray-200 cursor-pointer hover:bg-gray-50"
                  >
                      <td class="py-3 px-4 text-sm text-gray-500 break-all">{{ row.dimensionValues[0].value }}</td>
                      <td class="py-3 px-4 text-sm font-medium text-gray-900 break-all">{{ row.metricValues[0].value }}</td>
                  </tr>
                  
                  <tr 
                    v-if="selectedTab.metric === 'pagePlusQueryStringUsers'" 
                    v-for="row in filteredReportRows" 
                    @click="updateMetric({
                      metric: selectedTab.metric,
                      pagePathPlusQueryString: row.dimensionValues[0].value,
                    })" 
                    class="divide-x divide-gray-200 cursor-pointer hover:bg-gray-50"
                  >
                      <td class="py-3 px-4 text-sm text-gray-500 break-all">{{ row.dimensionValues[0].value }}</td>
                      <td class="py-3 px-4 text-sm font-medium text-gray-900 break-all">{{ row.metricValues[0].value }}</td>
                  </tr>

                  <tr 
                    v-if="selectedTab.metric === 'outboundLinkUsers'" 
                    v-for="row in filteredReportRows" 
                    @click="updateMetric({
                      metric: selectedTab.metric,
                      linkUrl: row.dimensionValues[0].value,
                      pagePath: row.dimensionValues[1].value,
                    })"
                    class="divide-x divide-gray-200 cursor-pointer hover:bg-gray-50"
                  >
                      <td class="py-3 px-4 text-sm text-gray-500 break-all">{{ row.dimensionValues[0].value }}</td>
                      <td  class="py-3 px-4 text-sm text-gray-500 break-all">{{ row.dimensionValues[1].value }}</td>
                      <td class="py-3 px-4 text-sm font-medium text-gray-900 break-all">{{ row.metricValues[0].value }}</td>
                  </tr>

                  <tr 
                    v-if="selectedTab.metric === 'formUserSubmissions'" 
                    v-for="row in filteredReportRows" 
                    @click="updateMetric({
                      metric: selectedTab.metric,
                      pagePath: row.dimensionValues[1].value,
                      formDestination: row.dimensionValues[2].value,
                      formId: row.dimensionValues[3].value,
                      formLength: row.dimensionValues[4].value,
                      formSubmitText: row.dimensionValues[5].value,
                    })" 
                    class="divide-x divide-gray-200 cursor-pointer hover:bg-gray-50"
                  >
                      <td class="py-3 px-4 text-sm text-gray-500 break-all">{{ row.dimensionValues[0].value }}</td> <!-- Event name -->
                      <td  class="py-3 px-4 text-sm text-gray-500 break-all">{{ row.dimensionValues[1].value ? row.dimensionValues[1].value : '(not set)'}}</td> <!-- Page path -->
                      <td  class="py-3 px-4 text-sm text-gray-500 break-all">{{ row.dimensionValues[2].value ? row.dimensionValues[2].value : '(not set)'}}</td> <!-- Form destination -->
                      <td  class="py-3 px-4 text-sm text-gray-500 break-all">{{ row.dimensionValues[3].value ? row.dimensionValues[3].value : '(not set)'}}</td> <!-- Form id -->
                      <td  class="py-3 px-4 text-sm text-gray-500 break-all">{{ row.dimensionValues[4].value ? row.dimensionValues[4].value : '(not set)'}}</td> <!-- Form length -->
                      <td  class="py-3 px-4 text-sm text-gray-500 break-all">{{ row.dimensionValues[5].value ? row.dimensionValues[5].value : '(not set)'}}</td> <!-- Form submit text -->
                      <td class="py-3 px-4 text-sm font-medium text-gray-900 break-all">{{ row.metricValues[0].value }}</td> <!-- Users -->
                  </tr>
                </tbody>
            </table>

            <div v-else-if="isReportLoading" class="animate-pulse space-y-4 p-4">
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
import { ref, computed, watch, onMounted } from 'vue'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { useGoogleAnalyticsReports } from '@/domain/services/google-analytics/composables/useGoogleAnalyticsReports'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { EyeIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  modelValue: { 
    type: Object,
    default: () => ({}),
  }
})

const metric = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function updateMetric(updatedMetric) {
  emit('update:modelValue', updatedMetric)
}

const { selectedDateRange } = useDatePicker()
const { selectedConnection } = useConnections()
const { reports, isReportLoading, runReport } = useGoogleAnalyticsReports()

const tabs = ref([
  { 
    name: 'Page users',
    metric: 'pageUsers',
    icon: EyeIcon,
  },
  { 
    name: 'Page + query string users',
    metric: 'pagePlusQueryStringUsers',
    icon: EyeIcon,
  },  
  { 
    name: 'Outbound link users',
    metric: 'outboundLinkUsers',
    icon: EyeIcon,
  },
  { 
    name: 'Form submission users',
    metric: 'formUserSubmissions',
    icon: EnvelopeIcon,
  },
])

const selectedTab = ref(tabs.value.find(tab => tab.metric === props.modelValue.metric))

const selectTab = (tab) => {
  selectedTab.value = tab
}

const picker = ref(null)
const searchInput = ref('')
const searchElement = ref()
// const loading = ref(true)
// const report = ref()

// const filteredReportRows = computed(() => {
//   return reports.value[measurablePickerTab.value].rows.filter(row => {
//     if (JSON.stringify(row.dimensionValues).includes(searchInput.value)) {
//       return row
//     }
//   })
// })

const filteredReportRows = computed(() => {
  return reports.value[selectedTab.value.metric].rows.filter(row => {
    if (JSON.stringify(row.dimensionValues).includes(searchInput.value)) {
      return row
    }
  })
})

// function runReport() {
//   loading.value = true

//   gaDataApi[selectedTab.value.report](selectedConnection.value.id, {
//     startDate: selectedDateRange.value.startDate,
//     endDate: selectedDateRange.value.endDate,
//     // contains: containsFilters.value.map(filter => filter)
//     // contains: containsFilters.value
//   }).then(response => {
//     if (response.data.data.error) {
//       console.log(response.data.data.error)
//       return
//     }
//     loading.value = false
//     report.value = response.data.data
//   })
// }

// function updateMeasurable(measurable) {
//   emit('update:modelValue', measurable)
//   closeMeasurablePicker()
// }

watch(selectedTab, () => {
  console.log('Selected tab changed...')

  if (reports.value[selectedTab.value.metric]) return

  runReport(
    selectedTab.value.metric, 
    selectedConnection.value.id,
    selectedDateRange.value.startDate,
    selectedDateRange.value.endDate,
  )
})

// onClickOutside((picker) => {
//   emit('close')
// })

onClickOutside(picker, () => {
  console.log('Clicked outside...')
  // closeMeasurablePicker()
  metric.value.showPicker = false
})

onMounted(() => {
  console.log('Mounted...')

  // setMeasurablePickerTab(props.activeReport)
  if (reports.value[props.modelValue.metric]) return

  runReport(
    selectedTab.value.metric, 
    selectedConnection.value.id,
    selectedDateRange.value.startDate,
    selectedDateRange.value.endDate,
  )

  // nextTick(() => {
  //  searchElement.value.focus()
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
    displayName: 'Events',
  },
  eventName: {
    displayName: 'Event',
  },
  'customEvent:form_destination': {
    displayName: 'Form destination',
  },
  'customEvent:form_id': {
    displayName: 'Form id',
  },
  'customEvent:form_length': {
    displayName: 'Form length',
  },
  'customEvent:form_submit_text': {
    displayName: 'Form submit text',
  },
}

const emit = defineEmits(['update:modelValue'])
</script>
  