import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const categoryApi = {
    /**
     * List
     *
     * @param Object params [Key/value params to query by]
     * @return promise
     */
    index(params) {
        return HttpClient.get(`/categories`, { params: params })
    },
    
    /**
     * Store
     *
     * @param Object category [Properties to create category from]
     * @return promise
     */
    store(category) {
        return HttpClient.post(`/categories`, category)
    },
    
    /**
     * Show
     *
     * @param Integer id [Slug of the category you want to show]
     * @return promise
     */
    show(id) {
      return HttpClient.get(`/categories/${id}`)
    },
    
    /**
     * Update
     *
     * @param Integer id [Id of the category you want to update]
     * @param Object  category [Properties to update category with]
     * @return promise
     */
    update(id, category) {
      return HttpClient.put(`/categories/${id}`, category)
    },
    
    /**
     * Destroy
     *
     * @param Integer id [Id of the category you want to destroy]
     * @return promise
     */
    destroy(id) {
        return HttpClient.delete(`/categories/${id}`)
    },
}

export { categoryApi }
