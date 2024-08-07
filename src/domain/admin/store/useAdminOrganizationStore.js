import { defineStore, acceptHMRUpdate } from 'pinia'
import { adminOrganizationApi as AdminOrganizationApi } from '@/domain/admin/api/adminOrganizationApi'

export const useAdminOrganizationStore = defineStore('adminOrganizationStore', {
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
        index(params) {
          this.organizations = []
          AdminOrganizationApi.index(params)
            .then(response => {
              this.organizations = response.data.data
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        async store(organization) {
          await AdminOrganizationApi.store(organization)
            .then(response => {
              this.organizations.unshift(response.data.data)
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        
        toggleCreateModal() {
          this.createModalOpen = !this.createModalOpen
        },
    }
})

/**
 * Enable hot reload on store updates
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useAdminOrganizationStore, import.meta.hot))
}
