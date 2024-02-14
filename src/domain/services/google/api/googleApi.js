import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const googleApi = {
  /**
   * Get the Google auth URL.
   *
   * @return promise
   */
  async connect(params) {
    return await HttpClient.post(`/google/connect`, params)
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
