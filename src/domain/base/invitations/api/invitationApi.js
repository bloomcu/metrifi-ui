import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const invitationApi = {
    /**
     * List invitations
     *
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    index(organization, params) {
        return HttpClient.get(`/${organization}/invitations`, { params: params })
    },
    
    /**
     * Store an invitation
     *
     * @param Object invitation [Properties to create invitation from]
     * @return promise
     */
    store(organization, invitation) {
        return HttpClient.post(`/${organization}/invitations`, invitation)
    },
    
    /**
     * Show an invitation
     *
     * @param Integer uuid [Uuid of the invitation you want to show]
     * @return promise
     */
    show(uuid) {
      return HttpClient.get(`/invitations/${uuid}`)
    },
    
    // /**
    //  * Update an invitation
    //  *
    //  * @param Integer id [Id of the invitation you want to update]
    //  * @param Object  invitation [Properties to update invitation with]
    //  * @return promise
    //  */
    // update(organization, id, invitation) {
    //   return HttpClient.put(`/${organization}/invitations/${id}`, invitation)
    // },
    
    /**
     * Destroy an invitation
     *
     * @param Integer id [Id of the invitation you want to destroy]
     * @return promise
     */
    destroy(organization, id) {
        return HttpClient.delete(`/${organization}/invitations/${id}`)
    },
}

export { invitationApi }
