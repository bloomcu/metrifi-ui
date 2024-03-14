import debounce from 'lodash.debounce'
import { computed, ref, watch } from 'vue'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'

const { selectedDateRange } = useDatePicker()

export function useFunnels() {
  const funnels = ref([])
  const pendingFunnels = ref([])
  const completedFunnels = ref([])
  const activeFunnels = ref()

  // TODO: Do we need this?
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

  const runReport = debounce((funnel) => {
    console.log('Running report...')

    // If no steps have metrics, skip
    // if (!step.metrics.length) {
    //   step.total = '0' // TODO: This won't be updated in the funnel
    //   startNextFunnelJob()
    //   return
    // }
  
    gaDataApi.funnelReport(funnel.connection_id, {
      startDate: selectedDateRange.value.startDate,
      endDate: selectedDateRange.value.endDate,
      steps: funnel.steps,
    }).then(response => {
      if (response.data.data.error) console.log(response.data.data.error)

      console.log(response.data.data)
      funnel.report = response.data.data
    })

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