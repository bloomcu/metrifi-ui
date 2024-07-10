import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const analysisApi = {    
    /**
     * List organizations
     *
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    index(organization, dashboard, params) {
        return HttpClient.get(`/${organization}/dashboards/${dashboard}/analyses`, { params: params })
    },
    
    /**
     * Store an organization
     *
     * @param Object organization [Properties to create file from]
     * @return promise
     */
    store(organization, dashboard, params) {
        return HttpClient.post(`/${organization}/dashboards/${dashboard}/analyses`, params)
    },
    
    /**
     * Show an organization
     *
     * @param String slug [Organization slug]
     * @return promise
     */
    show(organization, dashboard, id) {
      return HttpClient.get(`/${organization}/dashboards/${dashboard}/analyses/${id}`)
    },
}

export { analysisApi }
