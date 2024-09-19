import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const recommendationsApi = {    
    /**
     * Store an organization
     *
     * @param Object organization [Properties to create file from]
     * @return promise
     */
    store(organization, dashboard, params) {
        return HttpClient.post(`/${organization}/dashboards/${dashboard}/recommendations`, params)
    },
    
    /**
     * Show an organization
     *
     * @param String slug [Organization slug]
     * @return promise
     */
    show(organization, dashboard, id) {
      return HttpClient.get(`/${organization}/dashboards/${dashboard}/recommendations/${id}`)
    },
}

export { recommendationsApi }
