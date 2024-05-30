import { defineStore, acceptHMRUpdate } from 'pinia'
import { organizationCommentsApi as OrganizationCommentsApi } from '@/domain/base/organizations/api/organizationCommentsApi'

import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'

export const useOrganizationCommentsStore = defineStore('organizationCommentsStore', {
    state: () => ({
        comments: [],
        comment: [],
        isLoading: false,
    }),
    
    getters: {
      filterByGroup: (state) => {
        return (group) => state.comments.filter((comment) => {
          return comment.group == group
        })
      }
    },
    
    actions: {        
        index(params) {
          const auth = useAuthStore()
          
          this.comments = []
          
          OrganizationCommentsApi.index(auth.organization.slug)
            .then(response => {
              // console.log(response)
              this.comments = response.data.data
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        async store(comment) {
          const auth = useAuthStore()
          
          await OrganizationCommentsApi.store(auth.organization.slug, comment)
            .then(response => {
              this.comments.unshift(response.data.data)
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        destroy(comment) {
          const auth = useAuthStore()
          
          this.comments = this.comments.filter((m) => m.id !== comment.id)
          
          OrganizationCommentsApi.destroy(auth.organization.slug, comment.id)
            .then(response => {
              console.log('Comment successfully destroyed')
            }).catch(error => {
              this.comments.unshift(comment)
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
    import.meta.hot.accept(acceptHMRUpdate(useOrganizationCommentsStore, import.meta.hot))
}
