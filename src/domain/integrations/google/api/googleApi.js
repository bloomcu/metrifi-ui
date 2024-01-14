import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const googleApi = {
  /**
   * Get the Google auth URL.
   *
   * @return promise
   */
  async connect(scope) {
    return await HttpClient.post(`/google/connect`, {scope: scope})
  },

  /**
   * Handle the Google auth callback.d
   * Save the Google auth token and associate with user.
   *
   * @return promise
   */
  async callback(code) {
    return await HttpClient.post(`/google/callback`, {code: code})
  },
}

export { googleApi }
