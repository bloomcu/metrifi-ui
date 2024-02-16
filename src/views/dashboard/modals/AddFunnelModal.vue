<template>
  <AppModal 
    size="6xl"
    @closed="isModalOpen = false" 
    :open="isModalOpen"
  >
    <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-6 sm:truncate sm:text-2xl">Add funnel</h3>

    <div v-if="funnels && funnels.length" >
      <AppInput v-model="input" placeholder="Search funnels..." class="mb-4"/>

      <table class="min-w-full table-fixed overflow-hidden divide-y divide-gray-300 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
        <thead>
          <tr>
            <th scope="col" class="py-3.5 pl-4 pr-12 text-left text-sm font-semibold text-gray-900 sm:pl-6">Funnel</th>
            <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Connection</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr v-for="funnel in filteredFunnels" :key="funnel.id" @click="close()" class="hover:bg-gray-50 cursor-pointer">
            <!-- Funnel -->
            <td class="whitespace-nowrap py-4 pl-4 pr-6 text-sm sm:pl-6">
              <div class="flex-auto">
                <p class="mb-1 text-base font-medium leading-6 text-gray-900">{{ funnel.name }}</p>

                <div class="flex gap-2">
                  <div v-if="funnel.automation_msg" class="flex items-center text-sm leading-5 text-pink-600">
                    <p>{{ funnel.automation_msg }}</p>
                  </div>

                  <p v-else class="text-sm leading-5 text-gray-400">{{ funnel.steps.length }} steps</p>

                  <p v-if="funnel.messages.length" class="text-sm leading-5">
                    <span class="mr-1.5 text-gray-400">•</span>
                    <span class="text-green-500">{{ funnel.messages.length }} notification</span>
                  </p>
                </div>
              </div>
            </td>

            <!-- Connection -->
            <td class="whitespace-nowrap py-4 text-sm text-gray-400">
              <div class="flex items-center text-sm mr-2">
                <svg class="w-4 h-4 mr-2" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
                {{ funnel.connection.name }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state: No funnels -->
    <div v-else class="text-center bg-slate-50 rounded-2xl py-12 px-2">
      <ChartBarIcon class="mx-auto h-10 w-10 text-indigo-600" aria-hidden="true" />
      <h2 class="mt-2 text-lg font-medium text-gray-900">No funnels</h2>
      <p class="mt-1 text-gray-400">Get started by creating a funnel.</p>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { ChartBarIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const input = ref('')
const funnels = ref([])
const isModalOpen = inject('isModalOpen')

const filteredFunnels = computed(() => {
  let term = input.value.toLowerCase()

  return funnels.value.filter(funnel => {
    return funnel.name.toLowerCase().indexOf(input.value) > -1 ||
           funnel.connection.name.toLowerCase().indexOf(input.value) > -1
  })
})

function close() {
  isModalOpen.value = false
  emit('done')
}

onMounted(() => {
  console.log('Listing funnels...')
    
  funnelApi.index(route.params.organization).then(response => {
    funnels.value = response.data.data
  })
})

const emit = defineEmits(['done'])
</script>
