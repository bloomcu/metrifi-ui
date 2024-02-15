import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const connectionApi = {
    /**
     * List connections
     *
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    index(organization, params) {
        return HttpClient.get(`/${organization}/connections`, { params: params })
    },
    
    /**
     * Store a connection
     *
     * @param Object connection [Properties to create connection from]
     * @return promise
     */
    store(organization, connection) {
        return HttpClient.post(`/${organization}/connections`, connection)
    },
    
    // /**
    //  * Show a connection
    //  *
    //  * @param Integer id [Slug of the connection you want to show]
    //  * @return promise
    //  */
    // show(organization, id) {
    //   return HttpClient.get(`/${organization}/connections/${id}`)
    // },
    
    // /**
    //  * Update a connection
    //  *
    //  * @param Integer id [Id of the connection you want to update]
    //  * @param Object  connection [Properties to update connection with]
    //  * @return promise
    //  */
    // update(organization, id, connection) {
    //   return HttpClient.put(`/${organization}/connections/${id}`, connection)
    // },
    
    /**
     * Destroy a connection
     *
     * @param Integer connectionId [Id of the connection you want to destroy]
     * @return promise
     */
    destroy(organization, connectionId) {
        return HttpClient.delete(`/${organization}/connections/${connectionId}`)
    },
}

export { connectionApi }
