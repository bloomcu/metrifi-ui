import { defineStore, acceptHMRUpdate } from 'pinia'
import { userApi as UserApi } from '@/domain/base/users/api/userApi'

import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'

export const useUserStore = defineStore('userStore', {
    state: () => ({
        users: null,
        user: null,
        isLoading: true,
    }),
    
    getters: {},
    
    actions: {
        index(params) {
          const auth = useAuthStore()
          this.isLoading = true
          this.users = null
          
          UserApi.index(auth.organization, params)
            .then(response => {
              this.users = response.data.data
              this.isLoading = false
            }).catch(error => {
              console.log('Error', error.response.data)
            })
        },
        
        // async store(user) {
        //   const auth = useAuthStore()
        //   this.isLoading = true
        // 
        //   await UserApi.store(auth.organization, user)
        //     .then(response => {
        //       this.users.push(response.data.data)
        //     }).catch(error => {
        //       console.log('Error', error.response.data)
        //     })
        // },
        
        // show(id) {
        //   const auth = useAuthStore()
        //   this.isLoading = true
        // 
        //   UserApi.show(auth.organization, id)
        //     .then(response => {
        //       this.user = response.data.data
        //       this.isLoading = false
        //     })
        // },
        
        // update() {
        //   const auth = useAuthStore()
        //   this.isLoading = true
        // 
        //   UserApi.update(auth.organization, this.user.id, this.user)
        //     .then(response => {
        //       console.log('user successfully updated')
        //       this.isLoading = false
        //     })
        // },
        
        destroy(id) {
          const auth = useAuthStore()
          if (auth.user.id === id) return
          
          this.isLoading = true
        
          UserApi.destroy(auth.organization, id)
            .then(response => {
              this.users = this.users.filter((user) => user.id !== id)
              this.isLoading = false
            })
        }
    }
})

/**
 * Enable hot reload on store updates
 * https://pinia.vuejs.org/cookbook/hot-module-replacement.html
 */
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
