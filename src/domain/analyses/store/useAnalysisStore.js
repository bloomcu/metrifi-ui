import { defineStore, acceptHMRUpdate } from 'pinia'
import { analysisApi as AnalysisApi } from '@/domain/analyses/api/analysisApi'

export const useAnalysisStore = defineStore('analysisStore', {
    state: () => ({
        analyses: [],
        analysis: null,
        isLoading: false,
        showModalOpen: false,
        createModalOpen: false,
        updateModalOpen: false,
        destroyModalOpen: false,
    }),
    
    getters: {},
    
    actions: {
        index(organization, dashboard, params) {
          this.analyses = []

          AnalysisApi.index(organization, dashboard, params)
            .then(response => {
              this.analyses = response.data.data
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        async store(organization, dashboard, params) {
          this.isLoading = true
          
          await AnalysisApi.store(organization, dashboard, params)
            .then(response => {
              // console.log(response)
              // console.log("Analysis: ", response.data.data)
              this.analysis = response.data.data
              this.isLoading = false
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        async show(organization, dashboard, id) {
          this.isLoading = true
          this.analysis = null
          
          await AnalysisApi.show(organization, dashboard, id)
            .then(response => {
              this.analysis = response.data.data
              this.isLoading = false
            })
        },

        async update(organization, dashboard, id, params) {
          this.isLoading = true
          
          await AnalysisApi.update(organization, dashboard, id, params)
            .then(response => {
              this.analysis = response.data.data
              this.isLoading = false
            })
        },

        toggleShowModal() {
          this.showModalOpen = !this.showModalOpen
        },
        
        toggleCreateModal() {
          this.createModalOpen = !this.createModalOpen
        },

        toggleUpdateModal() {
          this.updateModalOpen = !this.updateModalOpen
        },

        toggleDestroyModal() {
          this.destroyModalOpen = !this.destroyModalOpen
        }
    }
})

/**
 * Enable hot reload on store updates
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAnalysisStore, import.meta.hot))
}
