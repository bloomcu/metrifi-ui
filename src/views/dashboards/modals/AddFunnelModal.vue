<template>
  <AppModal 
    size="6xl"
    @closed="isModalOpen = false" 
    :open="isModalOpen"
  >
    <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-6 sm:truncate sm:text-2xl">Add funnel</h3>

    <div>
      <div class="flex items-center justify-between gap-3 mb-4">
        <AppInput v-model="input" placeholder="Search funnels..." class="w-full"/>
        <AppButton @click="attachFunnels()" class="w-56" :disabled="!selected.length">
          Add {{ selected.length ? selected.length : '' }} {{ selected.length > 1 ? 'funnels' : 'funnel' }}
        </AppButton>
      </div>

      <table v-if="funnels && funnels.length" class="min-w-full table-fixed overflow-hidden divide-y divide-gray-300 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg">
        <thead>
          <tr>
            <th scope="col" class="py-3.5 pl-4 sm:pl-6">
              <input 
                @click="selectAllFunnels()" 
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                type="checkbox" 
              />
            </th>
            <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Funnel</th>
            <th scope="col" class="py-3.5 pr-12 text-left text-sm font-semibold text-gray-900">Organization</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr 
            v-for="funnel in funnels" 
            :key="funnel.id" 
            @click="selectFunnel(funnel.id)" 
            :class="selected.includes(funnel.id) ? 'bg-gray-100' : ''"
            class="hover:bg-gray-50 cursor-pointer"
          >
            <!-- Checkbox -->
            <td class="py-4 pl-4 sm:pl-6">
              <input 
                @select="selectFunnel(funnel.id)" 
                :checked="selected.includes(funnel.id)" 
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                type="checkbox" 
              />
            </td>
          
            <!-- Funnel -->
            <td class="whitespace-nowrap py-4 text-sm">
              <div class="flex-auto">
                <p class="mb-1 text-base font-medium leading-6 text-gray-900">{{ funnel.name }}</p>
              </div>
            </td>

            <!-- Organization -->
            <td class="whitespace-nowrap py-4 text-sm text-gray-400">
              <div class="flex items-center text-sm mr-2">
                <!-- <svg class="w-4 h-4 mr-2" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg> -->
                {{ funnel.organization.title }}
              </div>
            </td>

            <!-- Attach funnel button -->
            <!-- <td class="whitespace-nowrap py-4 text-sm text-gray-400">
              <AppButton @click="attachFunnel(funnel.id)">Add funnel</AppButton>
            </td> -->
          </tr>
        </tbody>
      </table>

      <!-- Empty state: No funnels -->
      <div v-else class="text-center bg-slate-50 rounded-2xl py-12 px-2">
        <ChartBarIcon class="mx-auto h-10 w-10 text-indigo-600" aria-hidden="true" />
        <h2 class="mt-2 text-lg font-medium text-gray-900">No funnels</h2>
        <p class="mt-1 text-gray-400">Get started by creating a funnel.</p>
      </div>
    </div>

  </AppModal>
</template>

<script setup>
import debounce from 'lodash.debounce'
import { ref, inject, watch, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'
import { ChartBarIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const input = ref('')
const funnels = ref([])
const isModalOpen = inject('isModalOpen')
const isUpdating = ref(false)
const selected = ref([])

// const filteredFunnels = computed(() => {
//   const term = input.value.toLowerCase()

//   return funnels.value.filter(funnel => {
//     return funnel.name.toLowerCase().indexOf(input.value) > -1 ||
//            funnel.connection.name.toLowerCase().indexOf(input.value) > -1
//   })
// })

const search = debounce(() => {
  if (!input.value) {
    listOwnFunnels()
    return
  }

  console.log('Searching all funnels...')
  isUpdating.value = true

  funnelApi.search(route.params.organization, {
    term: input.value,
  }).then(response => {
    console.log(response)
    funnels.value = response.data.data
    setTimeout(() => isUpdating.value = false, 800);
  })
}, 800)

function selectFunnel(funnelId) {
  const index = selected.value.indexOf(funnelId);

  if (index === -1) {
    selected.value.push(funnelId);
  } else {
    selected.value.splice(index, 1);
  }
}

function selectAllFunnels() {
  // selected.value.length == filteredFunnels.value.length ? 
  //   selected.value = [] : 
  //   selected.value = filteredFunnels.value.map((funnel) => funnel.id)

  selected.value.length == funnels.value.length ? 
    selected.value = [] : 
    selected.value = funnels.value.map((funnel) => funnel.id)
}

function attachFunnels() {
  emit('attachFunnels', selected.value)
  selected.value = []
  isModalOpen.value = false
}

function listOwnFunnels() {
  console.log('Listing own funnels...')

  funnelApi.index(route.params.organization).then(response => {
    funnels.value = response.data.data
  })
}

// Watch input and search funnels
watch(input, search)

onMounted(() => {
  listOwnFunnels()
})

const emit = defineEmits(['attachFunnels'])
</script>
