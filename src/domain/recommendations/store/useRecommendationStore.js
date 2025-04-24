import { defineStore, acceptHMRUpdate } from 'pinia'
import { recommendationsApi as RecommendationsApi } from '@/domain/recommendations/api/recommendationsApi'

export const useRecommendationStore = defineStore('recommendationStore', {
    state: () => ({
        recommendation: null,
        recommendations: [],
        isLoading: false,
        selectedBlock: null,
    }),
    
    actions: {
      index(organizationSlug, params) {
        this.isLoading = true
        this.recommendations = []

        RecommendationsApi.index(organizationSlug, params)
          .then(response => {
            this.recommendations = response.data.data
            this.isLoading = false
          }).catch(error => {
            console.log('Error', error.response.data)
            this.isLoading = false
          })
      },

      async store(organizationSlug, dashboardId, recommendation) {
        this.isLoading = true

        return await RecommendationsApi.store(organizationSlug, dashboardId, recommendation)
          .then(response => {
            console.log('Finished storing recommendation', response)
            this.recommendation = response.data.data
            this.recommendations.unshift(response.data.data)
            this.isLoading = false
          }).catch(error => {
            console.log('Error', error.response.data)
            this.isLoading = false
          })
      },
      
      async show(organizationSlug, dashboardId, id) {
        this.isLoading = true
        
        return await RecommendationsApi.show(organizationSlug, dashboardId, id)
          .then(response => {
            this.recommendation = response.data.data
            this.isLoading = false
          })
      },

      async update(organizationSlug, dashboardId, id, params) {
        this.isLoading = true

        await RecommendationsApi.update(organizationSlug, dashboardId, id, params)
          .then(response => {
            this.isLoading = false
          })
      },

      async generate(organizationSlug, recommendationId) {
        this.isLoading = true
        
        return await RecommendationsApi.generate(organizationSlug, recommendationId)
          .then(response => {
            this.isLoading = false
          })
      },

      async replicate(organizationSlug, recommendationId) {
        this.isLoading = true
        
        return await RecommendationsApi.replicate(organizationSlug, recommendationId)
          .then(response => {
            this.recommendation = response.data.data
            this.recommendations.unshift(response.data.data)

            setTimeout(() => this.isLoading = false, 800)
          })
      },

      async attachFile(organizationSlug, recommendationId, fileIds, type) {
        return await RecommendationsApi.attachFile(organizationSlug, recommendationId, fileIds, type)
          .then(response => {
            console.log('Finished attaching file', response.data)
          }).catch(error => {
            console.log('Error error attaching file', error.response.data)
          })
      },
      
      async destroy(organizationSlug, recommendationId) {
        this.isLoading = true
        
        return await RecommendationsApi.destroy(organizationSlug, recommendationId)
          .then(() => {
            this.recommendations = this.recommendations.filter(r => r.id !== recommendationId)
            this.isLoading = false
          }).catch(error => {
            console.log('Error deleting recommendation', error.response?.data)
            this.isLoading = false
          })
      },
      
      isInProgress(status) {
        return status ? ['in_progress', 'completed', 'queued', 'draft'].some(s => status.includes(s)) : false;
      },
      
      isFailed(status) {
        return status ? ['requires_action', 'cancelled', 'failed', 'incomplete', 'expired'].some(s => status.includes(s)) : false;
      }
    }
})

/**
 * Enable hot reload on store updates
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useRecommendationStore, import.meta.hot))
}
