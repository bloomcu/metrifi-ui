import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const userApi = {
    /**
     * List users
     *
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    index(organization, params) {
        return HttpClient.get(`/${organization}/users`, { params: params })
    },
    
    // /**
    //  * Store a user
    //  *
    //  * @param Object user [Properties to create user from]
    //  * @return promise
    //  */
    // store(organization, user) {
    //     return HttpClient.post(`/${organization}/users`, user)
    // },
    
    // /**
    //  * Show a user
    //  *
    //  * @param Integer id [Slug of the user you want to show]
    //  * @return promise
    //  */
    // show(organization, id) {
    //   return HttpClient.get(`/${organization}/users/${id}`)
    // },
    
    // /**
    //  * Update a user
    //  *
    //  * @param Integer id [Id of the user you want to update]
    //  * @param Object  user [Properties to update user with]
    //  * @return promise
    //  */
    // update(organization, id, user) {
    //   return HttpClient.put(`/${organization}/users/${id}`, user)
    // },
    
    /**
     * Destroy a user
     *
     * @param Integer id [Id of the user you want to destroy]
     * @return promise
     */
    destroy(organization, id) {
        return HttpClient.delete(`/${organization}/users/${id}`)
    },
}

export { userApi }
