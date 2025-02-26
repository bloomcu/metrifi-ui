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

    async update(organizationSlug, dashboardId, recommendationId, params) {
      return await HttpClient.put(`/${organizationSlug}/dashboards/${dashboardId}/recommendations/${recommendationId}`, params)
    },

    async attachFile(organizationSlug, recommendationId, fileIds, type) {
      return await HttpClient.post(`/${organizationSlug}/recommendations/${recommendationId}/files`, { 
        file_ids: fileIds,
        type: type
      })
  },
}

export { recommendationsApi }
