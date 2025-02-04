import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const funnelApi = {
  async index(organization, params) {
    return await HttpClient.get(`/${organization}/funnels`, { params: params })
  },
  
  async store(organization, funnel) {
    return await HttpClient.post(`/${organization}/funnels`, funnel)
  },
  
  async show(organization, id) {
    return await HttpClient.get(`/${organization}/funnels/${id}`)
  },
  
  async update(organization, id, funnel) {
    return await HttpClient.put(`/${organization}/funnels/${id}`, funnel)
  },
  
  async destroy(organization, id) {
    return await HttpClient.delete(`/${organization}/funnels/${id}`)
  },

  async replicate(organization, funnelId) {
    return await HttpClient.post(`/${organization}/funnels-replicate/${funnelId}`)
  },

  async storeStep(organization, id, step) {
    return await HttpClient.post(`/${organization}/funnels/${id}/steps`, step)
  },

  async updateStep(organization, funnelId, stepId, step) {
    return await HttpClient.put(`/${organization}/funnels/${funnelId}/steps/${stepId}`, step)
  },

  async destroyStep(organization, funnelId, stepId) {
    return await HttpClient.delete(`/${organization}/funnels/${funnelId}/steps/${stepId}`)
  },

  async generateFunnels(organization, connection, params) {
    return await HttpClient.get(`/${organization}/generate/funnels/${connection}`, { params: params })
  },

  async generateSteps(organization, funnel, params) {
    return await HttpClient.get(`/${organization}/generate/steps/${funnel}`, { params: params })
  },

  async generateOutboundLinksMessage(organization, funnel) {
    return await HttpClient.get(`/${organization}/generate/outbound-links/${funnel}`)
  },

  async search(organization, params) {
    return await HttpClient.get(`/${organization}/funnels-search`, { params: params })
  },
}

export { funnelApi }
