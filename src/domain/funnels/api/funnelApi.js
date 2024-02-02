import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const funnelApi = {
    /**
     * Generate a funnel
     *
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    async generate(organization, connection, params) {
        return await HttpClient.get(`/${organization}/generate/${connection}`, { params: params })
    },

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

    /**
     * Store a funnel step
     *
     * @param Object funnel [Properties to create funnel from]
     * @return promise
     */
    async storeStep(organization, id, step) {
        return await HttpClient.post(`/${organization}/funnels/${id}/steps`, step)
    },

    /**
     * Update a step
     *
     * @param Integer id [Id of the funnel you want to update]
     * @param Object  funnel [Properties to update funnel with]
     * @return promise
     */
    async updateStep(organization, funnelId, stepId, step) {
        return await HttpClient.put(`/${organization}/funnels/${funnelId}/steps/${stepId}`, step)
    },

    /**
     * Destroy a funnel step
     *
     * @param Integer id [Id of the file you want to destroy]
     * @return promise
     */
    async destroyStep(organization, funnelId, stepId) {
        return await HttpClient.delete(`/${organization}/funnels/${funnelId}/steps/${stepId}`)
    },
}

export { funnelApi }
