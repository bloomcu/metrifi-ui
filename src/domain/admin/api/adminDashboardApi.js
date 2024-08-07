import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const adminDashboardApi = {
    /**
     * List all dashboards
     *
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    index(params) {
        return HttpClient.get(`/admin/dashboards`, { params: params })
    },
}

export { adminDashboardApi }
