import { defineStore, acceptHMRUpdate } from 'pinia'
import { recommendationsApi as RecommendationsApi } from '@/domain/recommendations/api/recommendationsApi'

export const useRecommendationStore = defineStore('recommendationStore', {
    state: () => ({
        recommendation: null,
        isLoading: false,
    }),
    
    actions: {        
        async store(organization, dashboard, params) {
          this.isLoading = true
          
          await RecommendationsApi.store(organization, dashboard, params)
            .then(response => {
              this.recommendation = response.data.data
              this.isLoading = false
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        async show(organization, dashboard, id) {
          // console.log('Show recommendation', organization, dashboard, id)
          this.isLoading = true
          // this.recommendation = null
          
          await RecommendationsApi.show(organization, dashboard, id)
            .then(response => {
              this.recommendation = response.data.data
              this.isLoading = false
            })
        },
    }
})

/**
 * Enable hot reload on store updates
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useRecommendationStore, import.meta.hot))
}
