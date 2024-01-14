import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const integrationApi = {
    /**
     * List integrations
     *
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    index(organization, params) {
        return HttpClient.get(`/${organization}/integrations`, { params: params })
    },
    
    /**
     * Store a integration
     *
     * @param Object integration [Properties to create integration from]
     * @return promise
     */
    store(organization, integration) {
        return HttpClient.post(`/${organization}/integrations`, integration)
    },
    
    // /**
    //  * Show a integration
    //  *
    //  * @param Integer id [Slug of the integration you want to show]
    //  * @return promise
    //  */
    // show(organization, id) {
    //   return HttpClient.get(`/${organization}/integrations/${id}`)
    // },
    
    // /**
    //  * Update a integration
    //  *
    //  * @param Integer id [Id of the integration you want to update]
    //  * @param Object  integration [Properties to update integration with]
    //  * @return promise
    //  */
    // update(organization, id, integration) {
    //   return HttpClient.put(`/${organization}/integrations/${id}`, integration)
    // },
    
    // /**
    //  * Destroy a integration
    //  *
    //  * @param Integer id [Id of the file you want to destroy]
    //  * @return promise
    //  */
    // destroy(organization, id) {
    //     return HttpClient.delete(`/${organization}/integrations/${id}`)
    // },
}

export { integrationApi }
