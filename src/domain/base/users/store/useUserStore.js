import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { userApi } from '@/domain/base/users/api/userApi'

const users = ref()
const user = ref()
const isLoading = ref(true)

export const useUserStore = defineStore('users', () => {
  let route = useRoute()

  async function index(params) {
    this.isLoading = true
    this.users = null
    
    userApi.index(route.params.organization, params).then(response => {
      users.value = response.data.data
      isLoading.value = false
    }).catch(error => {
      console.log('Error', error.response.data)
    })
  }
    
  async function destroy(id) {
    this.isLoading = true
  
    userApi.destroy(route.params.organization, id).then(response => {
      users.value = users.value.filter((user) => user.id !== id)
      isLoading.value = false
    })
  }

  return {
    users,
    user,
    isLoading,
    index,
    destroy,
  }
})