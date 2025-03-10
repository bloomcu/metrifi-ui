import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const adminFunnelApi = {
    index(params) {
        return HttpClient.get(`/admin/funnels`, { params: params })
    },

    snapshotAll() {
        return HttpClient.get(`/admin/funnels/snapshot`)
    },
}

export { adminFunnelApi }
