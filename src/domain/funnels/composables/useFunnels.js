import debounce from 'lodash.debounce'
import { ref, watch } from 'vue'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'

export function useFunnels() {
  // const reports = ref([])
  const funnels = ref([])
  const pending = ref([])
  const completed = ref([])
  const active = ref({})

  const addFunnel = (funnel) => {
    funnels.value.push(funnel)
    
    // addJob({ funnelId: funnel.id })
    addJob(funnel)
  }

  const addJob = (job) => {
    pending.value.push(job)
    
    if (Object.keys(active.value).length === 0) {
      startNextJob()
    }
  };

  const startNextJob = () => {
    if (Object.keys(active.value).length > 0) {
      completed.value.push(active.value)
    }

    if (pending.value.length > 0) {
      active.value = pending.value[0]
      pending.value.shift()
    } else {
      active.value = {}
    }
  };

  const runReport = debounce((funnel) => {
    console.log('Running report...')
  
    // Iterate each step
    let stepsProcessed = 0
    funnel.steps.forEach((step) => {
  
      if (!step.measurables.length) {
        step.total = '0' // TODO: This won't be updated in the funnel
        startNextJob()
        return
      }
  
      // Report: Page views
      if (step.measurables[0].metric === 'pageViews') {
        gaDataApi.fetchPageViews(funnel.connection_id, {
          startDate: '7daysAgo',
          endDate: 'yesterday',
          pagePaths: step.measurables.map(measurable => measurable.measurable),
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
      if (step.measurables[0].metric === 'outboundClicks') {
        gaDataApi.fetchOutboundClicksByPagePath(funnel.connection_id, {
          startDate: '7daysAgo',
          endDate: 'yesterday',
          pagePath: step.measurables[0].pagePath,
          outboundLinkUrls: step.measurables.map(measurable => measurable.measurable),
        }).then(response => {
          if (response.data.data.error) {
            console.log(response.data.data.error)
            return
          }
  
          // Set total for this step
          let report = response.data.data
          // console.log(report)
          step.total = report.total
          stepsProcessed++;
          
          if (stepsProcessed === funnel.steps.length) {
            stepsProcessed = 0
          }
        }) // End GA outbound clicks report
      }
    }) // End foreach on funnel steps
    
    const i = funnels.value.findIndex(f => f.id === funnel.id)
    funnels.value[i] = funnel

    startNextJob()  
  }, 1000)

  watch(active, (funnel) => {
    // if (job.handler && typeof job.handler === 'function') {
    //   job.handler(() => startNextJob());
    // }

    if (Object.keys(funnel).length === 0) {
      startNextJob()
      return
    }

    runReport(funnel)
    
  });

  // const getFunnels = () => funnels.value
  // const getPending = () => pending.value
  // const getActive = () => active.value
  // const getCompleted = () => completed.value

  return { 
    funnels,
    pending,
    active,
    completed,
    addFunnel, 
    addJob, 
    startNextJob, 
    // getFunnels, 
    // getPending, 
    // getActive, 
    // getCompleted,
  }
}