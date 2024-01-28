import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const gaDataApi = {
  /**
   * Fetch page views
   *
   * @return promise
   */
  async fetchPageViews(connectionId, request) {
    return await HttpClient.post(`/ga/page-views/${connectionId}`, request)
  },

  /**
   * Fetch outbound clicks
   *
   * @return promise
   */
  async fetchOutboundClicks(connectionId, request) {
    return await HttpClient.post(`/ga/outbound-clicks/${connectionId}`, request)
  },

  // /**
  //  * Run a Google Analytics report.
  //  *
  //  * @return promise
  //  */
  // async runReport(connectionId, request) {
  //   return await HttpClient.post(`/ga/report/${connectionId}`, request)
  // },

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
