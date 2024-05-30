import { defineStore, acceptHMRUpdate } from 'pinia'
import { organizationMetaApi as OrganizationMetaApi } from '@/domain/base/organizations/api/organizationMetaApi'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'

export const useOrganizationMetaStore = defineStore('organizationMetaStore', {
    state: () => ({
        metas: [],
        meta: [],
        isLoading: false,
    }),
    
    getters: {
      filterByKey: (state) => {
        return (key) => state.metas.filter((meta) => {
          return meta.key == key
        })
      }
    },
    
    actions: {        
        index(params) {
          this.meta = []
          const auth = useAuthStore()
          
          OrganizationMetaApi.index(auth.organization.slug)
            .then(response => {
              // console.log(response)
              this.metas = response.data
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        async store(meta) {
          const auth = useAuthStore()
          
          await OrganizationMetaApi.store(auth.organization.slug, meta)
            .then(response => {
              // this.metas.unshift(response.data)
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        show(key) {
          const auth = useAuthStore()
          
          OrganizationMetaApi.show(auth.organization.slug, key)
            .then(response => {
              // console.log(response.data.value)
              this.meta = response.data.value
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        destroy(meta) {
          const auth = useAuthStore()
          
          this.metas = this.metas.filter((m) => m.id !== meta.id)
          
          // OrganizationMetaApi.destroy(auth.organization.slug, meta.id)
          //   .then(response => {
          //     console.log('Meta successfully destroyed')
          //   }).catch(error => {
          //     this.metas.unshift(meta)
          //     console.log('Error', error.response.data)
          //   })
        },
    }
})

/**
 * Enable hot reload on store updates
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useOrganizationMetaStore, import.meta.hot))
}
