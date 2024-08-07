import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const organizationApi = {        
    /**
     * Show an organization
     *
     * @param String slug [Organization slug]
     * @return promise
     */
    show(slug) {
      return HttpClient.get(`/organizations/${slug}`)
    },

    /**
     * Update an organizations
     *
     * @param Integer id [Id of the organization you want to update]
     * @param Object  invitation [Properties to update organization with]
     * @return promise
     */
    update(slug, organization) {
      return HttpClient.put(`/organizations/${slug}`, organization)
    },

    /**
     * Destroy an organization
     *
     * @param Integer id [Id of the organization you want to destroy]
     * @return promise
     */
    destroy(slug) {
        return HttpClient.delete(`/organizations/${slug}`)
    },
}

export { organizationApi }
