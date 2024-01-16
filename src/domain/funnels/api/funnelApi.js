import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const funnelApi = {
    /**
     * List funnels
     *
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    async index(organization, params) {
        return await HttpClient.get(`/${organization}/funnels`, { params: params })
    },
    
    /**
     * Store a funnel
     *
     * @param Object funnel [Properties to create funnel from]
     * @return promise
     */
    async store(organization, funnel) {
        return await HttpClient.post(`/${organization}/funnels`, funnel)
    },
    
    /**
     * Show a funnel
     *
     * @param Integer id [Id of the funnel you want to show]
     * @return promise
     */
    async show(organization, id) {
      return await HttpClient.get(`/${organization}/funnels/${id}`)
    },
    
    /**
     * Update a funnel
     *
     * @param Integer id [Id of the funnel you want to update]
     * @param Object  funnel [Properties to update funnel with]
     * @return promise
     */
    async update(organization, id, funnel) {
      return await HttpClient.put(`/${organization}/funnels/${id}`, funnel)
    },
    
    /**
     * Destroy a funnel
     *
     * @param Integer id [Id of the file you want to destroy]
     * @return promise
     */
    async destroy(organization, id) {
        return await HttpClient.delete(`/${organization}/funnels/${id}`)
    },
}

export { funnelApi }
