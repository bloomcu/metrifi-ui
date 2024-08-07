import { defineStore, acceptHMRUpdate } from 'pinia'
import { organizationApi as OrganizationApi } from '@/domain/base/organizations/api/organizationApi'

import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'

export const useOrganizationStore = defineStore('organizationStore', {
    state: () => ({
        organizations: [],
        organization: null,
        isLoading: true,
        createModalOpen: false,
        updateModalOpen: false,
        destroyModalOpen: false,
    }),
    
    getters: {},
    
    actions: {
      async show(slug) {
        this.isLoading = true
        this.organization = null
        
        await OrganizationApi.show(slug)
          .then(response => {
            this.organization = response.data.data
            this.isLoading = false
          })
      },
      
      async update() {
        this.isLoading = true
        
        await OrganizationApi.update(this.organization.slug, this.organization)
          .then(response => {
            console.log('Site successfully updated')
            this.isLoading = false
          })
      },
      
      async destroy(slug) {
        this.isLoading = true
        
        await OrganizationApi.destroy(slug)
          .then(response => {
            this.organizations = this.organizations.filter((organization) => organization.slug !== slug)
            this.isLoading = false
          })
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
    import.meta.hot.accept(acceptHMRUpdate(useOrganizationStore, import.meta.hot))
}
