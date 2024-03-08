import debounce from 'lodash.debounce'
import { computed, ref, watch } from 'vue'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'

const { selectedDateRange } = useDatePicker()

export function useGoogleAnalyticsReports() {
  const funnels = ref([])
  const pendingFunnels = ref([])
  const completedFunnels = ref([])
  const activeFunnels = ref()

  const addFunnel = (funnel) => {
    funnels.value.push(funnel)
    addFunnelJob(funnel) // Add funnel job by funnel object
  }

  const addFunnelJob = (job) => {
    pendingFunnels.value.push(job)
    
    if (!activeFunnels.value) {
      startNextFunnelJob()
    }
  };

  const startNextFunnelJob = () => {
    if (activeFunnels.value) {
      completedFunnels.value.push(activeFunnels.value)
    }

    if (pendingFunnels.value.length > 0) {
      activeFunnels.value = pendingFunnels.value[0]
      pendingFunnels.value.shift()
    } else {
      activeFunnels.value = null
    }
  };

  const runReport = debounce((job) => {
    console.log('Running report...')

    let funnel = job
  
    // Iterate each step
    let stepsProcessed = 0
    funnel.steps.forEach((step) => {
  
      if (!step.measurables.length) {
        step.total = '0' // TODO: This won't be updated in the funnel
        startNextFunnelJob()
        return
      }
  
      // Report: Page users
      if (step.measurables[0].metric === 'pageUsers') {
        gaDataApi.pageUsers(funnel.connection_id, {
          startDate: selectedDateRange.value.startDate,
          endDate: selectedDateRange.value.endDate,
          measurables: step.measurables.map(measurable => measurable.measurable),
        }).then(response => {
          if (response.data.data.error) {
            console.log(response.data.data.error)
            return
          }
  
          // Set total for this step
          let report = response.data.data
          step.total = report.totals[0].metricValues ? report.totals[0].metricValues[0].value : 0
          stepsProcessed++;
          
          if (stepsProcessed === funnel.steps.length) {
              stepsProcessed = 0
          }
        }) // End GA page views report
      }

      // Report: Virtual page users
      if (step.measurables[0].metric === 'pagePlusQueryStringUsers') {
        gaDataApi.pagePlusQueryStringUsers(funnel.connection_id, {
          startDate: selectedDateRange.value.startDate,
          endDate: selectedDateRange.value.endDate,
          measurables: step.measurables.map(measurable => measurable.measurable),
        }).then(response => {
          if (response.data.data.error) {
            console.log(response.data.data.error)
            return
          }
  
          // Set total for this step
          let report = response.data.data
          step.total = report.totals[0].metricValues ? report.totals[0].metricValues[0].value : 0
          stepsProcessed++;
          
          if (stepsProcessed === funnel.steps.length) {
              stepsProcessed = 0
          }
        }) // End GA page views report
      }
  
      // Report outbound clicks
      if (step.measurables[0].metric === 'outboundLinkUsers') {
        gaDataApi.outboundLinkByPagePathUsers(funnel.connection_id, {
          startDate: selectedDateRange.value.startDate,
          endDate: selectedDateRange.value.endDate,
          pagePath: step.measurables[0].pagePath,
          outboundLinkUrls: step.measurables.map(measurable => measurable.measurable),
        }).then(response => {
          if (response.data.data.error) {
            console.log(response.data.data.error)
            return
          }
  
          // Set total for this step
          let report = response.data.data
          step.total = report.total
          stepsProcessed++;
          
          if (stepsProcessed === funnel.steps.length) {
            stepsProcessed = 0
          }
        }) // End GA outbound clicks report
      }
    }) // End foreach on funnel step

    startNextFunnelJob()
  }, 500)

  watch(activeFunnels, (funnel) => {
    if (!funnel) {
      startNextFunnelJob()
      return
    }

    runReport(funnel)
  });

  return { 
    funnels: computed(() => funnels.value),
    funnel: computed(() => funnels.value[0]),
    pendingFunnels,
    activeFunnels,
    completedFunnels,
    addFunnel, 
    addFunnelJob, 
    startNextFunnelJob,
  }
}