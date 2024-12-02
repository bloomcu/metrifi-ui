<template>
  <LayoutWithSidebar>
    <template #overlay>
      <!-- Force GA connection first -->
      <div v-if="organizationStore.organization.onboarding['connect-google-analytics'] !== 'complete'"  class="fixed h-full w-full bg-gray-white bg-opacity-50 backdrop-blur-sm flex justify-center z-50">
        <div class="-ml-60 flex flex-col text-center items-center justify-center">
          <svg class="w-10 h-10 mb-8" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
          <h1 class="mb-2 text-3xl font-medium text-gray-900">Connect Google Analytics</h1>
          <p class="text-lg text-gray-700 mb-4">Connecting your Google Analytics 4 account allows MetriFi to access your GA4 data and build funnels.</p>
          <AppButton @click="connectToGoogle()">Connect Google Analytics</AppButton>
        </div>
      </div>
    </template>
    
    <template #topbar>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Funnels</h1>
        <div class="flex gap-2">
          <AppButton v-if="organizationStore.organization.onboarding['connect-google-analytics'] == 'complete'" @click="storeNewFunnel">
            Create blank funnel
          </AppButton>
          <!-- <AppButton v-if="!isAutomating" @click="toggleModal()" :disabled="isAutomating">
            <svg class="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 576 512"><path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"/></svg>
            Generate funnels with AI
          </AppButton> -->
          <!-- <AppButton v-else disabled>
            <svg class="inline w-4 h-4 mr-1 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
            </svg>
            Generating funnels...
          </AppButton> -->
        </div>
      </div>
    </template>

    <!-- Automation running -->
    <div v-if="isAutomating" class="rounded-md bg-violet-50 p-4 mb-4">
      <div class="flex">
        <div class="flex-shrink-0 text-violet-600">
          <svg class="w-4 h-4 mr-1 animate-spin" fill="none" viewBox="0 0 100 101"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>
        </div>
        <div class="ml-3">
          <p class="text-sm font-medium text-violet-600">{{ organizationStore.organization.automation_msg }}</p>
        </div>
      </div>
    </div>

    <!-- Automation error -->
    <div v-if="automationError" class="rounded-md bg-pink-50 p-4 mb-4">
      <div class="flex items-center">
        <div class="flex-shrink-0 text-pink-600">
          <svg class="w-6 h-6 mr-1" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
        </div>
        <div class="ml-3">
          <p v-html="automationError" class="text-sm font-medium text-pink-600"></p>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex gap-3 mb-4">
      <AppInput v-model="search" placeholder="Filter" class="w-4/12"/>
      <CategoryPicker v-model="category"/>
    </div>

    <!-- List funnels -->
    <table v-if="funnels && funnels.length" class="min-w-full table-fixed overflow-hidden divide-y divide-gray-300 ring-1 ring-gray-300 mb-20 sm:mx-0 sm:rounded-lg">
      <thead>
        <tr class="">
          <th scope="col" class="py-3.5 pl-4 pr-4 sm:pl-4 text-left text-sm font-medium text-gray-900">Funnel</th>
          <!-- <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">Conversion</th> -->
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">Category</th>
          <th scope="col" class="py-3.5 pr-4 text-left text-sm font-medium text-gray-900">Connection</th>
          <th scope="col" class="py-3.5 text-left text-sm font-medium text-gray-900">Updated</th>
          <th scope="col" class="py-3.5"></th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">
        <tr v-for="funnel in filteredFunnels" :key="funnel.id" @click="router.push({name: 'funnel', params: {funnel: funnel.id}})" class="hover:bg-gray-50 cursor-pointer">
          <!-- Funnel -->
          <td class="py-4 pr-2 text-sm w-2/5 sm:pl-4">
            <div class="flex-auto">
              <p v-html="highlightSearchedText(funnel.name)" class="mb-1 text-base font-medium leading-6 text-gray-900"></p>

              <div class="flex gap-2">
                <div v-if="funnel.automation_msg" class="flex items-center text-sm leading-5 text-pink-600">
                  <p>{{ funnel.automation_msg }}</p>
                </div>

                <!-- <p v-else class="text-sm leading-5 text-gray-400">{{ funnel.steps.length }} steps</p> -->

                <p v-if="funnel.messages.length" class="text-sm leading-5">
                  <span class="mr-1.5 text-gray-400">•</span>
                  <span class="text-green-500">{{ funnel.messages.length }} notification</span>
                </p>
              </div>
            </div>
          </td>

          <!-- Conversion -->
          <!-- <td class="whitespace-nowrap py-4 pr-4 text-sm text-gray-400">
            <p class="mb-0.5">{{ funnel.snapshots ? funnel.snapshots.last28Days.conversionRate + '%' : '' }}</p>
            <p class="text-xs">last 28 days</p>
          </td> -->

          <!-- Category -->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            <div class="flex items-center text-sm mr-2">
              {{ funnel.category ? funnel.category.title : '' }}
            </div>
          </td>

          <!-- Connection -->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            <div class="flex items-center text-sm">
              <svg class="w-4 h-4 mr-2" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
              {{ funnel.connection.name }}
            </div>
          </td>

          <!-- Updated -->
          <td class="whitespace-nowrap py-4 pr-2 text-sm text-gray-400">
            {{ moment(funnel.updated_at).fromNow() }}
          </td>

          <!-- Options -->
          <td scope="col" class="py-4 pr-4">
            <div class="flex justify-end gap-2">
              <AppButton @click.stop="replicateFunnel(funnel.id)" variant="tertiary">Copy</AppButton>
              <AppButton @click.stop="destroyFunnel(funnel.id)" variant="tertiary">Delete</AppButton>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- State: Loading -->
    <div v-else-if="isLoading" class="animate-pulse space-y-4">
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

    <!-- Empty state: No funnels -->
    <div v-else @click="storeNewFunnel()" class="flex flex-col items-center justify-center border border-violet-400 border-dashed rounded-lg py-6 px-2 cursor-pointer hover:bg-violet-50">
      <ChartBarIcon class="mx-auto h-10 w-10 text-violet-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-violet-600">Create a funnel</h2>
    </div>
    
    <GenerateFunnelsModal :open="isModalOpen" @done="loadFunnels()"/>
  </LayoutWithSidebar>
