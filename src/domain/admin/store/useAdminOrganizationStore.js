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
            try {
              const response = await AdminOrganizationApi.store(organization);
              this.organizations.unshift(response.data.data);
              return Promise.resolve(response); // Explicitly return a resolved promise
            } catch (error) {
              console.log('Error', error.response.data);
              return Promise.reject(error); // Explicitly return a rejected promise
            }
          },
        
        async update(id, organization) {
            try {
              const response = await AdminOrganizationApi.update(id, organization);
              // Update the organization in the list
              const index = this.organizations.findIndex(org => org.id === id);
              if (index !== -1) {
                this.organizations[index] = response.data.data;
              }
              return Promise.resolve(response);
            } catch (error) {
              console.log('Error', error.response.data);
              return Promise.reject(error);
            }
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
