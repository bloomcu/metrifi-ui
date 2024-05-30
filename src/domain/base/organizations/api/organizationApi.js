import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const organizationApi = {    
    /**
     * List organizations
     *
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    index(params) {
        return HttpClient.get(`/organizations`, { params: params })
    },
    
    /**
     * Store an organization
     *
     * @param Object organization [Properties to create file from]
     * @return promise
     */
    store(organization) {
        return HttpClient.post('/organizations', organization)
    },
    
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
