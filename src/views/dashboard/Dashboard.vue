<template>
  <LayoutWithSidebar>
    <template #topbar>
      <div class="flex items-center gap-3">
        <!-- Connections -->
        <Dropdown>
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
      </div>

      <!-- Export button -->
      <button @click="" class="group inline-flex items-center text-sm text-gray-500 hover:text-indigo-700">
        <DocumentArrowDownIcon class="mr-1 h-5 w-5"/>
        Export
      </button>
    </template>

    <div v-if="report && report.rows">
      <!-- Tabs -->
      <div class="sm:hidden mb-6">
        <!-- Use an "onChange" listener to redirect the user to the selected tab URL. -->
        <select id="tabs" name="tabs" class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <option v-for="request in requests" :key="request.name" :selected="request.current">{{ request.name }}</option>
        </select>
      </div>
      <div class="hidden sm:block mb-6">
        <div class="flex border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <button v-for="request in requests" :key="request.name" @click="selectedRequest = request" :class="selectedRequest == request ? 'border-indigo-500 text-indigo-600' : 'border-transparent hover:border-gray-300 text-gray-500 hover:text-gray-700'" class="group inline-flex items-center border-b-2 pb-4 px-1 text-sm font-medium">
              <component :is="request.icon" :class="selectedRequest == request ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'" class="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
              <span>{{ request.name }}</span>
            </button>
          </nav>

          <!-- Results count -->
          <div class="text-gray-500 text-sm ml-auto">{{ report.rowCount }} results</div>
        </div>
      </div>
      
      <!-- Table loading state -->
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

      <!-- Table -->
      <table v-else class="min-w-full table-fixed divide-y divide-gray-300">
        <thead>
          <tr class="divide-x divide-gray-200">
            <th v-for="header in report.dimensionHeaders" scope="col" class="py-3 px-4 text-left">
              <div class="text-sm font-semibold text-gray-900">{{ selectedRequest.dictionary[header.name].displayName }}</div>
              <div class="mt-1 text-xs italic font-normal text-gray-400">{{ header.name }}</div>
            </th>
            <th v-for="header in report.metricHeaders" scope="col" class="py-3 px-4 text-left">
              <div class="text-sm font-semibold text-gray-900">{{ selectedRequest.dictionary[header.name].displayName }}</div>
              <div class="mt-1 text-xs italic font-normal text-gray-400">{{ header.name }}</div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="row in report.rows" class="divide-x divide-gray-200">
            <td v-for="value in row.dimensionValues" class="py-3 px-4 text-sm text-gray-500">{{ value.value }}</td>
            <td v-for="value in row.metricValues" class="py-3 px-4 text-sm font-medium text-gray-900">{{ value.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="report && !report.rows" class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z" />
      </svg>

      <h2 class="mt-2 text-lg font-medium text-gray-900">No data found for this connection</h2>
      <p class="mt-1 text-gray-500">Make sure Google Analytics is installed.</p>
      <AppButton @click="" class="mt-4">Check Connection (Todo)</AppButton>
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
import { CalendarIcon, EyeIcon, ArrowRightOnRectangleIcon, DocumentArrowDownIcon } from '@heroicons/vue/24/outline'
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

const selectedDateRange = ref(dateRangeOptions.value[2]);

const requests = ref([
  { 
    name: 'Page views', 
    icon: EyeIcon, 
    params: {
      dimensions: [
        { name: 'pagePath' },
      ],
      metrics: [
        { name: 'screenPageViews' }
      ],
    },
    dictionary: {
      pagePath: {
        displayName: 'Page',
      },
      screenPageViews: {
        displayName: 'Views',
      },
    }
  },  
  { 
    name: 'Outbound clicks', 
    icon: ArrowRightOnRectangleIcon,
    params: {
      dimensions: [
        { name: 'linkUrl' },
        { name: 'pagePath' }
      ],
      metrics: [
        { name: 'eventCount' }
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'linkUrl',
          stringFilter: {
            matchType: 'FULL_REGEXP',
            value: '.+'
          }
        }
      }
    },
    dictionary: {
      linkUrl: {
        displayName: 'Outbound link',
      },
      pagePath: {
        displayName: 'Page',
      },
      eventCount: {
        displayName: 'Clicks',
      },
    }
  },
])

const selectedRequest = ref(requests.value[1])

function runReport() {
  loading.value = true

  gaDataApi.runReport(selectedConnection.value.id, {
    ...toRaw(selectedRequest.value.params),
    dateRanges: [
      { startDate: selectedDateRange.value.startDate, endDate: selectedDateRange.value.endDate }
    ],
    limit: 250
  }).then(response => {
    if (response.data.data.error) {
      console.log(response.data.data.error)
      return
    }

    loading.value = false
    report.value = response.data.data
  })
}

// function exportReport() {
//   const baseURL = import.meta.env.VITE_API_BASE_URL
  
//   let params = new URLSearchParams({
//     ...toRaw(selectedRequest.value.params),
//     dateRanges: [
//       { startDate: selectedDateRange.value.startDate, endDate: selectedDateRange.value.endDate }
//     ],
//     limit: 250
//   });

//   window.open(`${baseURL}/ga/export/${selectedConnection.value.id}?${params.toString()}`, '_blank')
// }

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
  })
})
</script>
