import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const blocksApi = {    
    async update(organizationSlug, blockId, params) {
      return await HttpClient.put(`/${organizationSlug}/blocks/${blockId}`, params)
    },

    async regenerate(organizationSlug, blockId, params) {
        return await HttpClient.put(`/${organizationSlug}/blocks/${blockId}/regenerate`)
    },

    async revert(organizationSlug, blockId, versionId) {
        return await HttpClient.put(`/${organizationSlug}/blocks/${blockId}/versions/${versionId}`)
    },
}

export { blocksApi }
