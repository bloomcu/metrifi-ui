import debounce from 'lodash.debounce'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'
import { funnelApi } from '@/domain/analyses/api/funnelApi'
// const { funnel, addFunnel, addFunnelJob, isReportLoading } = useFunnels()

export const useFunnelStore = defineStore('funnelStore', {
    state: () => ({
        funnels: [],
        funnel: null,
        reportsQueue: [],
        reportsInProgress: [],
        reportsCompleted: [],
        isLoading: false,
        listModalOpen: false,
    }),
    
    getters: {},
    
    actions: {
        index(organization, dashboard, params) {
          this.analyses = []

          funnelApi.index(organization, dashboard, params)
            .then(response => {
              this.analyses = response.data.data
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        async store(organization, dashboard, params) {
          this.isLoading = true

          await funnelApi.store(organization, dashboard, params)
            .then(response => {
              console.log("Funnel: ", response.data.data)
              this.funnel = response.data.data
              this.isLoading = false
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        async show(organization_id, funnel_id) {
          this.isLoading = true
          this.funnel = null

          await funnelApi.show(organization_id, funnel_id)
            .then(response => {
                this.funnel = response.data.data
                addFunnelJob(this.funnel)
                setTimeout(() => isLoading.value = false, 500)
            })
        },

        async update(organization, dashboard, id, params) {
          this.isLoading = true
          
          await funnelApi.update(organization, dashboard, id, params)
            .then(response => {
              this.funnel = response.data.data
              this.isLoading = false
            })
        },

        addFunnelJob(funnel) {
            if (funnel.steps.length) {
                pendingFunnels.push(funnel)
            }
            
            if (!activeFunnels) {
                startNextFunnelJob()
            }
        },

        startNextFunnelJob() {
            if (activeFunnels) {
                completedFunnels.push(activeFunnels)
              }

            if (pendingFunnels.length > 0) {
                activeFunnels = pendingFunnels[0]
                pendingFunnels.shift()
            } else {
                activeFunnels = null
            }
        },

        toggleListModal() {
          this.listModalOpen = !this.listModalOpen
        },
    }
})

/**
 * Enable hot reload on store updates
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useFunnelStore, import.meta.hot))
}
