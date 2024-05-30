import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRoute } from 'vue-router'
import { organizationApi } from '@/domain/base/organizations/api/organizationApi.js'

const organization = ref()

export const useOrganizations = defineStore('organizations', () => {
  let route = useRoute()

  async function showOrganization(slug) {
    await organizationApi.show(slug).then(response => {
      organization.value = response.data.data
    })
  }

  async function updateOrganization() {
    await organizationApi.update(route.params.organization, organization.value).then(response => {
      organization.value = response.data.data
    })
  }

  return {
    organization,
    showOrganization,
    updateOrganization,
  }
})
