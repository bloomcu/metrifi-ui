<template>
  <LayoutDefault width="xs">
    <!-- Header -->
    <AppHeader v-if="accounts" class="pt-6">
      <h1 class="text-3xl font-medium leading-6 text-gray-900">Accounts</h1>
    </AppHeader>

    <!-- TODO: Add loading state -->

    <div v-if="accounts">
      <AppInput v-model="searchInput" placeholder="Search account names..." class="mb-4"></AppInput>

      <AppCard padding="none">
        <ul role="list" class="divide-y divide-gray-100">
          <template v-for="account in filteredAccounts" :key="account.account">
            <li v-if="account.propertySummaries" v-for="property in account.propertySummaries" :key="property.property" class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6 cursor-pointer">
              <div class="min-w-0 flex items-center gap-6">
                <svg class="w-6 h-6" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
                <div class="flex-auto">
                  <p class="mb-1 text-sm leading-5 text-gray-400">{{ account.displayName }}</p>
                  <p class="text-base font-medium leading-6 text-gray-900">{{ property.displayName }}</p>
                </div>
              </div>

              <div class="flex items-center gap-x-4 z-10">
                <AppButton @click="storeConnection(account.displayName, property)" variant="tertiary">Connect</AppButton>
              </div>
            </li>
          </template>
        </ul>
      </AppCard>
    </div>
    <!-- TODO: Add empty state when user refreshed and there is not code in url -->
    <!-- TODO: Add empty state (no accounts associated with this Google account) -->
    <!-- TODO: Handle error "http://localhost:3000/services/ga/accounts?error=access_denied" -->

    <!-- Empty state: Catch all -->
    <!-- <div v-else class="text-center bg-slate-50 rounded-2xl py-12 px-2 mt-6">
      <ExclamationTriangleIcon class="mx-auto h-10 w-10 text-red-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-gray-900">Problem connecting with Google</h2>
      <p class="mt-1 text-gray-500">There was a problem connecting with Google. Please refresh.</p>
    </div> -->
  </LayoutDefault>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { googleApi } from '@/domain/services/google/api/googleApi.js'
import { gaAdminApi } from '@/domain/services/google-analytics/api/gaAdminApi.js'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'

const route = useRoute()
const router = useRouter()

const token = ref()
// const accounts = ref( [{"name":"accountSummaries/110826939","account":"accounts/110826939","displayName":"Online Loans - Lending 360","propertySummaries":[{"property":"properties/343527009","displayName":"Online Loans - Lending 360 - GA4","propertyType":"PROPERTY_TYPE_ORDINARY","parent":"accounts/110826939"}]},{"name":"accountSummaries/1136934","account":"accounts/1136934","displayName":"LBS Financial","propertySummaries":[{"property":"properties/309388882","displayName":"http://lbsfcu.org - GA4","propertyType":"PROPERTY_TYPE_ORDINARY","parent":"accounts/1136934"}]},{"name":"accountSummaries/116209960","account":"accounts/116209960","displayName":"CDFCU"},{"name":"accountSummaries/118141953","account":"accounts/118141953","displayName":"Arsenal CU","propertySummaries":[{"property":"properties/367120247","displayName":"arsenalcu.com - GA4","propertyType":"PROPERTY_TYPE_ORDINARY","parent":"accounts/118141953"}]},{"name":"accountSummaries/121528864","account":"accounts/121528864","displayName":"AFFCU"}])
const accounts = ref()
const searchInput = ref('')

const filteredAccounts = computed(() => {
  return accounts.value.filter(account => {
    return account.displayName.toLowerCase().includes(searchInput.value.toLowerCase())
  })
})

function listAccounts() {
  gaAdminApi.listAccounts(token.value).then(response => {
    accounts.value = response.data.data
    router.replace({ query: {} })
  })
}

function storeConnection(accountName, property) {
  // TODO: Get organization from authStore
  connectionApi.store('bloomcu', {
    service: 'Google Analytics - Property',
    account_name: accountName,
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
