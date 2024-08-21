import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const adminOrganizationApi = {
    /**
     * List organizations
     *
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    index(params) {
        return HttpClient.get(`/admin/organizations`, { params: params })
    },
    
    /**
     * Store an organization
     *
     * @param Object organization [Properties to create file from]
     * @return promise
     */
    store(organization) {
        return HttpClient.post('/admin/organizations', organization)
    },
}

export { adminOrganizationApi }
