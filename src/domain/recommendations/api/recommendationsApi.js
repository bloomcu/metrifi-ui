import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const recommendationsApi = {    
    index(organizationSlug, params) {
      return HttpClient.get(`/${organizationSlug}/recommendations`, { params: params })
    },

    async store(organizationSlug, params) {
        return await HttpClient.post(`/${organizationSlug}/recommendations`, params)
    },

    async show(organizationSlug, recommendationId) {
      return await HttpClient.get(`/${organizationSlug}/recommendations/${recommendationId}`)
    },

    async update(organizationSlug, recommendationId, params) {
      return await HttpClient.put(`/${organizationSlug}/recommendations/${recommendationId}`, params)
    },

    async generate(organizationSlug, recommendationId) {
        return await HttpClient.put(`/${organizationSlug}/recommendations/${recommendationId}/generate`)
      },

    async attachFile(organizationSlug, recommendationId, fileIds, type) {
      return await HttpClient.post(`/${organizationSlug}/recommendations/${recommendationId}/files`, { 
        file_ids: fileIds,
        type: type
      })
  },
}

export { recommendationsApi }
