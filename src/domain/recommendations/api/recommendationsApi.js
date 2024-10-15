import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const recommendationsApi = {    
    index(organizationSlug, dashboardId, params) {
      return HttpClient.get(`/${organizationSlug}/dashboards/${dashboardId}/recommendations`, { params: params })
    },

    async store(organizationSlug, dashboardId, params) {
        return await HttpClient.post(`/${organizationSlug}/dashboards/${dashboardId}/recommendations`, params)
    },

    async show(organizationSlug, dashboardId, recommendationId) {
      return await HttpClient.get(`/${organizationSlug}/dashboards/${dashboardId}/recommendations/${recommendationId}`)
    },

    async attachFile(organizationSlug, recommendationId, fileIds) {
      return await HttpClient.post(`/${organizationSlug}/recommendations/${recommendationId}/files`, { file_ids: fileIds })
  },
}

export { recommendationsApi }
