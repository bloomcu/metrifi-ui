import { httpClient as HttpClient } from '@/app/api/base/httpClient'

const fileApi = {
    async index(organization, params) {
        return await HttpClient.get(`${organization}/files?` + new URLSearchParams(params), { params: params })
    },

    async store(organization, file) {
        return await HttpClient.post(`${organization}/files`, file, {
            headers: { "Content-Type": "multipart/form-data" }
        })
    },

    async show(organization, file) {
        return await HttpClient.get(`${organization}/files/${file}`)
    },

    async update(organization, id, file) {
        return await HttpClient.post(`${organization}/files/${id}`, file)
    },

    async destroy(organization, id) {
        return await HttpClient.delete(`${organization}/files/${id}`)
    },
}

export { fileApi }