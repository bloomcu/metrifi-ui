import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const dashboardApi = {
  async index(organization, params) {
      return await HttpClient.get(`/${organization}/dashboards`, { params: params })
  },
  
  async store(organization, dashboard) {
      return await HttpClient.post(`/${organization}/dashboards`, dashboard)
  },
  
  async show(organization, id) {
    return await HttpClient.get(`/${organization}/dashboards/${id}`)
  },
  
  async update(organization_id, dashboard_id, params) {
    return await HttpClient.put(`/${organization_id}/dashboards/${dashboard_id}`, params)
  },
  
  async destroy(organization, id) {
      return await HttpClient.delete(`/${organization}/dashboards/${id}`)
  },

  async replicate(organization, id) {
    return await HttpClient.post(`/${organization}/dashboards-replicate/${id}`)
  },

  async attachFunnels(organization, dashboardId, funnelIds) {
    return await HttpClient.post(`/${organization}/dashboards/${dashboardId}/funnels/attach`, {
      funnel_ids: funnelIds
    })
  },

  async detachFunnel(organization, dashboardId, funnelId) {
    return await HttpClient.post(`/${organization}/dashboards/${dashboardId}/funnels/detach`, {
      funnel_id: funnelId
    })
  },

  async reorderFunnel(organization, dashboardId, params) {
    return await HttpClient.post(`/${organization}/dashboards/${dashboardId}/funnels/reorder`, {
      funnel_id: params.funnel_id,
      order: params.order
    })
  },

  async toggleFunnelStep(organization_id, dashboard_id, funnel_id, params) {
    return await HttpClient.post(`/${organization_id}/dashboards/${dashboard_id}/funnels/${funnel_id}/toggle-step`, params)
  },

  async enableFunnelSteps(organization_id, dashboard_id, funnel_id) {
    return await HttpClient.post(`/${organization_id}/dashboards/${dashboard_id}/funnels/${funnel_id}/enable-steps`)
  },
}

export { dashboardApi }
