<template>
  <LayoutWithSidebar>
    <template #topbar>
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Connection</h1>
        <AppButton @click="showConnectionTypeModal = true">Create connection</AppButton>
      </div>
    </template>

    <table v-if="connections && connections.length" class="min-w-full table-fixed overflow-hidden divide-y divide-gray-300 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
      <thead>
        <tr>
          <th scope="col" class="py-3.5 pl-4 pr-12 text-left text-sm font-semibold text-gray-900 sm:pl-6">Id</th>
          <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Service</th>
          <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Connected</th>
          <th scope="col" class="py-3.5 text-left text-sm font-semibold text-gray-900">Refreshed</th>
          <th scope="col" class="py-3.5"></th>
        </tr>
      </thead>

      <tbody class="divide-y divide-gray-200">
        <tr v-for="(connection, index) in connections" :key="connection.id">
          <!-- Id -->
          <td class="whitespace-nowrap py-4 pl-4 pr-6 text-gray-400 sm:pl-6">
            <p>{{ connection.id }}</p>
          </td>

          <!-- Service -->
          <td class="whitespace-nowrap flex items-center gap-6 py-4 pr-6 text-sm">
            <svg class="w-6 h-6" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
            <div class="flex-auto">
              <p class="mb-1 text-sm leading-5 text-gray-400">{{ connection.account_name }}</p>
              <p class="text-base font-medium leading-6 text-gray-900">{{ connection.name }}</p>
            </div>
          </td>

          <!-- Connected -->
          <td class="whitespace-nowrap py-4 text-sm text-gray-400">
            <p>{{ moment(connection.created_at).fromNow() }}</p>
            <p>by {{ connection.user.name }}</p>
          </td>

          <!-- Updated -->
          <td class="whitespace-nowrap py-4 text-sm text-gray-400">
            <p>{{ moment(connection.updated_at).fromNow() }}</p>
          </td>

          <!-- Disconnect -->
          <td scope="col" class="py-4 pr-4 text-right sm:pr-6">
            <AppButton @click="toggleModal(connection)" variant="tertiary">Disconnect</AppButton>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Empty state: No connections -->
    <!-- <div v-else class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <CloudIcon class="mx-auto h-10 w-10 text-violet-500" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-gray-900">No connection</h2>
      <p class="mt-1 text-gray-400">Get started by connecting Google Analytics.</p>
    </div> -->

    <!-- Empty state: No connections -->
    <div v-else @click="connectToGoogle()" class="flex flex-col items-center justify-center border border-violet-400 border-dashed rounded-lg py-6 px-2 cursor-pointer hover:bg-violet-50">
      <CloudIcon class="mx-auto h-10 w-10 text-violet-500" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-violet-500">Connect Google Analytics</h2>
    </div>

    <DisconnectConnectionModal/>

    <!-- Connection Type Modal -->
    <AppModal 
        size="lg"
        :open="showConnectionTypeModal"
        @closed="showConnectionTypeModal = false" 
    >
        <div class="p-6">
            <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Select Connection Type</h3>
            <div class="mt-6 grid grid-cols-2 gap-4">
                <div @click="selectConnectionType('google')" class="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-violet-50 hover:border-violet-400">
                    <svg class="w-10 h-10 mb-2" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
                    <p class="text-base font-medium text-gray-900">Google Analytics</p>
                </div>
                <div @click="selectConnectionType('wordpress')" class="flex flex-col items-center justify-center border border-gray-300 rounded-lg p-4 cursor-pointer hover:bg-violet-50 hover:border-violet-400">
                    <svg class="w-10 h-10 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.486 2 2 6.486 2 12C2 17.514 6.486 22 12 22C17.514 22 22 17.514 22 12C22 6.486 17.514 2 12 2ZM3.3 12C3.3 11.172 3.447 10.374 3.704 9.619L7.276 19.979C4.923 18.404 3.3 15.409 3.3 12ZM12 20.7C11.332 20.7 10.689 20.622 10.069 20.486L12.144 14.439L14.271 20.258C14.277 20.276 14.286 20.293 14.294 20.31C13.569 20.565 12.799 20.7 12 20.7ZM13.119 8.844C13.617 8.822 14.051 8.766 14.051 8.766C14.499 8.715 14.446 8.067 13.998 8.093C13.998 8.093 12.644 8.169 11.766 8.169C10.969 8.169 9.588 8.093 9.588 8.093C9.139 8.067 9.088 8.741 9.536 8.766C9.536 8.766 9.944 8.822 10.391 8.844L11.673 12.293L10.107 16.9L7.325 8.844C7.823 8.822 8.258 8.766 8.258 8.766C8.706 8.715 8.655 8.067 8.206 8.093C8.206 8.093 6.852 8.169 5.974 8.169C5.827 8.169 5.665 8.167 5.493 8.163C6.911 5.441 9.29 3.6 12 3.6C13.972 3.6 15.784 4.369 17.129 5.632C17.097 5.63 17.064 5.626 17.031 5.626C16.234 5.626 15.65 6.32 15.65 7.066C15.65 7.766 16.057 8.349 16.488 9.039C16.825 9.597 17.212 10.307 17.212 11.322C17.212 12.019 16.986 12.812 16.623 13.839L15.885 16.196L13.119 8.844ZM16.546 19.812L18.702 13.434C19.136 12.26 19.279 11.276 19.279 10.402C19.279 10.007 19.256 9.634 19.213 9.283C19.893 10.109 20.3 11.149 20.3 12.3C20.3 15.416 18.834 18.163 16.546 19.812Z" fill="#21759B"/>
                    </svg>
                    <p class="text-base font-medium text-gray-900">WordPress Website</p>
                </div>
            </div>
        </div>
    </AppModal>

    <!-- WordPress Connection Modal -->
    <AppModal 
        size="lg"
        :open="showWordPressModal"
        @closed="showWordPressModal = false" 
    >
        <div class="p-6">
            <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Connect WordPress Website</h3>
            <form @submit.prevent="connectWordPress" class="mt-6">
                <div class="space-y-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-gray-700">Website Name</label>
                        <div class="mt-1">
                            <input type="text" id="name" v-model="wordpressForm.name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" placeholder="Primary website" />
                        </div>
                    </div>
                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-700">Website url</label>
                        <div class="mt-1">
                            <input type="text" id="username" v-model="wordpressForm.token.wordpress_url" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
                        <div class="mt-1">
                            <input type="text" id="username" v-model="wordpressForm.token.username" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label for="app_password" class="block text-sm font-medium text-gray-700">App Password</label>
                        <div class="mt-1">
                            <input type="text" id="app_password" v-model="wordpressForm.token.app_password" autocomplete="off" class="block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-violet-500 focus:ring-violet-500 sm:text-sm mask-password" />
                        </div>
                    </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm" @click="showWordPressModal = false">
                        Cancel
                    </button>
                    <button type="submit" class="inline-flex w-full justify-center rounded-md border border-transparent bg-violet-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm">
                        Connect
                    </button>
                </div>
            </form>
        </div>
    </AppModal>

  </LayoutWithSidebar>
