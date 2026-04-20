import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const adminDashboardApi = {
    /**
     * List dashboards (paginated, 50 per page)
     *
     * Response format (Laravel paginated):
     * { data: [...], links: { first, last, prev, next }, meta: { current_page, last_page, per_page, total, from, to } }
     *
     * @param Object params [page, sort, direction - optional query params]
     * @return promise
     */
    index(params = {}) {
        return HttpClient.get(`/admin/dashboards`, { params })
    },

    /**
     * Analyze all dashboards
     *
     * @return promise
     */
    analyzeAll() {
        return HttpClient.get(`/admin/dashboards/analyze`)
    },
}

export { adminDashboardApi }
