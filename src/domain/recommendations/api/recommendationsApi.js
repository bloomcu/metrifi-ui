import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const recommendationsApi = {    

  /**
     * List recommendations
     *
     * @param Integer organization [Id of the dashboard's organization]
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    index(organization, dashboard, params) {
      return HttpClient.get(`/${organization}/dashboards/${dashboard}/recommendations`, { params: params })
    },

    /**
     * Store a recommendation
     *
     * @param Object organization [Properties to create file from]
     * @return promise
     */
    async store(organization, dashboard, params) {
        return await HttpClient.post(`/${organization}/dashboards/${dashboard}/recommendations`, params)
    },
    
    /**
     * Show a recommendation
     *
     * @param String slug [Organization slug]
     * @return promise
     */
    async show(organization, dashboard, id) {
      return await HttpClient.get(`/${organization}/dashboards/${dashboard}/recommendations/${id}`)
    },
}

export { recommendationsApi }
