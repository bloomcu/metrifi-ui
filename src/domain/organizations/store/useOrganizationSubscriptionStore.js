import { defineStore, acceptHMRUpdate } from 'pinia'
import { organizationSubscriptionApi as OrganizationSubscriptionApi } from '@/domain/base/organizations/api/organizationSubscriptionApi'

export const useOrganizationSubscriptionStore = defineStore('organizationSubscriptionStore', {
    state: () => ({
        subscription: null,
        isLoading: true,
    }),

    getters: {
      /**
       * Calculates the number of recommendations remaining in the subscription plan.
       * Returns the difference between the effective limit and used recommendations, or 0 if exceeded.
       */
      recommendationsRemaining: (state, getters) => 
        state.subscription?.recommendations_limit != null && state.subscription?.recommendations_used != null
          ? Math.max(state.subscription?.recommendations_limit - state.subscription.recommendations_used, 0)
          : 0,

      /**
       * Calculates the percentage of recommendations remaining as compared to the total limit.
       * Returns a value between 0-100 representing the percentage of unused recommendations.
       */
      percentageOfUsageRemaining: (state, getters) => 
        state.subscription?.recommendations_used != null && state.subscription?.recommendations_limit
          ? Math.max(100 - (state.subscription.recommendations_used / state.subscription?.recommendations_limit) * 100, 0)
          : 100,
    
      /**
       * Determines if the subscription has exceeded its recommendation limit.
       * Returns true when the number of used recommendations is greater than or equal to the effective limit.
       * Takes into account the organization's custom recommendations_limit if set.
       */
      limitExceeded: (state, getters) => 
        state.subscription?.recommendations_used != null && state.subscription?.recommendations_limit != null
          ? state.subscription.recommendations_used >= state.subscription?.recommendations_limit
          : false,
    },
    
    actions: {
      async show(organization_slug) {
        this.isLoading = true
        
        await OrganizationSubscriptionApi.show(organization_slug)
          .then(response => {
            this.subscription = response.data
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
    import.meta.hot.accept(acceptHMRUpdate(useOrganizationSubscriptionStore, import.meta.hot))
}
