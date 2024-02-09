<template>
  <AppModal 
    size="xl"
    @closed="isModalOpen = false" 
    :open="isModalOpen"
  >
    <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-6 sm:truncate sm:text-2xl">Generate funnels with AI</h3>

    <form action="#" @submit.prevent="generateFunnelsWithAI()" class="flex flex-col gap-3 mb-6">
      <AppInput v-model="input" label="Starting page path" placeholder="/" required />

      <AppButton :loading="isLoading" class="w-full">
        <svg class="inline w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 576 512"><path d="M234.7 42.7L197 56.8c-3 1.1-5 4-5 7.2s2 6.1 5 7.2l37.7 14.1L248.8 123c1.1 3 4 5 7.2 5s6.1-2 7.2-5l14.1-37.7L315 71.2c3-1.1 5-4 5-7.2s-2-6.1-5-7.2L277.3 42.7 263.2 5c-1.1-3-4-5-7.2-5s-6.1 2-7.2 5L234.7 42.7zM46.1 395.4c-18.7 18.7-18.7 49.1 0 67.9l34.6 34.6c18.7 18.7 49.1 18.7 67.9 0L529.9 116.5c18.7-18.7 18.7-49.1 0-67.9L495.3 14.1c-18.7-18.7-49.1-18.7-67.9 0L46.1 395.4zM484.6 82.6l-105 105-23.3-23.3 105-105 23.3 23.3zM7.5 117.2C3 118.9 0 123.2 0 128s3 9.1 7.5 10.8L64 160l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L128 160l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L128 96 106.8 39.5C105.1 35 100.8 32 96 32s-9.1 3-10.8 7.5L64 96 7.5 117.2zm352 256c-4.5 1.7-7.5 6-7.5 10.8s3 9.1 7.5 10.8L416 416l21.2 56.5c1.7 4.5 6 7.5 10.8 7.5s9.1-3 10.8-7.5L480 416l56.5-21.2c4.5-1.7 7.5-6 7.5-10.8s-3-9.1-7.5-10.8L480 352l-21.2-56.5c-1.7-4.5-6-7.5-10.8-7.5s-9.1 3-10.8 7.5L416 352l-56.5 21.2z"/></svg>
        Generate funnels with AI
      </AppButton>
    </form>

    <div class="border border-gray-200 rounded-md">
      <div class="flex flex-row justify-between border-b px-2 py-2">
        <input v-model="searchInput" class="block flex-grow px-1 py-1.5 text-gray-900 border-0 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Search...">

        <span class="inline-flex items-center rounded-md px-2 py-1 ml-0.5 text-xs font-medium text-gray-700 ring-1 ring-inset ring-gray-700/10">
          <!-- Loading pages -->
          <svg v-if="isLoadingGA" class="inline w-4 h-4 mr-2 text-indigo-600 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
          </svg>
          <svg v-else class="w-4 h-4 mr-2" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
          myzing.com - GA4
        </span>
      </div>

      <div class="flex flex-col items-start gap-2 p-3">
        <span v-if="pages" v-for="page in filteredPages" @click="input = page.dimensionValues[0].value" class="inline-flex items-center rounded-md cursor-pointer bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 hover:bg-purple-100">{{ page.dimensionValues[0].value }}</span>
      </div>        
    </div>
  </AppModal>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect, inject } from 'vue'
import { useRoute } from 'vue-router'
import { gaDataApi } from '@/domain/services/google-analytics/api/gaDataApi.js'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'

const route = useRoute()
const isLoading = ref(false)
const isLoadingGA = ref(false)
const input = ref('/')
const searchInput = ref('')
const pages = ref()

const isModalOpen = inject('isModalOpen')
const isAutomating = inject('isAutomating')

const filteredPages = computed(() => {
  return pages.value.rows.filter(page => {
    return page.dimensionValues[0].value.includes(searchInput.value)
  })
})

function fetchPagesFromGA() {
  isLoadingGA.value = true

  gaDataApi.fetchPageViews(1, {
    startDate: '28daysAgo', 
    endDate: 'today' 
  }).then(response => {
    if (response.data.data.error) {
      console.log(response.data.data.error)
      return
    }

    setTimeout(() => {
      pages.value = response.data.data
      isLoadingGA.value = false
    }, 400)
  })
}

function generateFunnelsWithAI() {
  console.log('Generating funnels with AI...')
  
  isModalOpen.value = false
  isAutomating.value = true

  funnelApi.generateAll(route.params.organization, 1, {startingPagePath: input.value})
    .then(() => {
      isAutomating.value = false
      emit('done')
    })
}

watchEffect(async () => {
  if (isModalOpen.value && !pages.value) {
    fetchPagesFromGA()
  }
})

// function addStep(measurable, order) {
//   funnelApi.storeStep(route.params.organization, route.params.funnel, {
//     order: order,
//     name: measurable,
//     measurables: [{
//       metric: 'pageViews',
//       measurable: measurable,
//     }],
//   })
// }

const emit = defineEmits(['done'])
</script>
