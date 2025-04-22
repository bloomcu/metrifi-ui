import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const blocksApi = {    
    async store(organizationSlug, params) {
        return await HttpClient.post(`/${organizationSlug}/blocks/`, params)
    },
    
    async update(organizationSlug, blockId, params) {
        return await HttpClient.put(`/${organizationSlug}/blocks/${blockId}`, params)
    },

    async destroy(organizationSlug, blockId) {
        return await HttpClient.delete(`/${organizationSlug}/blocks/${blockId}`)
    },

    async regenerate(organizationSlug, blockId, params) {
        return await HttpClient.put(`/${organizationSlug}/blocks/${blockId}/regenerate`)
    },

    async revert(organizationSlug, blockId, versionId) {
        return await HttpClient.put(`/${organizationSlug}/blocks/${blockId}/versions/${versionId}`)
    },

    async reorder(organizationSlug, blockId, order) {
        return await HttpClient.put(`/${organizationSlug}/blocks/${blockId}/reorder`, { order: order})
      },
}

export { blocksApi }
