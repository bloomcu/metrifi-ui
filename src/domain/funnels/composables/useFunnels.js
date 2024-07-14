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
  const isReportLoading = ref(false)

  // TODO: Do we need this?
  const addFunnel = (funnel) => {
    funnels.value.push(funnel)
    addFunnelJob(funnel) // Add funnel job by funnel object
  }

  const addFunnelJob = (job) => {
    if (job.steps.length) {
      pendingFunnels.value.push(job)
    }
    
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

  const getReport = debounce((funnel) => {
    console.log('Running report on funnel: ', funnel)
    isReportLoading.value = true
  
    gaDataApi.funnelReport(funnel.connection_id, {
      startDate: selectedDateRange.value.startDate,
      endDate: selectedDateRange.value.endDate,
      steps: funnel.steps,
    }).then(response => {
      if (response.data.data.error) console.log(response.data.data.error)
      funnel.report = response.data.data
      // console.log('Reported steps:', funnel.report.steps)
      console.log('Report:', funnel.report)
      calculateReportConversions(funnel, funnel.report.steps)
      isReportLoading.value = false
    })

    startNextFunnelJob()
  }, 500)

  const calculateReportConversions = (funnel, steps) => {
    console.log('Calculating conversions...')

    steps.forEach((step, index) => {
      // Update user count
      funnel.report.steps[index].users = step.users

      // First conversion rate is always 100%
      if (index === 0) {
        funnel.report.steps[0].conversionRate = '100'
        return
      }
      
      let cr = (step.users / steps[index - 1]?.users)
      
      if (cr === Infinity || isNaN(cr)) {
          funnel.report.steps[index].conversionRate = '0.00'
          return
      }

      let formatted = cr * 100 // Get a percentage
          formatted = formatted.toFixed(2) // Round to 2 decimal places
          formatted = formatted.substring(0, 4) // Trim to 2 decimal places

      // Update conversion rate
      funnel.report.steps[index].conversionRate = formatted
    })
  }

  // const calculateReportConversions = (funnel, steps) => {
  //   console.log('Calculating funnel conversions...')

  //   funnel.steps = steps

  //   steps.forEach((step, index) => {
  //     // Update user count
  //     funnel.steps[index].users = step.users

  //     // First conversion rate is always 100%
  //     if (index === 0) {
  //       funnel.steps[0].conversionRate = '100'
  //       return
  //     }
      
  //     let cr = (step.users / steps[index - 1]?.users)
      
  //     if (cr === Infinity || isNaN(cr)) {
  //         funnel.steps[index].conversionRate = '0.00'
  //         return
  //     }

  //     let formatted = cr * 100 // Get a percentage
  //         formatted = formatted.toFixed(2) // Round to 2 decimal places
  //         formatted = formatted.substring(0, 4) // Trim to 2 decimal places

  //     // Update conversion rate
  //     funnel.steps[index].conversionRate = formatted
  //   })
  // }

  watch(activeFunnels, (funnel) => {
    if (!funnel) {
      startNextFunnelJob()
      return
    }

    getReport(funnel)
  });

  // watch(
  //   () => funnels,
  //   () => {
  //     console.log(`The funnels has changed to ${funnels}!`);
  //   },
  //   {
  //     deep: true,
  //   }
  // );

  return { 
    funnels: computed(() => funnels.value),
    funnel: computed(() => funnels.value[0]), // TODO: Delete this
    isReportLoading: computed(() => isReportLoading.value),
    pendingFunnels,
    activeFunnels,
    completedFunnels,
    addFunnel, 
    addFunnelJob, 
    startNextFunnelJob,
    calculateReportConversions,
  }
}