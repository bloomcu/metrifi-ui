import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const organizationApi = {        
    /**
     * Show an organization
     *
     * @param String organization_slug [Organization organization_slug]
     * @return promise
     */
    show(organization_slug) {
      return HttpClient.get(`/organizations/${organization_slug}`)
    },

    /**
     * Update an organizations
     *
     * @param Integer id [Id of the organization you want to update]
     * @param Object  invitation [Properties to update organization with]
     * @return promise
     */
    update(organization_slug, organization) {
      return HttpClient.put(`/organizations/${organization_slug}`, organization)
    },

    /**
     * Destroy an organization
     *
     * @param Integer id [Id of the organization you want to destroy]
     * @return promise
     */
    destroy(organization_slug) {
        return HttpClient.delete(`/organizations/${organization_slug}`)
    },

    showSubscription(organization_slug) {
        return HttpClient.get(`/organizations/${organization_slug}/subscription`)
    }
}

export { organizationApi }
