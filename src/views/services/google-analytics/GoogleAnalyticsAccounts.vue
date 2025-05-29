<template>
  <LayoutDefault width="xs" v-if="organizationStore.organization">
    <!-- Header -->
    <AppHeader class="pt-6">
      <h1 class="text-center w-full text-3xl font-medium leading-6 text-gray-900">Google Analytics accounts</h1>
    </AppHeader>

    <!-- Loading state -->
    <div v-if="!error && accounts === undefined" class="animate-pulse space-y-4">
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
      <div class="h-4 bg-gray-200 rounded w-2/3"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded"></div>
      <div class="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>

    <!-- Accounts list -->
    <div v-else-if="accounts && accounts.length">
      <AppInput v-model="searchInput" placeholder="Search account names..." class="mb-4"></AppInput>

      <AppCard padding="none">
        <ul role="list" class="divide-y divide-gray-100">
          <template v-for="account in filteredAccounts" :key="account.account">
            <li v-if="account.propertySummaries" v-for="property in account.propertySummaries" :key="property.property" class="relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
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
    
    <!-- Empty state: No accounts associated with this Google account -->
    <div v-else-if="accounts && accounts.length === 0" class="text-center">
      <AppCard>
        <div class="flex flex-col items-center">
          <svg class="w-12 h-12 text-gray-400 mb-4" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No Google Analytics accounts found</h3>
          <p class="text-sm text-gray-500 mb-6">The Google account you connected doesn't have any Google Analytics accounts associated with it.</p>
          <AppButton @click="connectToGoogle(state)" variant="primary">Connect a different account</AppButton>
        </div>
      </AppCard>
    </div>

    <div v-if="error" class="text-center">
      <AppCard>
        <div class="flex flex-col items-center">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Connection to Google Analytics lost</h3>
          <p class="text-sm text-gray-500 mb-6">Your connection session with Google Analaytics has expired. Please reconnect.</p>
          <AppButton @click="connectToGoogle(state)" variant="primary">Reconnect</AppButton>
        </div>
      </AppCard>
    </div>
  </LayoutDefault>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { googleApi } from '@/domain/services/google/api/googleApi.js'
import { gaAdminApi } from '@/domain/services/google-analytics/api/gaAdminApi.js'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import LayoutDefault from '@/app/layouts/LayoutDefault.vue'

const { connectToGoogle } = useConnections()

const organizationStore = useOrganizationStore()

const route = useRoute()
const router = useRouter()

const code = ref()
const state = ref()

const accounts = ref()
const searchInput = ref('')
const error = ref()

const filteredAccounts = computed(() => {
  return accounts.value.filter(account => {
    return account.displayName.toLowerCase().includes(searchInput.value.toLowerCase())
  })
})

function listAccounts() {
  gaAdminApi.listAccounts(code.value).then(response => {
    accounts.value = response.data.data
  }).catch(err => {
    error.value = err
  })
}

function storeConnection(accountName, property) {
  connectionApi.store(state.value, {
    service: 'Google Analytics - Property',
    account_name: accountName,
    name: property.displayName,
    uid: property.property,
    token: code.value
  }).then(() => {
    if (organizationStore.organization.onboarding['onboardingComplete'] == false) {
      router.push({ name: 'welcome', params: { organization: state.value } })
    } else {
      router.push({ name: 'settingsConnections', params: { organization: state.value } })
    }
  })
}

function goToConnections() {
  router.push({ name: 'settingsConnections', params: { organization: state.value } })
}

onMounted(() => {
  if (route.query.error) {
    router.push({ name: 'settingsConnections', params: { organization: route.query.state } })
    return
  }
    
  googleApi.callback(route.query.code).then(response => {
    code.value = response.data.data
    listAccounts()
  })

  organizationStore.show(route.query.state)

  state.value = route.query.state
})
</script>
