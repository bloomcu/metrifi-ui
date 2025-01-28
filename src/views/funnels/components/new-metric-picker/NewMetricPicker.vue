<template>
  <!-- <div ref="picker" class="absolute left-full top-0 translate-x-2 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all z-50 sm:rounded-lg"> -->
  <div ref="picker" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all z-50 sm:rounded-lg">
    <div class="divide-y divide-gray-200">
      <!-- Search -->
      <div class="relative">
          <MagnifyingGlassIcon class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" aria-hidden="true" />
          <input v-model="searchQuery" ref="searchElement" class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm" placeholder="Search..." />
      </div>

      <!-- Tabs -->
      <div class="relative">
          <nav class="flex space-x-2 p-2" aria-label="Tabs">
            <button v-for="tab in tabs" :key="tab.name" @click.stop="selectTab(tab)" :class="selectedTab.metric == tab.metric ? 'bg-violet-100 text-violet-500 hover:bg-violet-100' : ''" class="text-gray-500 rounded-md px-3 py-2 text-sm font-medium hover:text-gray-700 hover:bg-gray-100">
              <span>{{ tab.name }}</span>
            </button>
          </nav>
      </div>

      <div class="flex transform-gpu divide-x divide-gray-100" as="div">
          <!-- Table container -->
          <div class="min-h-[480px] min-w-[860px] h-[70vh] w-[80vw] flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
            <table v-if="!isReportLoading && reports[selectedTab.metric]" class="table-fixedmin-w-full max-w-full divide-y divide-gray-300">
                <thead>
                  <tr v-if="reports[selectedTab.metric].rows" class="divide-x divide-gray-200">
                      <th v-for="column in selectedTab.columns" scope="col" class="py-3 px-3 text-left">
                        <div class="text-sm font-semibold text-gray-900">
                          {{ column.displayName }}
                          <span v-if="column.name === 'totalUsers'">({{ reports[selectedTab.metric].totals[0].metricValues[0].value }})</span>
                        </div>
                      </th>
                  </tr>
                </thead>
                
                <tbody class="divide-y divide-gray-200">
                  <!-- Page users -->
                  <tr 
                    v-if="selectedTab.metric === 'pageUsers'" 
                    v-for="row in reports[selectedTab.metric].rows" 
                    @click="updateMetric({
                      metric: selectedTab.metric,
                      pagePath: row.dimensionValues[0].value,
                      hostname: row.dimensionValues[1].value,
                    })" 
                    class="divide-x divide-gray-200 cursor-pointer hover:bg-gray-50"
                  >
                      <!-- Page path -->
                      <td class="py-3 px-3 text-sm text-gray-500 break-all">{{ row.dimensionValues[0].value }}</td>
                      <!-- Hostname -->
                      <td  class="py-3 px-3 text-sm text-gray-500 break-all w-1/6">{{ row.dimensionValues[1].value }}</td>
                      <!-- Users -->
                      <td class="py-3 px-3 text-sm font-medium text-gray-900">{{ row.metricValues[0].value }}</td>
                  </tr>
                  
                  <!-- Page + query string users -->
                  <tr 
                    v-if="selectedTab.metric === 'pagePlusQueryStringUsers'" 
                    v-for="row in reports[selectedTab.metric].rows" 
                    @click="updateMetric({
                      metric: selectedTab.metric,
                      pagePathPlusQueryString: row.dimensionValues[0].value,
                      hostname: row.dimensionValues[1].value,
                    })" 
                    class="divide-x divide-gray-200 cursor-pointer hover:bg-gray-50"
                  >
                      <!-- Page path + query string -->
                      <td class="py-3 px-3 text-sm text-gray-500 break-all">{{ row.dimensionValues[0].value }}</td>
                      <!-- Hostname -->
                      <td  class="py-3 px-3 text-sm text-gray-500 break-all w-1/5">{{ row.dimensionValues[1].value }}</td>
                      <!-- Users -->
                      <td class="py-3 px-3 text-sm font-medium text-gray-900">{{ row.metricValues[0].value }}</td>
                  </tr>

                  <!-- Page title users -->
                  <tr 
                    v-if="selectedTab.metric === 'pageTitleUsers'" 
                    v-for="row in reports[selectedTab.metric].rows" 
                    @click="updateMetric({
                      metric: selectedTab.metric,
                      pageTitle: row.dimensionValues[0].value,
                      hostname: row.dimensionValues[1].value,
                    })" 
                    class="divide-x divide-gray-200 cursor-pointer hover:bg-gray-50"
                  >
                      <!-- Page title -->
                      <td class="py-3 px-3 text-sm text-gray-500 break-all">{{ row.dimensionValues[0].value }}</td>
                      <!-- Hostname -->
                      <td  class="py-3 px-3 text-sm text-gray-500 break-all w-1/6">{{ row.dimensionValues[1].value }}</td>
                      <!-- Users -->
                      <td class="py-3 px-3 text-sm font-medium text-gray-900">{{ row.metricValues[0].value }}</td>
                  </tr>

                  <!-- Outbound link users -->
                  <tr 
                    v-if="selectedTab.metric === 'outboundLinkUsers'" 
                    v-for="row in reports[selectedTab.metric].rows" 
                    @click="updateMetric({
                      metric: selectedTab.metric,
                      linkUrl: row.dimensionValues[0].value,
                      pagePath: row.dimensionValues[1].value,
                      hostname: row.dimensionValues[2].value,
                    })"
                    class="divide-x divide-gray-200 cursor-pointer hover:bg-gray-50"
                  >
                      <!-- Link -->
                      <td class="py-3 px-3 text-sm text-gray-500 break-all">{{ row.dimensionValues[0].value }}</td>
                      <!-- Page path -->
                      <td  class="py-3 px-3 text-sm text-gray-500 break-all w-2/6">{{ row.dimensionValues[1].value }}</td>
                      <!-- Hostname -->
                      <td  class="py-3 px-3 text-sm text-gray-500 break-all w-1/6">{{ row.dimensionValues[2].value }}</td>
                      <!-- Users -->
                      <td class="py-3 px-3 text-sm font-medium text-gray-900">{{ row.metricValues[0].value }}</td>
                  </tr>

                  <!-- Form submission users -->
                  <tr 
                    v-if="selectedTab.metric === 'formUserSubmissions'" 
                    v-for="row in reports[selectedTab.metric].rows" 
                    @click="updateMetric({
                      new: true,
                      metric: selectedTab.metric,
                      pagePath: row.dimensionValues[1].value,
                      formDestination: row.dimensionValues[2].value,
                      formId: row.dimensionValues[3].value,
                      formLength: row.dimensionValues[4].value,
                      formSubmitText: row.dimensionValues[5].value,
                      hostname: row.dimensionValues[6].value,
                    })" 
                    class="divide-x divide-gray-200 cursor-pointer hover:bg-gray-50"
                  >
                    <!-- Event name -->
                    <!-- <td class="py-3 px-3 text-sm text-gray-500 whitespace-nowrap w-[8%]">{{ row.dimensionValues[0].value }}</td>-->
                    
                    <!-- Page path -->
                    <td  class="py-3 px-3 text-sm text-gray-500 break-all w-[30%]">{{ row.dimensionValues[1].value ? row.dimensionValues[1].value : '(not set)'}}</td>
                    <!-- Form destination -->
                    <td  class="py-3 px-3 text-sm text-gray-500 break-all w-[30%]">{{ row.dimensionValues[2].value ? row.dimensionValues[2].value : '(not set)'}}</td>
                    <!-- Form id -->
                    <td  class="py-3 px-3 text-sm text-gray-500 break-all w-[14%]">{{ row.dimensionValues[3].value ? row.dimensionValues[3].value : '(not set)'}}</td>
                    <!-- Form length -->
                    <td  class="py-3 px-3 text-sm text-gray-500 break-all w-[1%]">{{ row.dimensionValues[4].value ? row.dimensionValues[4].value : '(not set)'}}</td>
                    <!-- Form submit text -->
                    <td  class="py-3 px-3 text-sm text-gray-500 whitespace-nowrap w-[5%]">{{ row.dimensionValues[5].value ? row.dimensionValues[5].value : '(not set)'}}</td>
                    <!-- Hostname -->
                    <td  class="py-3 px-3 text-sm text-gray-500 break-all w-1/6">{{ row.dimensionValues[6].value ? row.dimensionValues[6].value : '(not set)' }}</td>
                    <!-- Users -->
                    <td class="py-3 px-3 text-sm font-medium text-gray-900 break-all w-[1%]">{{ row.metricValues[0].value }}</td>
                  </tr>
                </tbody>
            </table>

            <div v-if="isReportLoading" class="animate-pulse space-y-4 p-4">
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

            <!-- Empty state: No results -->
            <div v-if="!isReportLoading && reports[selectedTab.metric] && !reports[selectedTab.metric].rows" class="text-center py-16 px-2">
              <NoSymbolIcon class="mx-auto w-8 text-gray-400"/>
              <h2 class="mt-2 text-lg font-medium text-gray-900">No results</h2>
              <p class="mt-1 text-gray-500">Try another date range or search term.</p>
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
import debounce from 'lodash.debounce'
import { ref, computed, watch, onMounted } from 'vue'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { useGoogleAnalyticsReports } from '@/domain/services/google-analytics/composables/useGoogleAnalyticsReports'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { EyeIcon, EnvelopeIcon, NoSymbolIcon } from '@heroicons/vue/24/outline'
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
const { reports, isReportLoading, runReport, resetReports } = useGoogleAnalyticsReports()