</template>
  
<script setup>
import moment from 'moment'
import { ref, onMounted, provide } from 'vue'
import { useRoute } from 'vue-router'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { CloudIcon } from '@heroicons/vue/24/outline'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'
import DisconnectConnectionModal from '@/views/connections/modals/DisconnectConnectionModal.vue'

const route = useRoute()

const connections = ref([])
const isModalOpen = ref(false)
const connectionToBeDisconnected = ref()
const showConnectionTypeModal = ref(false)
const showWordPressModal = ref(false)

const wordpressForm = ref({
  service: 'WordPress Website',
  name: 'Primary website',
  token: {
    wordpress_url: '',
    username: '',
    app_password: ''
  }
})

const { connectToGoogle } = useConnections()

provide('isModalOpen', isModalOpen)
provide('connectionToBeDisconnected', connectionToBeDisconnected)

function toggleModal(connection) { 
  isModalOpen.value = !isModalOpen.value 
  connectionToBeDisconnected.value = connection
}

function selectConnectionType(type) {
  showConnectionTypeModal.value = false
  
  if (type === 'google') {
    connectToGoogle()
  } else if (type === 'wordpress') {
    showWordPressModal.value = true
  }
}

async function connectWordPress() {
    connectionApi.store(route.params.organization, wordpressForm.value)
        .then((response) => {
            console.log(response)
            connections.value.push(response.data.data)
            showWordPressModal.value = false

            wordpressForm.value = {
                service: 'WordPress Website',
                name: 'Primary website',
                token: {
                    wordpress_url: '',
                    username: '',
                    app_password: ''
                }
            }
    })
}

onMounted(() => {
  connectionApi.index(route.params.organization).then(response => {
    // connection.value = response.data.data[0] // Show first connection
    connections.value = response.data.data // Show all connections
  })
})
</script>

<style>
.mask-password {
  /* Use a font that renders all characters as bullets or similar */
  font-family: "text-security-disc";
  -webkit-text-security: disc; /* For Safari */
  -moz-text-security: disc; /* For Firefox */
  text-security: disc; /* Standard (not widely supported yet) */
  letter-spacing: 2px;
}
</style>