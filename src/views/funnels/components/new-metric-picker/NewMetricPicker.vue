<template>
  <div ref="picker" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all z-[9999] sm:rounded-lg">
    <div class="divide-y divide-gray-200">
      <!-- Search -->
      <div class="relative">
        <MagnifyingGlassIcon class="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" aria-hidden="true" />
        <input
          v-model="searchQuery"
          ref="searchElement"
          class="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
          placeholder="Search..."
        />
      </div>

      <!-- Match Type Selection -->
      <div class="p-4 border-b border-gray-200 bg-gray-50">
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Match Type
          </label>
          <select
            v-model="selectedMatchType"
            @change="onMatchTypeChange"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
          >
            <option v-for="option in matchTypeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <p class="mt-1 text-sm text-gray-500">{{ selectedMatchTypeConfig.description }}</p>
        </div>

        <!-- Manual Input for non-exact matches -->
        <div v-if="!selectedMatchTypeConfig.requiresSelection" class="space-y-3">
          <div v-if="selectedTab.metric === 'pageUsers'">
            <label class="block text-sm font-medium text-gray-700">Page Path</label>
            <input
              v-model="manualInput.pagePath"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
              :placeholder="getPlaceholderText('pagePath')"
            />
          </div>

          <div v-if="selectedTab.metric === 'pagePlusQueryStringUsers'">
            <label class="block text-sm font-medium text-gray-700">Page Path + Query String</label>
            <input
              v-model="manualInput.pagePathPlusQueryString"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
              :placeholder="getPlaceholderText('pagePathPlusQueryString')"
            />
          </div>

          <div v-if="selectedTab.metric === 'pageTitleUsers'">
            <label class="block text-sm font-medium text-gray-700">Page Title</label>
            <input
              v-model="manualInput.pageTitle"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
              :placeholder="getPlaceholderText('pageTitle')"
            />
          </div>

          <div v-if="selectedTab.metric === 'outboundLinkUsers'">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-sm font-medium text-gray-700">Link URL</label>
                <input
                  v-model="manualInput.linkUrl"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                  :placeholder="getPlaceholderText('linkUrl')"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Page Path</label>
                <input
                  v-model="manualInput.pagePath"
                  type="text"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
                  :placeholder="getPlaceholderText('pagePath')"
                />
              </div>
            </div>
          </div>

          <!-- Hostname (common to most metrics) -->
          <div v-if="selectedTab.metric !== 'formUserSubmissions'">
            <label class="block text-sm font-medium text-gray-700">Hostname (optional)</label>
            <input
              v-model="manualInput.hostname"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm"
              placeholder="example.com"
            />
          </div>

          <button
            @click="applyManualInput"
            :disabled="!isManualInputValid"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Apply {{ selectedMatchTypeConfig.label }}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="relative">
        <nav class="flex space-x-2 p-2" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click.stop="selectTab(tab)"
            :class="selectedTab.metric == tab.metric ? 'bg-violet-100 text-violet-500 hover:bg-violet-100' : ''"
            class="text-gray-500 rounded-md px-3 py-2 text-sm font-medium hover:text-gray-700 hover:bg-gray-100"
          >
            <span>{{ tab.name }}</span>
          </button>
        </nav>
      </div>

      <!-- Results Table (only show for exact matches or as reference) -->
      <div class="flex transform-gpu divide-x divide-gray-100" as="div">
        <!-- Table container -->
        <div class="relative min-h-[480px] min-w-[860px] h-[70vh] w-[80vw] flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">

          <!-- Show notice for non-exact matches -->
          <div v-if="!selectedMatchTypeConfig.requiresSelection" class="p-4 bg-blue-50 border-b border-blue-200">
            <div class="flex">
              <InformationCircleIcon class="h-5 w-5 text-blue-400" />
              <div class="ml-3">
                <p class="text-sm text-blue-700">
                  <strong>{{ selectedMatchTypeConfig.label }} match selected.</strong>
                  Use the form above to specify your criteria. The results below are shown for reference only.
                </p>
              </div>
            </div>
          </div>

          <table v-if="!isReportLoading && reports[selectedTab.metric]" class="table-fixed min-w-full max-w-full divide-y divide-gray-300">
            <thead>
              <tr v-if="reports[selectedTab.metric].rows" class="divide-x divide-gray-200">
                <th v-for="column in selectedTab.columns" scope="col" class="py-3 px-3 text-left">
                  <div class="flex items-center gap-1 text-sm font-semibold text-gray-900">
                    <span>{{ column.displayName }}</span>
                    <AppTooltipWrapper v-if="column.tooltip" alignment="left-bottom">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 cursor-help text-gray-400"><path fill-rule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clip-rule="evenodd" /></svg>
                      <AppTooltip style="width: 350px;" :text="column.tooltip" />
                    </AppTooltipWrapper>
                    <span v-if="column.name === 'totalUsers'">({{ reports[selectedTab.metric].totals[0].metricValues[0].value }})</span>
                  </div>
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <!-- Page users with conditional click -->
              <tr
                v-if="selectedTab.metric === 'pageUsers'"
                v-for="row in reports[selectedTab.metric].rows"
                @click="selectedMatchTypeConfig.requiresSelection ? updateMetricFromTable({
                  metric: selectedTab.metric,
                  matchType: selectedMatchType,
                  pagePath: row.dimensionValues[0].value,
                  hostname: row.dimensionValues[1].value,
                }) : null"
                :class="[
                  'divide-x divide-gray-200',
                  selectedMatchTypeConfig.requiresSelection ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default opacity-75'
                ]"
              >
                <td class="py-3 px-3 text-sm break-all">
                  <p class="font-semibold text-gray-700 mb-0.5">{{ row.dimensionValues[0].value }}</p>
                  <p class="text-gray-500">{{ row.dimensionValues[2].value }}</p>
                </td>
                <td class="py-3 px-3 text-sm text-gray-500 break-all w-1/6">{{ row.dimensionValues[1].value }}</td>
                <td class="py-3 px-3 text-sm font-medium text-gray-900">{{ row.metricValues[0].value }}</td>
              </tr>

              <!-- Page + query string users -->
              <tr
                v-if="selectedTab.metric === 'pagePlusQueryStringUsers'"
                v-for="row in reports[selectedTab.metric].rows"
                @click="selectedMatchTypeConfig.requiresSelection ? updateMetricFromTable({
                  metric: selectedTab.metric,
                  matchType: selectedMatchType,
                  pagePathPlusQueryString: row.dimensionValues[0].value,
                  hostname: row.dimensionValues[1].value,
                }) : null"
                :class="[
                  'divide-x divide-gray-200',
                  selectedMatchTypeConfig.requiresSelection ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default opacity-75'
                ]"
              >
                <td class="py-3 px-3 text-sm break-all">
                  <p class="font-semibold text-gray-700 mb-0.5">{{ row.dimensionValues[0].value }}</p>
                  <p class="text-gray-500">{{ row.dimensionValues[2].value }}</p>
                </td>
                <td class="py-3 px-3 text-sm text-gray-500 break-all w-1/5">{{ row.dimensionValues[1].value }}</td>
                <td class="py-3 px-3 text-sm font-medium text-gray-900">{{ row.metricValues[0].value }}</td>
              </tr>

              <!-- Page title users -->
              <tr
                v-if="selectedTab.metric === 'pageTitleUsers'"
                v-for="row in reports[selectedTab.metric].rows"
                @click="selectedMatchTypeConfig.requiresSelection ? updateMetricFromTable({
                  metric: selectedTab.metric,
                  matchType: selectedMatchType,
                  pageTitle: row.dimensionValues[0].value,
                  hostname: row.dimensionValues[1].value,
                }) : null"
                :class="[
                  'divide-x divide-gray-200',
                  selectedMatchTypeConfig.requiresSelection ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default opacity-75'
                ]"
              >
                <td class="py-3 px-3 text-sm break-all">
                  <p class="font-semibold text-gray-700 mb-0.5">{{ row.dimensionValues[0].value }}</p>
                  <p class="text-gray-500">{{ row.dimensionValues[2].value }}</p>
                </td>
                <td class="py-3 px-3 text-sm text-gray-500 break-all w-1/6">{{ row.dimensionValues[1].value }}</td>
                <td class="py-3 px-3 text-sm font-medium text-gray-900">{{ row.metricValues[0].value }}</td>
              </tr>

              <!-- Outbound link users -->
              <tr
                v-if="selectedTab.metric === 'outboundLinkUsers'"
                v-for="row in reports[selectedTab.metric].rows"
                @click="selectedMatchTypeConfig.requiresSelection ? updateMetricFromTable({
                  metric: selectedTab.metric,
                  matchType: selectedMatchType,
                  linkUrl: row.dimensionValues[0].value,
                  pagePath: row.dimensionValues[1].value,
                  hostname: row.dimensionValues[2].value,
                }) : null"
                :class="[
                  'divide-x divide-gray-200',
                  selectedMatchTypeConfig.requiresSelection ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default opacity-75'
                ]"
              >
                <td class="py-3 px-3 text-sm text-gray-500 break-all">{{ row.dimensionValues[0].value }}</td>
                <td class="py-3 px-3 text-sm text-gray-500 break-all w-2/6">{{ row.dimensionValues[1].value }}</td>
                <td class="py-3 px-3 text-sm text-gray-500 break-all w-1/6">{{ row.dimensionValues[2].value }}</td>
                <td class="py-3 px-3 text-sm font-medium text-gray-900">{{ row.metricValues[0].value }}</td>
              </tr>

              <!-- Form submission users -->
              <tr
                v-if="selectedTab.metric === 'formUserSubmissions'"
                v-for="row in reports[selectedTab.metric].rows"
                @click="selectedMatchTypeConfig.requiresSelection ? updateMetricFromTable({
                  new: true,
                  metric: selectedTab.metric,
                  matchType: selectedMatchType,
                  pagePath: row.dimensionValues[1].value,
                  formDestination: row.dimensionValues[2].value,
                  formId: row.dimensionValues[3].value,
                  formLength: row.dimensionValues[4].value,
                  formSubmitText: row.dimensionValues[5].value,
                  hostname: row.dimensionValues[6].value,
                }) : null"
                :class="[
                  'divide-x divide-gray-200',
                  selectedMatchTypeConfig.requiresSelection ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default opacity-75'
                ]"
              >
                <td class="py-3 px-3 text-sm text-gray-500 break-all w-[30%]">{{ row.dimensionValues[1].value ? row.dimensionValues[1].value : '(not set)'}} </td>
                <td class="py-3 px-3 text-sm text-gray-500 break-all w-[30%]">{{ row.dimensionValues[2].value ? row.dimensionValues[2].value : '(not set)'}} </td>
                <td class="py-3 px-3 text-sm text-gray-500 break-all w-[14%]">{{ row.dimensionValues[3].value ? row.dimensionValues[3].value : '(not set)'}} </td>
                <td class="py-3 px-3 text-sm text-gray-500 break-all w-[1%]">{{ row.dimensionValues[4].value ? row.dimensionValues[4].value : '(not set)'}} </td>
                <td class="py-3 px-3 text-sm text-gray-500 whitespace-nowrap w-[5%]">{{ row.dimensionValues[5].value ? row.dimensionValues[5].value : '(not set)'}} </td>
                <td class="py-3 px-3 text-sm text-gray-500 break-all w-1/6">{{ row.dimensionValues[6].value ? row.dimensionValues[6].value : '(not set)' }} </td>
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

          <div v-if="!isReportLoading && reports[selectedTab.metric] && !reports[selectedTab.metric].rows" class="text-center py-16 px-2">
            <NoSymbolIcon class="mx-auto w-8 text-gray-400"/>
            <h2 class="mt-2 text-lg font-medium text-gray-900">No results</h2>
            <p class="mt-1 text-gray-500">Try another date range or search term.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import debounce from 'lodash.debounce'
