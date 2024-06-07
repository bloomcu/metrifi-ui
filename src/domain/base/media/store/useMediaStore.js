import { defineStore, acceptHMRUpdate } from 'pinia'
import { mediaApi as MediaApi } from '@/domain/base/media/api/mediaApi'

import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'

export const useMediaStore = defineStore('mediaStore', {
    state: () => ({
        files: [],
        file: {},
        isLoading: false,
    }),
    
    getters: {
      filterByTag: (state) => {
        return (tag) => state.files.filter((file) => {
          return file.tags.includes(tag)
        })
      }
    },
    
    actions: {
        index(params) {
          const auth = useAuthStore()
          
          this.isLoading = true
          this.files = []
          
          MediaApi.index(auth.organization.slug, params)
            .then(response => {
              this.isLoading = false
              this.files = response.data.data
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        async store(file, collection, tags) {
          const auth = useAuthStore()

          return await MediaApi.store(auth.organization.slug, file, collection, tags)
            .then(response => {
              this.files.unshift(response.data.data)
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        show(id) {},
        
        update() {},
        
        destroy(file) {
          // TODO: Let's not accept the whole file
          // Find it and cache it here instead
          const auth = useAuthStore()
          
          this.files = this.files.filter((f) => f.id !== file.id)
          
          MediaApi.destroy(auth.organization.slug, file.id)
            .then(response => {
              console.log('File successfully destroyed')
            }).catch(error => {
              this.files.unshift(file)
              console.log('Error', error.response.data)
            })
        },
    }
})

/**
 * Enable hot reload on store updates
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useMediaStore, import.meta.hot))
}
