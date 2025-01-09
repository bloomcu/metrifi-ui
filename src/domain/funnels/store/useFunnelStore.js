import debounce from 'lodash.debounce'
import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { useDatePicker } from '@/app/components/datepicker/useDatePicker'

export const useFunnelStore = defineStore('funnelStore', () => {
    const funnels = ref([])
    const funnel = ref(null)
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

    const addFunnelJob = (funnel) => {
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

    // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    
    // async function processFunnels() {
    //     if (pendingFunnels.value.length <= 0) return
            
    //     for (const funnel of pendingFunnels.value) {
    //         getReport(funnel)
    //         await delay(500);
    //     }
    // }

    const getReport = debounce((funnel) => {
        // console.log('Getting report for funnel', funnel.id)
        isLoading.value = true

        gaDataApi.funnelReport(funnel.id, {
            disabledSteps: funnel.pivot?.disabled_steps,
            startDate: selectedDateRange.value.startDate,
            endDate: selectedDateRange.value.endDate,
        }).then(response => {
            if (response.data.data.error) console.log(response.data.data.error)
            // console.log('Report', response.data.data.report)
            funnel.report = response.data.data.report
            isLoading.value = false
        })

        startNextFunnelJob()
    }, 500)

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
    }
})

/**
 * Enable hot reload on store updates
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFunnelStore, import.meta.hot))
}