import { ref, computed, watch, onMounted } from 'vue'
import { InformationCircleIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { EyeIcon, EnvelopeIcon, NoSymbolIcon } from '@heroicons/vue/24/outline'
import { onClickOutside } from '@vueuse/core'
import { MATCH_TYPES, MATCH_TYPE_OPTIONS, getMatchTypeConfig } from '@/domain/funnels/constants/matchTypes'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { useGoogleAnalyticsReports } from '@/domain/services/google-analytics/composables/useGoogleAnalyticsReports'
import AppTooltip from '@/app/components/base/tooltips/AppTooltip.vue'
import AppTooltipWrapper from '@/app/components/base/tooltips/AppTooltipWrapper.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

const metric = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

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
      { name: 'pageTitle', displayName: 'Page title', tooltip: 'Below the Page Titles, Page Paths are shown for reference only and do not affect the funnel results. If multiple entries have the same Page Title but different Page Paths, choosing any of them will yield the same result in your funnel.' },
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

// Match type related refs
const selectedMatchType = ref(MATCH_TYPES.EXACT)
const matchTypeOptions = ref(MATCH_TYPE_OPTIONS)
const manualInput = ref({
  pagePath: '',
  pagePathPlusQueryString: '',
  pageTitle: '',
  linkUrl: '',
  hostname: '',
  formDestination: '',
  formId: '',
  formLength: '',
  formSubmitText: ''
})

const selectedMatchTypeConfig = computed(() => {
  return getMatchTypeConfig(selectedMatchType.value)
})

const isManualInputValid = computed(() => {
  if (selectedMatchTypeConfig.value.requiresSelection) return false

  switch (selectedTab.value.metric) {
    case 'pageUsers':
      return manualInput.value.pagePath.trim() !== ''
    case 'pagePlusQueryStringUsers':
      return manualInput.value.pagePathPlusQueryString.trim() !== ''
    case 'pageTitleUsers':
      return manualInput.value.pageTitle.trim() !== ''
    case 'outboundLinkUsers':
      return manualInput.value.linkUrl.trim() !== '' && manualInput.value.pagePath.trim() !== ''
    case 'formUserSubmissions':
      return manualInput.value.formDestination.trim() !== ''
    default:
      return false
  }
})

function onMatchTypeChange() {
  Object.keys(manualInput.value).forEach(key => {
    manualInput.value[key] = ''
  })
}

function getPlaceholderText(field) {
  const placeholders = {
    [MATCH_TYPES.CONTAINS]: {
      pagePath: '/loans/',
      pagePathPlusQueryString: '/loans/?utm_source=',
      pageTitle: 'Loan Application',
      linkUrl: 'https://example.com'
    },
    [MATCH_TYPES.BEGINS_WITH]: {
      pagePath: '/loans',
      pagePathPlusQueryString: '/loans',
      pageTitle: 'Loan',
      linkUrl: 'https://'
    },
    [MATCH_TYPES.ENDS_WITH]: {
      pagePath: '/application',
      pagePathPlusQueryString: '?submitted=true',
      pageTitle: 'Complete',
      linkUrl: '.pdf'
    }
  }
  return placeholders[selectedMatchType.value]?.[field] || `Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`
}

function applyManualInput() {
  const metricData = {
    metric: selectedTab.value.metric,
    matchType: selectedMatchType.value
  }
  switch (selectedTab.value.metric) {
    case 'pageUsers':
      metricData.pagePath = manualInput.value.pagePath
      metricData.hostname = manualInput.value.hostname
      break
    case 'pagePlusQueryStringUsers':
      metricData.pagePathPlusQueryString = manualInput.value.pagePathPlusQueryString
      metricData.hostname = manualInput.value.hostname
      break
    case 'pageTitleUsers':
      metricData.pageTitle = manualInput.value.pageTitle
      metricData.hostname = manualInput.value.hostname
      break
    case 'outboundLinkUsers':
      metricData.linkUrl = manualInput.value.linkUrl
      metricData.pagePath = manualInput.value.pagePath
      metricData.hostname = manualInput.value.hostname
      break
    case 'formUserSubmissions':
      metricData.pagePath = manualInput.value.pagePath
      metricData.formDestination = manualInput.value.formDestination
      metricData.formId = manualInput.value.formId
      metricData.formLength = manualInput.value.formLength
      metricData.formSubmitText = manualInput.value.formSubmitText
      metricData.hostname = manualInput.value.hostname
      break
  }
  updateMetric(metricData)
}

function updateMetricFromTable(metricData) {
  updateMetric(metricData)
}

function run() {
  runReport(
    selectedTab.value.metric,
    selectedConnection.value.id,
    selectedDateRange.value.startDate,
    selectedDateRange.value.endDate,
    searchQuery.value,
  )
}

const debounceRun = debounce(() => {
  run()
}, 500)

watch(selectedTab, () => {
  if (
    reports.value[selectedTab.value.metric] &&
    reports.value[selectedTab.value.metric].query === searchQuery.value
  ) return
  run()
})

watch(searchQuery, () => {
  debounceRun()
})

onClickOutside(picker, () => {
  emit('update:modelValue', metric.value)
  metric.value.showPicker = false
})

onMounted(() => {
  if (props.modelValue.matchType) {
    selectedMatchType.value = props.modelValue.matchType
  }
  resetReports()
  run()
})
</script>
