import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const gaDataApi = {
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
  async pageUsersWithQueryString(connectionId, request) {
    // TODO: Breakup 'request' so we know what can be sent
    return await HttpClient.post(`/ga/page-users-with-query-string/${connectionId}`, request)
  },

  /**
   * Fetch users by page path
   *
   * @return promise
   */
  async fetchUsersByPagePath(connectionId, request) {
    return await HttpClient.post(`/ga/users-by-pagepath/${connectionId}`, request)
  },

  /**
   * Fetch users by page path and query string
   *
   * @return promise
   */
    async fetchUsersByPagePathQueryString(connectionId, request) {
      return await HttpClient.post(`/ga/users-by-pagepath-query-string/${connectionId}`, request)
    },

  /**
   * Fetch users by outbound click
   *
   * @return promise
   */
  async fetchUsersByOutboundLink(connectionId, request) {
    return await HttpClient.post(`/ga/users-by-outbound-link/${connectionId}`, request)
  },

  /**
   * Fetch users by outbound click from a given page path
   *
   * @return promise
   */
  async fetchOutboundClicksByPagePath(connectionId, request) {
    return await HttpClient.post(`/ga/outbound-clicks-by-page-path/${connectionId}`, request)
  },
}

export { gaDataApi }
