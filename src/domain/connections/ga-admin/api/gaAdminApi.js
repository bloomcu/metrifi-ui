import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const gaAdminApi = {
  /**
   * Get the Google auth URL.
   *
   * @return promise
   */
  async listAccounts(token) {
    return await HttpClient.post(`/ga/accounts`, {token: token})
  },
}

export { gaAdminApi }
