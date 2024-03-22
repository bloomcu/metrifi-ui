import debounce from 'lodash.debounce'
import { computed, ref, watch } from 'vue'
// import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'

// const { selectedDateRange } = useDatePicker()

// const reports = ref({
//   pageUsers: {
//     name: 'Page users',
//     results: null
//   },
//   pagePlusQueryStringUsers: {
//     name: 'Page + query string users',
//     results: null
//   },
//   outboundLinkUsers: {
//     name: 'Outbound link users',
//     results: null
//   },
// })

const reports = ref({
  pageUsers: null,
  pagePlusQueryStringUsers: null,
  outboundLinkUsers: null,
  formUserSubmissions: null,
})

const isReportLoading = ref(false)

export function useGoogleAnalyticsReports() {
  // const funnels = ref([])
  // const pendingFunnels = ref([])
  // const completedFunnels = ref([])
  // const activeFunnels = ref()

  // const addFunnel = (funnel) => {
  //   funnels.value.push(funnel)
  //   addFunnelJob(funnel) // Add funnel job by funnel object
  // }

  // const addFunnelJob = (job) => {
  //   pendingFunnels.value.push(job)
    
  //   if (!activeFunnels.value) {
  //     startNextFunnelJob()
  //   }
  // };

  // const startNextFunnelJob = () => {
  //   if (activeFunnels.value) {
  //     completedFunnels.value.push(activeFunnels.value)
  //   }

  //   if (pendingFunnels.value.length > 0) {
  //     activeFunnels.value = pendingFunnels.value[0]
  //     pendingFunnels.value.shift()
  //   } else {
  //     activeFunnels.value = null
  //   }
  // };

  function runReport (report, connectionId, startDate, endDate) {
    isReportLoading.value = true

    gaDataApi[report](connectionId, {
      startDate: startDate,
      endDate: endDate,
      // contains: containsFilters.value.map(filter => filter)
      // contains: containsFilters.value
    }).then(response => {
      if (response.data.data.error) {
        console.log(response.data.data.error)
        return
      }
      console.log(response.data.data)
      reports.value[report] = response.data.data
      isReportLoading.value = false
    })
  }

  // watch(activeFunnels, (funnel) => {
  //   if (!funnel) {
  //     startNextFunnelJob()
  //     return
  //   }

  //   runReport(funnel)
  // });

  return { 
    reports: computed(() => reports.value),
    isReportLoading: computed(() => isReportLoading.value),
    // getReport: (report) => reports.value[report],
    runReport,
  }
}