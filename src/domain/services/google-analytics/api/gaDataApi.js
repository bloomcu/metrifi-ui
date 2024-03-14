import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const gaDataApi = {
  /**
   * Get a funnel report
   *
   * @return promise
   */
  async funnelReport(connectionId, request) {
    // TODO: Breakup 'request' so we know what can be sent
    return await HttpClient.post(`/ga/funnel-report/${connectionId}`, request)
  },

  /**
   * Fetch users by page (pagePath)
   *
   * @return promise
   */
  async pageUsers(connectionId, request) {
    // TODO: Breakup 'request' so we know what can be sent
    return await HttpClient.post(`/ga/page-users/${connectionId}`, request)
  },

  /**
   * Fetch users by virtual page (page path plus query string)
   *
   * @return promise
   */
  async pagePlusQueryStringUsers(connectionId, request) {
    // TODO: Breakup 'request' so we know what can be sent
    return await HttpClient.post(`/ga/page-plus-query-string-users/${connectionId}`, request)
  },

  /**
   * Fetch users by outbound click
   *
   * @return promise
   */
  async outboundLinkUsers(connectionId, request) {
    return await HttpClient.post(`/ga/outbound-link-users/${connectionId}`, request)
  },

  /**
   * Fetch users by outbound click from a given page path
   *
   * @return promise
   */
  async outboundLinkByPagePathUsers(connectionId, request) {
    return await HttpClient.post(`/ga/outbound-link-by-page-path-users/${connectionId}`, request)
  },
}

export { gaDataApi }
