import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const dashboardApi = {
    /**
     * List dashboards
     *
     * @param Integer organization [Id of the dashboard's organization]
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    async index(organization, params) {
        return await HttpClient.get(`/${organization}/dashboards`, { params: params })
    },
    
    /**
     * Store a dashboard
     *
     * @param Integer organization [Id of the dashboard's organization]
     * @param Object dashboard [Properties to create dashboard from]
     * @return promise
     */
    async store(organization, dashboard) {
        return await HttpClient.post(`/${organization}/dashboards`, dashboard)
    },
    
    /**
     * Show a dashboard
     *
     * @param Integer organization [Id of the dashboard's organization]
     * @param Integer id [Id of the dashboard you want to show]
     * @return promise
     */
    async show(organization, id) {
      return await HttpClient.get(`/${organization}/dashboards/${id}`)
    },
    
    /**
     * Update a dashboard
     *
     * @param Integer organization [Id of the dashboard's organization]
     * @param Integer id [Id of the dashboard you want to update]
     * @param Object  dashboard [Properties to update dashboard with]
     * @return promise
     */
    async update(organization_id, dashboard_id, params) {
      return await HttpClient.put(`/${organization_id}/dashboards/${dashboard_id}`, params)
    },
    
    /**
     * Destroy a dashboard
     * 
     * @param Integer organization [Id of the dashboard's organization]
     * @param Integer id [Id of the file you want to destroy]
     * @return promise
     */
    async destroy(organization, id) {
        return await HttpClient.delete(`/${organization}/dashboards/${id}`)
    },

    /**
     * Attach funnel to a dashboard
     *
     * @param Integer organization [Id of the dashboard's organization]
     * @param Integer dashboardId [Id of the dashboard to attach to]
     * @param Array funnelId [Id of the funnel to attach]
     * @return promise
     */
    async attachFunnels(organization, dashboardId, funnelIds) {
        return await HttpClient.post(`/${organization}/dashboards/${dashboardId}/funnels/attach`, {
            funnel_ids: funnelIds
        })
    },

    /**
     * Detach funnel from a dashboard
     *
     * @param Integer organization [Id of the dashboard's organization]
     * @param Integer dashboardId [Id of the dashboard to detach from]
     * @param Array funnelId [Id of the funnel to detach]
     * @return promise
     */
    async detachFunnel(organization, dashboardId, funnelId) {
        return await HttpClient.post(`/${organization}/dashboards/${dashboardId}/funnels/detach`, {
            funnel_id: funnelId
        })
    },

    /**
     * Reorder a dashboard funnel
     *
     * @param Integer organization [Id of the dashboard's organization]
     * @param Integer dashboardId [Id of the dashboard to detach from]
     * @param Array params.funnelId [Id of the funnel to detach]
     * @param Integer params.order [order of the funnel in the dashboard]
     * @return promise
     */
    async reorderFunnel(organization, dashboardId, params) {
        return await HttpClient.post(`/${organization}/dashboards/${dashboardId}/funnels/reorder`, {
            funnel_id: params.funnel_id,
            order: params.order
        })
    },

    /**
     * Disable/Enable a funnel step
     *
     * @param Integer organization_id
     * @param Integer dashboard_id
     * @param Integer funnel_id
     * @param Object  params.step_id [id of the funnel step to toggle]
     * @return promise
     */
    async toggleFunnelStep(organization_id, dashboard_id, funnel_id, params) {
        return await HttpClient.post(`/${organization_id}/dashboards/${dashboard_id}/funnels/${funnel_id}/toggle-step`, params)
    },

    /**
     * Enable all funnel steps
     *
     * @param Integer organization_id
     * @param Integer dashboard_id
     * @param Integer funnel_id
     * @return promise
     */
    async enableFunnelSteps(organization_id, dashboard_id, funnel_id) {
        return await HttpClient.post(`/${organization_id}/dashboards/${dashboard_id}/funnels/${funnel_id}/enable-steps`)
    },
}

export { dashboardApi }
