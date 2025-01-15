import { defineStore, acceptHMRUpdate } from 'pinia'
import { organizationApi as OrganizationApi } from '@/domain/base/organizations/api/organizationApi'

export const useOrganizationStore = defineStore('organizationStore', {
    state: () => ({
        organizations: [],
        organization: null,
        isLoading: true,
        emailButtonLabel: "Send weekly email to Super Admins",
        createModalOpen: false,
        updateModalOpen: false,
        destroyModalOpen: false,
    }),
    
    getters: {},
    
    actions: {
      async show(organization_slug) {
        this.isLoading = true
        this.organization = null
        
        await OrganizationApi.show(organization_slug)
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
      
      async destroy(organization_slug) {
        this.isLoading = true
        
        await OrganizationApi.destroy(organization_slug)
          .then(response => {
            this.organizations = this.organizations.filter((organization) => organization.slug !== organization_slug)
            this.isLoading = false
          })
      },
      
      async sendWeeklyAnalysisEmail(organization_slug) {
        this.emailButtonLabel = "Sending...";

        try {
            await OrganizationApi.sendWeeklyAnalysisEmail(organization_slug);

            setTimeout(() => {
                this.emailButtonLabel = "Email sent";
            }, 1500);

            setTimeout(() => {
                this.emailButtonLabel = "Send weekly email to Super Admins";
            }, 3000);
        } catch (error) {
            console.error("Failed to send email:", error);
            this.emailButtonLabel = "Send weekly email to Super Admins";
        }
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
