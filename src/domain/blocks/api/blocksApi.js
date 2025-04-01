import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const blocksApi = {    
    async update(organizationSlug, blockId, params) {
      return await HttpClient.put(`/${organizationSlug}/blocks/${blockId}`, params)
    },

    async regenerate(organizationSlug, blockId, params) {
        return await HttpClient.put(`/${organizationSlug}/blocks/${blockId}/regenerate`)
      }
}

export { blocksApi }
