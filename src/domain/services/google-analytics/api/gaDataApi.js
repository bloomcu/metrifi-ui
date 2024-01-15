import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const gaDataApi = {
  /**
   * Run a Google Analytics report.
   *
   * @return promise
   */
  async runReport(connectionId, request) {
    return await HttpClient.get(`/ga/report/${connectionId}`, request)
  },
}

export { gaDataApi }
