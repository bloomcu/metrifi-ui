import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const gaDataApi = {
  /**
   * Run a Google Analytics report.
   *
   * @return promise
   */
  async runReport(connectionId, request) {
    return await HttpClient.post(`/ga/report/${connectionId}`, request)
  },

  // /**
  //  * Export a Google Analytics report.
  //  *
  //  * @return promise
  //  */
  // async exportReport(connectionId, request) {
  //   return await HttpClient.post(`/ga/export/${connectionId}`, request)
  // },
}

export { gaDataApi }
