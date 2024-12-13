import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const adminFunnelApi = {
    /**
     * List all funnels
     *
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    index(params) {
        return HttpClient.get(`/admin/funnels`, { params: params })
    },
}

export { adminFunnelApi }
