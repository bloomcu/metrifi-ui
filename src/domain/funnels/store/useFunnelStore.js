import debounce from 'lodash.debounce'
import { computed, ref, watch } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'
// const { funnel, addFunnel, addFunnelJob, isReportLoading } = useFunnels()

export const useFunnelStore = defineStore('funnelStore', () => {
    const funnels = ref([])
    const funnel = ref(null)
    // const reportsQueue = ref([])
    // const reportsInProgress = ref([])
    // const reportsCompleted = ref([])
    const pendingFunnels = ref([])
    const activeFunnel = ref(null)
    const completedFunnels = ref([])
    const isLoading = ref(false)

    const { selectedDateRange } = useDatePicker()
    
    function index(organization, dashboard, params) {
        this.analyses = []

        funnelApi.index(organization, dashboard, params)
            .then(response => {
                this.analyses = response.data.data
            }).catch(error => {
                console.log('Error', error.response.data)
            })
    }
      
    async function store(organization, dashboard, params) {
        this.isLoading = true

        await funnelApi.store(organization, dashboard, params)
            .then(response => {
                this.funnel = response.data.data
                this.isLoading = false
            }).catch(error => {
                console.log('Error', error.response.data)
            })
    }
      
    async function show(organization_id, funnel_id) {
        funnel.value = null

        await funnelApi.show(organization_id, funnel_id)
            .then(response => {
                funnel.value = response.data.data
                addFunnel(funnel.value)
                // setTimeout(() => isLoading.value = false, 500)
            })
    }

    async function update(organization, dashboard, id, params) {
        this.isLoading = true

        await funnelApi.update(organization, dashboard, id, params)
            .then(response => {
                this.funnel = response.data.data
                this.isLoading = false
            })
    }

    const addFunnel = (funnel) => {
        funnels.value.push(funnel)
        addFunnelJob(funnel)
    }

    function addFunnelJob(funnel) {
        // Add funnel to reporting queue
        if (funnel.steps.length > 0) {
            pendingFunnels.value.push(funnel)
        }

        // If no active funnel job, start next funnel job
        if (!activeFunnel.value) {
            startNextFunnelJob()
        }
    }

    function startNextFunnelJob() {
        // Make next pending funnel active
        if (pendingFunnels.value.length > 0) {
            activeFunnel.value = pendingFunnels.value[0]
            pendingFunnels.value.shift()
            getReport(activeFunnel.value)
        } else {
            activeFunnel.value = null
        }
    }

    const getReport = debounce((funnel) => {
        // console.log('getReport...')
        isLoading.value = true

        gaDataApi.funnelReport(funnel.id, {
            disabledSteps: funnel.pivot?.disabled_steps,
            startDate: selectedDateRange.value.startDate,
            endDate: selectedDateRange.value.endDate,
        }).then(response => {
            if (response.data.data.error) console.log(response.data.data.error)
            // console.log(response.data.data)
            funnel.report = response.data.data.report
            // removeDisabledStepsFromReport(funnel)
            // calculateReportConversions(funnel, funnel.report.steps)
            isLoading.value = false
        })

        startNextFunnelJob()
    }, 500)

    // function removeDisabledStepsFromReport(funnel) {
    //     if (!funnel.pivot) return

    //     let disabled_steps = funnel.pivot.disabled_steps
    //     if (!disabled_steps) return

    //     funnel.steps.forEach((step) => {
    //         if (disabled_steps.includes(step.id)) {
    //             // Find the index of the step in the report by it's id
    //             let index = funnel.report.steps.findIndex(s => s.id === step.id)

    //             // Remove the step from the report
    //             funnel.report.steps.splice(index, 1)
    //         }
    //     })
    // }

    function calculateReportConversions(funnel, steps) {
        // console.log('calculateReportConversions...')

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

            let percentage = cr * 100 // Get a percentage
            // percentage = percentage.toFixed(2) // Round to 2 decimal places
            // percentage = percentage.substring(0, 4) // Truncate to 4 characters

            // Update conversion rate
            funnel.report.steps[index].conversionRate = percentage
        })
    }

    return {
        funnels,
        funnel,
        pendingFunnels,
        activeFunnel,
        completedFunnels,
        isLoading,
        index,
        store,
        show,
        update,
        addFunnel,
        addFunnelJob,
        // calculateReportConversions,
    }
})

/**
 * Enable hot reload on store updates
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFunnelStore, import.meta.hot))
}
