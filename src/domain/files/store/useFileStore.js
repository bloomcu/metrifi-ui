import { defineStore, acceptHMRUpdate } from 'pinia';
import { fileApi } from '@/domain/files/api/fileApi';

export const useFileStore = defineStore('fileStore', {
  state: () => ({
    files: [],
    file: null,
  }),
  
  actions: {
    async index(organization, params) {
      await fileApi.index(organization, params).then(response => {
        this.files = response.data
      })
    },

    async store(organization, file) {
      let formData = new FormData()
	        formData.append('file', file)
      
      return await fileApi.store(organization, formData).then(response => {
        this.files.unshift(response.data.data)
        return response.data.data
      })
    },

    async show(organization, id) {
      await fileApi.show(organization, id).then(response => {
        this.file = response.data
      })
    },

    async update(organization, id, file) {
      await fileApi.update(organization, id, file)
    },

    async destroy(organization, id) {
      await fileApi.destroy(organization, id).then(response => {
        this.files = this.files.filter(f => f.id !== id)
      })
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFileStore, import.meta.hot));
}