const tabs = ref({
  pageUsers: { 
    name: 'Page path',
    metric: 'pageUsers',
    icon: EyeIcon,
    columns: [
      { name: 'pagePath', displayName: 'Page path' },
      { name: 'hostname', displayName: 'Hostname' },
      { name: 'totalUsers', displayName: 'Users' },
    ],
  },
  pagePlusQueryStringUsers: { 
    name: 'Page path + query',
    metric: 'pagePlusQueryStringUsers',
    icon: EyeIcon,
    columns: [
      { name: 'pagePathPlusQueryString', displayName: 'Page path + query string' },
      { name: 'hostname', displayName: 'Hostname' },
      { name: 'totalUsers', displayName: 'Users' },
    ],
  },
  pageTitleUsers: { 
    name: 'Page title',
    metric: 'pageTitleUsers',
    icon: EyeIcon,
    columns: [
      { name: 'pageTitle', displayName: 'Page title' },
      { name: 'hostname', displayName: 'Hostname' },
      { name: 'totalUsers', displayName: 'Users' },
    ],
  },
  outboundLinkUsers: { 
    name: 'Outbound link',
    metric: 'outboundLinkUsers',
    icon: EyeIcon,
    columns: [
      { name: 'linkUrl', displayName: 'Link' },
      { name: 'pagePath', displayName: 'Page path' },
      { name: 'hostname', displayName: 'Hostname' },
      { name: 'totalUsers', displayName: 'Users' },
    ],
  },
  formUserSubmissions: { 
    name: 'Form submission',
    metric: 'formUserSubmissions',
    icon: EnvelopeIcon,
    columns: [
      // { name: 'eventName', displayName: 'Event name'},
      { name: 'pagePath', displayName: 'Page path' },
      { name: 'customEvent:form_destination', displayName: 'Form destination' },
      { name: 'customEvent:form_id', displayName: 'Id' },
      { name: 'customEvent:form_length', displayName: 'Fields' },
      { name: 'customEvent:form_submit_text', displayName: 'Text' },
      { name: 'hostname', displayName: 'Hostname' },
      { name: 'totalUsers', displayName: 'Users' },
    ],
  },
})

const selectedTab = ref(tabs.value['pageUsers'])

const selectTab = (tab) => {
  selectedTab.value = tab
}

const picker = ref(null)
const searchQuery = ref('')
const searchElement = ref()

function run() {
  runReport(
    selectedTab.value.metric, // Report type by metric
    selectedConnection.value.id, // Connection ID
    selectedDateRange.value.startDate, // Start date
    selectedDateRange.value.endDate, // End date
    searchQuery.value, // Query
  )
}

const debounceRun = debounce(() => {
  run()
}, 500)

watch(selectedTab, () => {
  console.log('Selected tab changed...')
  
  // If report has already been run, 
  // and query hasn't changed, don't run report again
  if (
    reports.value[selectedTab.value.metric] && 
    reports.value[selectedTab.value.metric].query === searchQuery.value
  ) return

  run()
})

watch(searchQuery, () => {
  console.log('Search input changed...')
  debounceRun()
})

onClickOutside(picker, () => {
  console.log('Clicked outside...')
  emit('update:modelValue', metric.value)
  metric.value.showPicker = false
})

onMounted(() => {
  console.log('Mounted...')

  resetReports()
  run()
})

const emit = defineEmits(['update:modelValue'])
</script>
  