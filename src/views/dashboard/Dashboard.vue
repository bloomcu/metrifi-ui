<template>
  <LayoutWithSidebar>
    <template #topbar>
      <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Explore</h1>

      <div v-if="connections && connections.length" class="flex items-center gap-2">
        <!-- Connections -->
        <Dropdown class="w-60">
          <template #title>
            <div class="flex items-center">
              <svg class="w-5 h-5 mr-2" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
              {{ selectedConnection ? selectedConnection.name : 'Loading...' }}
            </div>
          </template>
          <button v-for="connection in connections" @click="selectedConnection = connection" :class="selectedConnection == connection ? 'bg-gray-50 text-indigo-600' : ''" class="w-full text-left rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
            {{ connection.name }}
          </button>
        </Dropdown>

        <!-- Date range -->
        <Dropdown>
          <template #title>
            <CalendarIcon  class="mr-2 h-5 w-5" />
            {{ selectedDateRange.label }} 
            <span class="text-gray-400 font-normal ml-1">({{ moment(selectedDateRange.startDate).format('MMM DD, YYYY') }} - {{ selectedDateRange.endDate }})</span>
          </template>
          <button v-for="dateRange in dateRangeOptions" @click="selectedDateRange = dateRange" :class="selectedDateRange == dateRange ? 'bg-gray-50 text-indigo-600' : ''" class="w-full text-left rounded-md p-2 text-sm leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600">
            {{ dateRange.label }}
          </button>
        </Dropdown>

        <!-- Export -->
        <AppButton variant="tertiary" size="base" @click="downloadCSV()" class="inline-flex items-center">
          <DocumentArrowDownIcon class="mr-1 h-5 w-5"/>
          Export
        </AppButton>
      </div>
    </template>

    <div v-if="report">
      <!-- Tabs -->
      <div class="sm:hidden mb-6">
        <select @change="" id="tabs" name="tabs" class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <option v-for="request in requests" :key="request.name" :selected="selectedRequest.report == request.report">{{ request.name }}</option>
        </select>
      </div>
      <div class="hidden sm:block mb-6">
        <div class="flex justify-between border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button v-for="request in requests" :key="request.name" @click="selectedRequest = request" :class="selectedRequest.report == request.report ? 'border-indigo-500 text-indigo-600' : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'" class="group inline-flex items-center border-b-2 pb-4 px-1 text-sm font-medium">
              <component :is="request.icon" :class="selectedRequest == request ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'" class="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
              <span>{{ request.name }}</span>
            </button>
          </nav>
          <div class="text-gray-400 text-sm">Showing {{ report.rows.length }} of {{ report.rowCount }} results</div>
        </div>
      </div>

      <!-- Table -->
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
          <tr v-for="row in report.rows" class="divide-x divide-gray-200 hover:bg-gray-50">
            <td v-for="value in row.dimensionValues" class="py-3 px-4 text-sm text-gray-500 break-all">{{ value.value }}</td>
            <td v-for="value in row.metricValues" class="py-3 px-4 text-sm font-medium text-gray-900 break-all">{{ value.value }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state: No report rows -->
      <div v-if="!loading && !report.rows" class="text-center bg-slate-50 rounded-2xl py-12 px-2">
        <NoSymbolIcon class="mx-auto w-8 text-gray-400"/>
        <h2 class="mt-2 text-lg font-medium text-gray-900">No results</h2>
        <p class="mt-1 text-gray-500">Try extending the date range</p>
      </div>
    </div> <!-- End state: Report exists -->

    <!-- State: Loading -->
    <div v-if="loading" class="animate-pulse space-y-4">
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

    <!-- Empty state: No connections -->
    <div v-if="connections && !connections.length" class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <CloudIcon class="mx-auto w-8 text-indigo-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-gray-900">No connections</h2>
      <p class="mt-1 mb-5 text-gray-500">A connection is needed to explore analytics.</p>
      <AppButton :to="{name: 'connections'}">Go to Connections</AppButton>
    </div>

    <!-- <pre v-if="report">{{ report }}</pre> -->
  </LayoutWithSidebar>
</template>

<script setup>
import moment from 'moment'
import { ref, toRaw, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'
import { CalendarIcon, EyeIcon, ArrowRightOnRectangleIcon, DocumentArrowDownIcon, CloudIcon, NoSymbolIcon } from '@heroicons/vue/24/outline'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'
import Dropdown from '@/views/dashboard/components/Dropdown.vue'

const route = useRoute()
const loading = ref(true)
const connections = ref()
const report = ref()

const selectedConnection = ref()

const dateRangeOptions = ref([
  {label: 'Yesterday',    startDate: moment().subtract(1, 'days').format('YYYY-MM-DD'),  endDate: 'yesterday'},
  {label: 'This week',    startDate: moment().startOf('week').format('YYYY-MM-DD'),      endDate: 'today'},
  // {label: 'Last week',    startDate: moment().subtract(1, 'weeks').format('YYYY-MM-DD'), endDate: 'yesterday'},
  {label: 'Last 7 days',  startDate: moment().subtract(7, 'days').format('YYYY-MM-DD'),  endDate: 'yesterday'},
  {label: 'Last 28 days', startDate: moment().subtract(28, 'days').format('YYYY-MM-DD'), endDate: 'yesterday'},
])

const selectedDateRange = ref(dateRangeOptions.value[2])

const requests = ref([
  { 
    name: 'Page views',
    report: 'page-views',
    icon: EyeIcon,
  },  
  { 
    name: 'Outbound clicks',
    report: 'outbound-clicks',
    icon: ArrowRightOnRectangleIcon,
  },
])

const selectedRequest = ref(requests.value[0])

function runReport() {
  loading.value = true

  if (selectedRequest.value.report == 'page-views') {
    fetchPageViews()
  } else if (selectedRequest.value.report == 'outbound-clicks') {
    fetchOutboundClicks()
  }
}

watch(selectedConnection, (connection) => {
  runReport()
})

watch(selectedDateRange, (dateRange) => {
  runReport()
})

watch(selectedRequest, (report) => {
  runReport()
})

onMounted(() => {
  // if (route.params.connection) {}

  connectionApi.index(route.params.organization).then(response => {
    connections.value = response.data.data
    selectedConnection.value = response.data.data[0]
    loading.value = false
  })
})

function fetchPageViews() {
  gaDataApi.fetchPageViews(selectedConnection.value.id, {
    startDate: selectedDateRange.value.startDate, 
    endDate: selectedDateRange.value.endDate 
  }).then(response => {
    if (response.data.data.error) {
      console.log(response.data.data.error)
      return
    }
    loading.value = false
    report.value = response.data.data
  })
}

function fetchOutboundClicks() {
  gaDataApi.fetchOutboundClicks(selectedConnection.value.id, {
    startDate: selectedDateRange.value.startDate, 
    endDate: selectedDateRange.value.endDate 
  }).then(response => {
    if (response.data.data.error) {
      console.log(response.data.data.error)
      return
    }
    loading.value = false
    report.value = response.data.data
  })
}

function makeCSV() {
  let csv = 'data:text/csv;charset=utf-8,';

  // Make headers
  report.value.dimensionHeaders.forEach(function(header) {
    csv += `${header.name},`;
  });

  report.value.metricHeaders.forEach(function(header) {
    csv += `${header.name}\n`;
  });

  // Make rows
  report.value.rows.forEach(function(row) {
    row.dimensionValues.forEach(function(dimension) {
      csv += `${dimension.value},`;
    });
    
    row.metricValues.forEach(function(metric) {
      csv += `${metric.value}`;
    });

    csv += '\n';
  });

  return csv;
}

function downloadCSV() {
  const csv = makeCSV();
  const encodedUri = encodeURI(csv);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${selectedRequest.value.name} - ${selectedConnection.value.name} - ${selectedDateRange.value.label}.csv`);
  document.body.appendChild(link); // Required for FF

  link.click();
}

const dictionary = {
  pagePath: {
    displayName: 'Page',
  },
  screenPageViews: {
    displayName: 'Views',
  },
  linkUrl: {
    displayName: 'Link',
  },
  linkDomain: {
    displayName: 'Domain',
  },
  pagePath: {
    displayName: 'Source page',
  },
  eventCount: {
    displayName: 'Clicks',
  }
}
</script>
