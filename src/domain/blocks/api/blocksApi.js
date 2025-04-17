import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const blocksApi = {    
    async update(organizationSlug, blockId, params) {
      return await HttpClient.put(`/${organizationSlug}/blocks/${blockId}`, params)
    },

    async regenerate(organizationSlug, blockId, params) {
        return await HttpClient.put(`/${organizationSlug}/blocks/${blockId}/regenerate`)
    },

    async getVersions(organizationSlug, blockId) {
        return await HttpClient.get(`/${organizationSlug}/blocks/${blockId}/versions`)
    },

    async revert(organizationSlug, blockId) {
        return await HttpClient.put(`/${organizationSlug}/blocks/${blockId}/versions/revert`)
    },

    async advance(organizationSlug, blockId) {
        return await HttpClient.put(`/${organizationSlug}/blocks/${blockId}/versions/advance`)
    },
}

export { blocksApi }