</template>

<script setup>
import moment from 'moment'
import { ref, watch, onMounted, provide, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { ChartBarIcon } from '@heroicons/vue/24/outline'
import CategoryPicker from '@/app/components/category-picker/CategoryPicker.vue'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'
import GenerateFunnelsModal from '@/views/funnels/modals/GenerateFunnelsModal.vue'

const route = useRoute()
const router = useRouter()

const { connectToGoogle } = useConnections()

const organizationStore = useOrganizationStore()

const funnels = ref()
const isLoading = ref(false)
const isModalOpen = ref(false)
const isAutomating = ref(false)
const automationError = ref()

provide('isModalOpen', isModalOpen)
provide('isAutomating', isAutomating)
provide('automationError', automationError)

const search = ref(null)
const category = ref(null)
const filteredFunnels = computed(() => {
  if (!search.value) {
    return funnels.value
  }

  return funnels.value.filter(funnel => {
    return funnel.name.toLowerCase().indexOf(search.value.toLowerCase()) > -1
  })
})

function highlightSearchedText(text) {
  if (!search.value) return text
  return text.replaceAll(search.value, `<span style="background-color: #fde047; padding: 2px 5px; border-radius: 5px;">${search.value}</span>`)
}

let pollInterval = 0
function poll() {
  pollInterval = setTimeout(async() => {
    console.log('Polling...')
    await loadFunnels()
  }, 2000)
}

function stopPoll() {
  clearInterval(pollInterval)
}

function pollOrganization() {
  organizationStore.show().then(() => {
    if (organizationStore.organization.value.automating) {
      isAutomating.value = true
      poll()
      return
    } else {
      isAutomating.value = false
      stopPoll()
    }
  })
}

function loadFunnels() {
  isLoading.value = true

  funnelApi.index(route.params.organization, {
    'filter[category.id]': category.value ? category.value.id : null,
  }).then(response => {
    isLoading.value = false
    funnels.value = response.data.data
    // pollOrganization()
  })
}

function storeNewFunnel() {
  funnelApi.store(route.params.organization, {
    name: 'New funnel',
    description: 'This is the funnel description',
    zoom: 0,
    conversion_value: 0,
  }).then(response => {
    let funnel = response.data.data
    router.push({ name: 'funnel', params: { funnel: funnel.id } })
  })
}

function destroyFunnel(funnelId) {
  funnels.value = funnels.value.filter(funnel => funnel.id !== funnelId)
  funnelApi.destroy(route.params.organization, funnelId)
}

function replicateFunnel(funnelId) {
  funnelApi.replicate(route.params.organization, funnelId)
    .then(response => {
      funnels.value.unshift(response.data.data)
    })
}

function toggleModal() {
  isModalOpen.value = !isModalOpen.value 
}

watch(category, () => {
  loadFunnels()
})

onMounted(() => {
  loadFunnels()
})
</script>
