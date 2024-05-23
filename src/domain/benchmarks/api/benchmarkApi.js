import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const benchmarkApi = {
    /**
     * List
     *
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    index(params) {
        return HttpClient.get(`/benchmarks`, { params: params })
    },
    
    /**
     * Store
     *
     * @param Object benchmark [Properties to create benchmark from]
     * @return promise
     */
    store(benchmark) {
        return HttpClient.post(`/benchmarks`, benchmark)
    },
    
    /**
     * Show
     *
     * @param Integer id [Slug of the benchmark you want to show]
     * @return promise
     */
    show(id) {
      return HttpClient.get(`/benchmarks/${id}`)
    },
    
    /**
     * Update
     *
     * @param Integer id [Id of the benchmark you want to update]
     * @param Object  benchmark [Properties to update benchmark with]
     * @return promise
     */
    update(id, benchmark) {
      return HttpClient.put(`/benchmarks/${id}`, benchmark)
    },
    
    /**
     * Destroy
     *
     * @param Integer id [Id of the benchmark you want to destroy]
     * @return promise
     */
    destroy(id) {
        return HttpClient.delete(`/benchmarks/${id}`)
    },
}

export { benchmarkApi }
