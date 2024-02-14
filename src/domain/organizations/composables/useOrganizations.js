import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { organizationApi } from '@/domain/base/organizations/api/organizationApi.js'

let organization = ref()

export const useOrganizations = () => {
  let route = useRoute()

  async function showOrganization() {
    await organizationApi.show(route.params.organization).then(response => {
      organization.value = response.data.data
    })
  }

  return {
    organization: computed(() => organization.value),
    showOrganization
  }
}
