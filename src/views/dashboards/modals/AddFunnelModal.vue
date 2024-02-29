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
          <template
            v-for="funnel in funnels" 
            :key="funnel.id" 
          >
            <tr v-if="funnelsAlreadyAttachedIds.includes(funnel.id)" class="bg-gray-100">
              <td class="py-4 pl-4 sm:pl-6"></td>
              <td class="whitespace-nowrap py-4 text-sm">
                <div class="flex items-center gap-2">
                  <p class="mb-1 text-base font-medium text-gray-500">{{ funnel.name }}</p>
                  <span class="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">Already in use</span>
                </div>
              </td>
              <td class="whitespace-nowrap py-4 text-sm text-gray-400">
                <div class="flex items-center text-sm mr-2">
                  {{ funnel.organization.title }}
                </div>
              </td>
            </tr>

            <tr v-else @click="selectFunnel(funnel.id)" :class="selected.includes(funnel.id) ? 'bg-gray-100' : ''" class="hover:bg-gray-50 cursor-pointer">
              <td class="py-4 pl-4 sm:pl-6">
                <input 
                  @select="selectFunnel(funnel.id)" 
                  :checked="selected.includes(funnel.id)" 
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" 
                  type="checkbox" 
                />
              </td>
              <td class="whitespace-nowrap py-4 text-sm">
                <div class="flex-auto">
                  <p class="text-base font-medium leading-6 text-gray-900">{{ funnel.name }}</p>
                </div>
              </td>
              <td class="whitespace-nowrap py-4 text-sm text-gray-400">
                <div class="flex items-center text-sm mr-2">
                  {{ funnel.organization.title }}
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Empty state: No funnels -->
      <div v-else class="text-center bg-slate-50 rounded-2xl py-12 px-2">
        <ChartBarIcon class="mx-auto h-10 w-10 text-indigo-600" aria-hidden="true" />
        <h2 class="mt-2 text-lg font-medium text-gray-900">No funnels found</h2>
        <p class="mt-1 text-gray-400">Try another search term.</p>
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
const funnelsAlreadyAttachedIds = inject('funnelsAlreadyAttachedIds')
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
