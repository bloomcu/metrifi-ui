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
                console.log("Funnel: ", response.data.data)
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
                addFunnelJob(funnel.value)
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

    function addFunnelJob(funnel) {
        console.log('Adding funnel job...')

        // Add funnel to queue
        if (funnel.steps.length > 0) {
            pendingFunnels.value.push(funnel)
        }

        // If not active funnel, start next funnel job
        if (!activeFunnel.value) {
            startNextFunnelJob()
        }
    }

    function startNextFunnelJob() {
        console.log('Starting next funnel job...')
        // Push last active funnel to completed
        // if (activeFunnel.value) {
        //     completedFunnels.value.push(activeFunnel.value)
        // }

        // Make next pending funnel active
        if (pendingFunnels.value.length > 0) {
            activeFunnel.value = pendingFunnels.value[0]
            pendingFunnels.value.shift()
            getReport(activeFunnel.value)
        } else {
            console.log('Queue is empty, we are done...')
            activeFunnel.value = null
        }
    }

    const getReport = debounce((funnel) => {
        console.log('Running report on funnel...')
        isLoading.value = true

        gaDataApi.funnelReport(funnel.connection_id, {
            startDate: selectedDateRange.value.startDate,
            endDate: selectedDateRange.value.endDate,
            steps: funnel.steps,
        }).then(response => {
            if (response.data.data.error) console.log(response.data.data.error)
            funnel.report = response.data.data
            calculateConversions(funnel, funnel.report.steps)
            isLoading.value = false
        })

        startNextFunnelJob()
    }, 500)

    const calculateConversions = (funnel, steps) => {
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

    // watch(activeFunnel, (funnel) => {
    //     console.log('Watcher hit')
    //     if (!funnel) {
    //         console.log('No active funnel, starting next funnel job...')
    //         startNextFunnelJob()
    //         return
    //     }

    //     console.log('Watcher sees active funnel, getting its report...')
    //     getReport(funnel)
    // });

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
        addFunnelJob,
        calculateConversions,
    }
})

/**
 * Enable hot reload on store updates
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFunnelStore, import.meta.hot))
}
