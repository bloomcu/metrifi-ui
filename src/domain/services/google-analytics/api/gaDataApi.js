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

  /**
   * Fetch outbound clicks by page path
   *
   * @return promise
   */
  async fetchOutboundClicksByPagePath(connectionId, request) {
    return await HttpClient.post(`/ga/outbound-clicks-by-page-path/${connectionId}`, request)
  },
}

export { gaDataApi }
