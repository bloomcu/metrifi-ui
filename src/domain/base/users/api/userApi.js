import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const userApi = {
    index(organization, params) {
        return HttpClient.get(`/${organization}/users`, { params: params })
    },
    
    // store(organization, user) {
    //     return HttpClient.post(`/${organization}/users`, user)
    // },
    
    show(organization, id) {
      return HttpClient.get(`/${organization}/users/${id}`)
    },
    
    update(organization, id, user) {
      return HttpClient.post(`/${organization}/users/${id}`, user)
    },
    
    destroy(organization, id) {
        return HttpClient.delete(`/${organization}/users/${id}`)
    },
}

export { userApi }
