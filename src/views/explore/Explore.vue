<template>
  <LayoutWithSidebar>
    <template #overlay>
      <!-- Force GA connection first -->
      <div v-if="organizationStore.organization && organizationStore.organization.connections_count == 0" class="fixed h-full w-full items-center bg-white bg-opacity-60 backdrop-blur-sm flex justify-center z-50">
        <div class="max-w-3xl lg:-ml-60 flex flex-col text-center items-center justify-center border rounded-xl bg-white shadow-xl mx-4 p-10">
          <svg class="w-10 h-10 mb-4" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
          <h1 class="mb-2 text-3xl font-medium text-gray-900">Connect Google Analytics</h1>
          <p class="text-lg text-gray-700 mb-4">In order to use MetriFi, you need to connect your Google Analytics 4 account.</p>
          <AppButton @click="connectToGoogle()">Connect Google Analytics</AppButton>
        </div>
      </div>
    </template>

    <template #topbar>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Reports</h1>

        <div class="flex items-center gap-2">
          <!-- Connection -->
          <!-- <ConnectionPicker :connections="connections" :selected="selectedConnection" @selected="selectedConnection = $event" class="w-72"/> -->
          <!-- <div v-if="selectedConnection" class="flex items-center mr-2">
            <svg class="w-4 h-4 mr-2" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
            <span class="text-sm">{{ selectedConnection.name }}</span>
          </div> -->

          <!-- Datepicker -->
          <DatePicker class="w-[400px]" />

          <!-- Export -->
          <AppButton variant="tertiary" size="base" @click="downloadCSV()" class="inline-flex items-center">
            <DocumentArrowDownIcon class="mr-1.5 h-5 w-5"/>
            Export
          </AppButton>
        </div>
      </div>
    </template>

    <!-- Tabs -->
    <div class="relative mb-2">
      <nav class="flex space-x-2 py-2" aria-label="Tabs">
        <button v-for="tab in tabs" :key="tab.name" @click.stop="selectTab(tab)" :class="selectedTab.metric == tab.metric ? 'bg-violet-100 text-violet-500 hover:bg-violet-100' : ''" class="text-gray-500 rounded-md px-3 py-2 text-sm font-medium hover:text-gray-700 hover:bg-gray-100">
          <span>{{ tab.name }}</span>
        </button>
      </nav>
    </div>

    <!-- Search -->
    <div class="flex items-center gap-2 mb-5">
      <AppInput v-model="searchQuery" placeholder="Search..." class="flex-1"></AppInput>
    </div>

    <!-- Report -->
    <div v-if="reports[selectedTab.metric] && reports[selectedTab.metric].rows">
      <table v-if="!isReportLoading && reports[selectedTab.metric]" class="min-w-full max-w-full divide-y divide-gray-300 mb-20">
        <thead>
          <tr class="divide-x divide-gray-200">
            <th v-for="column in selectedTab.columns" scope="col" class="py-3 px-3 text-left">
              <div class="text-sm font-semibold text-gray-900">
                {{ column.displayName }}
              </div>
              <div v-if="column.name === 'totalUsers'" class="text-sm font-semibold text-gray-900">
                ({{ reports[selectedTab.metric].totals[0].metricValues[0].value }})
              </div>
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <!-- Page users -->
          <tr 
            v-if="selectedTab.metric === 'pageUsers'" 
            v-for="row in reports[selectedTab.metric].rows" 
            class="divide-x divide-gray-200 cursor-pointer hover:bg-gray-50"
          >
              <!-- Page path -->
              <td class="py-3 px-3 text-sm text-gray-500 break-all">{{ row.dimensionValues[0].value }}</td>
              <!-- Hostname -->
              <td  class="py-3 px-3 text-sm text-gray-500 break-all w-1/5">{{ row.dimensionValues[1].value }}</td>
              <!-- Users -->
              <td class="py-3 px-3 text-sm font-medium text-gray-900">{{ row.metricValues[0].value }}</td>
          </tr>
          
          <!-- Page + query string users -->
          <tr 
            v-if="selectedTab.metric === 'pagePlusQueryStringUsers'" 
            v-for="row in reports[selectedTab.metric].rows" 
            class="divide-x divide-gray-200 cursor-pointer hover:bg-gray-50"
          >
              <!-- Page path + query string -->
              <td class="py-3 px-3 text-sm text-gray-500 break-all">{{ row.dimensionValues[0].value }}</td> 
              <!-- Hostname -->
              <td  class="py-3 px-3 text-sm text-gray-500 break-all w-1/5">{{ row.dimensionValues[1].value }}</td>
              <!-- Users -->
              <td class="py-3 px-3 text-sm font-medium text-gray-900">{{ row.metricValues[0].value }}</td>
          </tr>

          <!-- Page users -->
          <tr 
            v-if="selectedTab.metric === 'pageTitleUsers'" 
            v-for="row in reports[selectedTab.metric].rows" 
            class="divide-x divide-gray-200 cursor-pointer hover:bg-gray-50"
          >
              <!-- Page title -->
              <td class="py-3 px-3 text-sm text-gray-500 break-all">{{ row.dimensionValues[0].value }}</td>
              <!-- Hostname -->
              <td  class="py-3 px-3 text-sm text-gray-500 break-all w-1/5">{{ row.dimensionValues[1].value }}</td>
              <!-- Users -->
              <td class="py-3 px-3 text-sm font-medium text-gray-900">{{ row.metricValues[0].value }}</td>
          </tr>

          <!-- Outbound link users -->
          <tr 
            v-if="selectedTab.metric === 'outboundLinkUsers'" 
            v-for="row in reports[selectedTab.metric].rows" 
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
              <td  class="py-3 px-3 text-sm text-gray-500 break-all w-1/6">{{ row.dimensionValues[1].value }}</td>
              <!-- Users -->
              <td class="py-3 px-3 text-sm font-medium text-gray-900 break-all w-[1%]">{{ row.metricValues[0].value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state: No results -->
    <div v-if="!isReportLoading && reports[selectedTab.metric] && !reports[selectedTab.metric].rows" class="text-center bg-slate-50 rounded-2xl py-12 px-2 mb-2">
      <NoSymbolIcon class="mx-auto w-8 text-gray-400"/>
      <h2 class="mt-2 text-lg font-medium text-gray-900">No results</h2>
      <p class="mt-1 text-gray-500">Try another date range or search term.</p>
    </div>

    <!-- Report error: Problem from Google Analytics report API -->
    <div v-if="!isReportLoading && reportError" class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <NoSymbolIcon class="mx-auto w-8 text-gray-400"/>
      <h2 class="mt-2 text-lg font-medium text-gray-900">Unable to run report</h2>
      <p class="mt-1 text-gray-500">Enhanced reporting and custom dimensions may not be enabled.</p>
    </div>

    <!-- State: Loading -->
    <div v-if="isReportLoading" class="animate-pulse space-y-4">
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
  </LayoutWithSidebar>
</template>

<script setup>
import debounce from 'lodash.debounce'
import { ref, watch, onMounted } from 'vue'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { useGoogleAnalyticsReports } from '@/domain/services/google-analytics/composables/useGoogleAnalyticsReports'
import { EyeIcon, DocumentArrowDownIcon, CloudIcon, NoSymbolIcon, EnvelopeIcon } from '@heroicons/vue/24/outline'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'
import DatePicker from '@/app/components/datepicker/DatePicker.vue'

const organizationStore = useOrganizationStore()

const { selectedDateRange } = useDatePicker()
const { listConnections, connections, selectedConnection, connectToGoogle } = useConnections()
const { reports, isReportLoading, runReport, reportError } = useGoogleAnalyticsReports()

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

const searchQuery = ref('')

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

watch(selectedDateRange, () => {
  console.log('Date range changed...')
  run()
})

onMounted(() => {
  console.log('Mounted...')

  listConnections().then(() => {
    if (connections.value.length) {
      run()
    }
  })
})

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
  link.setAttribute('download', `${selectedTab.value.name} - ${selectedConnection.value.name} - ${selectedDateRange.value.label}.csv`);
  document.body.appendChild(link); // Required for FF

  link.click();
}
</script>
