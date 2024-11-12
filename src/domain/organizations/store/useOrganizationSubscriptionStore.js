import { defineStore, acceptHMRUpdate } from 'pinia'
import { organizationSubscriptionApi as OrganizationSubscriptionApi } from '@/domain/base/organizations/api/organizationSubscriptionApi'

export const useOrganizationSubscriptionStore = defineStore('organizationSubscriptionStore', {
    state: () => ({
        subscription: null,
        isLoading: true,
    }),

    getters: {
      recommendationsRemaining: (state) => 
        state.subscription?.plan?.limits?.recommendations != null && state.subscription.recommendations_used != null
          ? Math.max(state.subscription.plan.limits.recommendations - state.subscription.recommendations_used, 0)
          : 0,

      percentageOfUsageRemaining: (state) => 
        state.subscription?.recommendations_used != null && state.subscription?.plan?.limits?.recommendations
          ? Math.max(100 - (state.subscription.recommendations_used / state.subscription.plan.limits.recommendations) * 100, 0)
          : 100,
    
      limitExceeded: (state) => 
        state.subscription?.recommendations_used != null && state.subscription?.plan?.limits?.recommendations != null
          ? state.subscription.recommendations_used >= state.subscription.plan.limits.recommendations
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
