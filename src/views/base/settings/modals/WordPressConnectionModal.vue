<template>
  <AppModal 
    size="lg"
    :open="open"
    @closed="$emit('closed')" 
  >
    <div class="p-6">
      <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Connect WordPress website</h3>
      <form @submit.prevent="connectWordPress" class="mt-6">
        <div class="space-y-4">
          <AppInput 
            v-model="wordpressForm.token.wordpress_url" 
            label="Full website URL" 
            hint="Example: https://example.com/" 
            :errors="errorStore.errors['token.wordpress_url']" 
            required 
          />
          
          <template v-if="isValidUrl(wordpressForm.token.wordpress_url)">
            <!-- Plugin Status Check -->
            <div v-if="pluginStatus.checking" class="p-3 bg-gray-50 rounded-md text-sm text-gray-600">
              <p class="flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking if MetriFi WP plugin is installed...
              </p>
            </div>
            
            <div v-else-if="pluginStatus.installed === false" class="p-4 bg-amber-50 border border-amber-200 rounded-md text-sm">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-amber-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-amber-800">MetriFi WP Plugin Not Installed</h3>
                  <div class="mt-2 text-sm text-amber-700">
                    <p>The MetriFi WP plugin is required to connect to your WordPress site. Please install and activate the plugin first.</p>
                    <p class="mt-2">
                      <a href="https://github.com/bloomcu/metrifi-wp/releases/latest" target="_blank" class="font-medium text-amber-700 underline hover:text-amber-600">Download the plugin</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else-if="pluginStatus.installed === true" class="p-4 bg-green-50 border border-green-200 rounded-md text-sm">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-green-800">MetriFi WP Plugin Detected</h3>
                  <div class="mt-2 text-sm text-green-700">
                    <p>The MetriFi WP plugin is installed and active. Please enter your WordPress credentials below.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <AppInput 
              v-if="pluginStatus.installed === true" 
              v-model="wordpressForm.token.username" 
              label="WordPress Username" 
              :errors="errorStore.errors['token.username']" 
              required 
            />
            
            <AppInput 
              v-if="pluginStatus.installed === true" 
              v-model="wordpressForm.token.app_password" 
              label="Application Password" 
              type="password"
              :errors="errorStore.errors['token.app_password']" 
              required 
            />
          </template>
        </div>
        
        <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm" @click="$emit('closed')">
            Cancel
          </button>
          <button type="submit" class="inline-flex w-full justify-center rounded-md border border-transparent bg-violet-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 sm:col-start-2 sm:text-sm" :disabled="pluginStatus.installed === false">
            Connect
          </button>
        </div>
      </form>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { connectionApi } from '@/domain/connections/api/connectionApi.js'
import { useErrorStore } from '@/app/store/base/useErrorStore'
import axios from 'axios'

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['closed', 'connected'])

const route = useRoute()
const errorStore = useErrorStore()

const wordpressForm = ref({
  service: 'WordPress Website',
  name: '',
  token: {
    wordpress_url: '',
    username: '',
    app_password: ''
  }
})

const pluginStatus = ref({
  checking: false,
  installed: null,
  error: null,
  lastCheckedUrl: ''
})

async function connectWordPress() {
  // Format URL before submission
  if (wordpressForm.value.token.wordpress_url) {
    let url = wordpressForm.value.token.wordpress_url
    
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }
    
    try {
      const urlObj = new URL(url)
      // Set the URL to just protocol + hostname (no path or trailing slash)
      wordpressForm.value.token.wordpress_url = urlObj.protocol + '//' + urlObj.hostname
      // Set the name property to the formatted URL
      wordpressForm.value.name = urlObj.hostname
    } catch (e) {
      // Keep the original value if URL parsing fails
    }
  }

  connectionApi.store(route.params.organization, wordpressForm.value)
    .then((response) => {
      emit('connected', response.data.data)
      resetForm()
    })
}

function resetForm() {
  wordpressForm.value = {
    service: 'WordPress Website',
    name: '',
    token: {
      wordpress_url: '',
      username: '',
      app_password: ''
    }
  }
  pluginStatus.value = {
    checking: false,
    installed: null,
    error: null,
    lastCheckedUrl: ''
  }
}

// Debounce function
function debounce(fn, delay) {
  let timeout
  return function(...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, args), delay)
  }
}

const debouncedCheckPlugin = debounce((url) => {
  if (isValidUrl(url)) {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url)
      const formattedUrl = urlObj.protocol + '//' + urlObj.hostname
      
      // Only check if the URL has changed since last check
      if (formattedUrl !== pluginStatus.value.lastCheckedUrl) {
        checkPluginStatus(formattedUrl)
      }
    } catch (e) {
      // Invalid URL, do nothing
    }
  }
}, 800)

// Watch for URL changes
watch(() => wordpressForm.value.token.wordpress_url, (newUrl) => {
  if (newUrl) {
    debouncedCheckPlugin(newUrl)
  }
})

function isValidUrl(url) {
  if (!url) return false
  
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }
  
  try {
    const urlObj = new URL(url)
    
    // Check that the URL has a valid hostname with a TLD
    // Must have at least one dot and something after the last dot
    const isValid = urlObj.hostname && 
          urlObj.hostname.includes('.') && 
          urlObj.hostname.split('.').pop().length >= 2
    
    // Return formatted URL without path or trailing slash
    if (isValid) {
      // Update the form value with the formatted URL
      wordpressForm.value.token.wordpress_url = urlObj.protocol + '//' + urlObj.hostname
      // Set the name property to the hostname
      wordpressForm.value.name = urlObj.hostname
    }
    
    return isValid
  } catch (e) {
    return false
  }
}

async function checkPluginStatus(url) {
  pluginStatus.value.checking = true
  pluginStatus.value.installed = null
  pluginStatus.value.error = null
  
  try {
    const response = await axios.get(`${url}/wp-json/metrifi/v1/status`, { timeout: 5000 })
    
    if (response.data && response.data.status === 'active') {
      pluginStatus.value.installed = true
    } else {
      pluginStatus.value.installed = false
    }
  } catch (error) {
    pluginStatus.value.installed = false
    if (error.response && error.response.status === 404) {
      pluginStatus.value.error = 'Plugin not found'
    } else {
      pluginStatus.value.error = 'Connection error'
    }
  } finally {
    pluginStatus.value.checking = false
    pluginStatus.value.lastCheckedUrl = url
  }
}
</script>
