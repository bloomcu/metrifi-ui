<template>
  <LayoutDefault width="full">
    <AppCard v-if="accounts" padding="none">
      <ul role="list" class="divide-y divide-gray-100">
        <template v-for="account in accounts" :key="account.account">
          <li v-if="account.propertySummaries" v-for="property in account.propertySummaries" :key="property.property" class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 cursor-pointer">
            <div class="min-w-0 flex-auto">
              <p class="mb-1 text-sm leading-5 text-gray-400">{{ account.displayName }}</p>
              <p class="text-base font-medium leading-6 text-gray-900">{{ property.displayName }}</p>
            </div>

            <div class="flex items-center gap-x-4 z-10">
              <AppButton @click="storeConnection(property)" variant="tertiary">Connect</AppButton>
            </div>
          </li>
        </template>
      </ul>
    </AppCard>
  </LayoutDefault>
</template>
  
<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { googleApi } from '@/domain/services/google/api/googleApi.js'
import { gaAdminApi } from '@/domain/services/google-analytics/api/gaAdminApi.js'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'

const route = useRoute()
const router = useRouter()

const token = ref()
// const accounts = ref([{"name":"accountSummaries/110826939","account":"accounts/110826939","displayName":"Online Loans - Lending 360","propertySummaries":[{"property":"properties/343527009","displayName":"Online Loans - Lending 360 - GA4","propertyType":"PROPERTY_TYPE_ORDINARY","parent":"accounts/110826939"}]},{"name":"accountSummaries/1136934","account":"accounts/1136934","displayName":"LBS Financial","propertySummaries":[{"property":"properties/309388882","displayName":"http://lbsfcu.org - GA4","propertyType":"PROPERTY_TYPE_ORDINARY","parent":"accounts/1136934"}]},{"name":"accountSummaries/116209960","account":"accounts/116209960","displayName":"CDFCU"},{"name":"accountSummaries/118141953","account":"accounts/118141953","displayName":"Arsenal CU","propertySummaries":[{"property":"properties/367120247","displayName":"arsenalcu.com - GA4","propertyType":"PROPERTY_TYPE_ORDINARY","parent":"accounts/118141953"}]},{"name":"accountSummaries/121528864","account":"accounts/121528864","displayName":"AFFCU"}])
const accounts = ref()

function listAccounts() {
  gaAdminApi.listAccounts(token.value).then(response => {
    accounts.value = response.data.data
    router.replace({ query: {} })
  })
}

function storeConnection(property) {
  connectionApi.store('bloomcu', {
    service: 'Google Analytics - Property',
    name: property.displayName,
    uid: property.property,
    token: token.value
  }).then(() => {
    router.push({ name: 'connections', params: { organization: 'bloomcu' } })
  })
}

onMounted(() => {
  if (route.query.code) {
    googleApi.callback(route.query.code).then(response => {
      token.value = response.data.data
      listAccounts()
    })
  }
})
</script>
