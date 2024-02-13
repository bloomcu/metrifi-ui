import { ref, onMounted } from 'vue'
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

  // function hydrate() {
  //   organizationApi.show(route.params.organization).then(response => {
  //     organization.value = response.data.data
  //   })
  // }

  // onMounted(() => {
  //   if (!organization.value || organization.value.slug !== route.params.organization) {
  //     hydrate()
  //   }
  // })

  return {
    organization,
    showOrganization
  }
}
