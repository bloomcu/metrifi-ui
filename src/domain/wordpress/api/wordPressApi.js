import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const wordPressApi = {
  /**
   * Create a wordpress page
   *
   * @return promise
   */
  async storePage(organizationSlug, params) {
    return await HttpClient.post(`/${organizationSlug}/wordpress/pages`, params)
  },
}

export { wordPressApi }
