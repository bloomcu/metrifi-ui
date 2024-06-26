import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { invitationApi } from '@/domain/base/invitations/api/invitationApi'

const invitations = ref()
const invitation = ref()
const isLoading = ref(true)

export const useInvitationStore = defineStore('invitations', () => {
  let route = useRoute()

  async function index(params) {
    invitations.value = null
    isLoading.value = true
    
    invitationApi.index(route.params.organization, params)
      .then(response => {
        invitations.value = response.data.data
        isLoading.value = false
      }).catch(error => {
        console.log('Error', error.response.data)
      })
  }
  
  async function store(email) {
    await invitationApi.store(route.params.organization, {
      email: email.value,
      role: 'editor'
    }).then(response => {
      invitations.value.unshift(response.data.data)
    }).catch((error) => {
      return Promise.reject(error)
    })
  }
  
  async function show(uuid) {
    isLoading.value = true
  
    await invitationApi.show(uuid)
      .then(response => {
        invitation.value = response.data.data
        
        setTimeout(function () {
          isLoading.value = false
        }.bind(this), 600)
      })
      .catch(error => {
        console.log('Error', error.response.data)
      })
  }
  
  async function destroy(uuid) {
    isLoading.value = true
    
    let invitation = invitations.value.find(invite => invite.uuid == uuid) // cache resource
    invitations.value = invitations.value.filter((invite) => invite.uuid !== uuid) // remove resource
    
    try {
      const response = await invitationApi.destroy(route.params.organization, uuid)
      console.log('Invitation successfully destroyed')
      isLoading.value = false
    }
    catch (error) {
      invitations.value.unshift(invitation) // restore resource
      isLoading.value = false
      console.log('Error', error.response.data)
    }
  }

  return {
    invitations,
    invitation,
    isLoading,
    index,
    store,
    show,
    destroy,
  }
})