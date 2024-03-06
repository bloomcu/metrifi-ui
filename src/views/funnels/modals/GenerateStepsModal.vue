<template>
  <AppModal 
    size="md"
    @closed="isGenerateStepsModalOpen = false" 
    :open="isGenerateStepsModalOpen"
  >
    <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-6 sm:truncate sm:text-2xl">Generate funnel steps</h3>

    <form v-if="!isGeneratingSteps" action="#" @submit.prevent="generateSteps()" class="flex flex-col gap-4">
      <AppInput v-model="input" label="Terminal page path" required />
      
      <div class="border border-gray-200 p-3 rounded-md">
        <p class="mb-2 text-xs text-gray-900">Run an example for myzing.com - GA4</p>
        <span @click="input = '/personal/loans/home/loans-for-home-buying/'" class="inline-flex items-center rounded-md cursor-pointer bg-purple-50 px-2 py-1 mb-1.5 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 hover:bg-purple-100">/personal/loans/home/loans-for-home-buying/</span>
        <span @click="input = '/personal/loans/vehicle/auto-loans/'" class="inline-flex items-center rounded-md cursor-pointer bg-purple-50 px-2 py-1 mb-1.5 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 hover:bg-purple-100">/personal/loans/vehicle/auto-loans/</span>
      </div>

      <AppButton :loading="loading" class="w-full">Generate</AppButton>
    </form>

    <div v-else>
      <div class="group relative flex items-start mb-6" aria-current="step">
        <span class="flex h-9 items-center" aria-hidden="true">
          <span class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
            <span class="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
              <svg aria-hidden="true" role="status" class="h-5 w-5 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
              </svg>
            </span>
          </span>
        </span>
        <span class="ml-4 flex min-w-0 flex-col">
          <span class="text-sm font-medium text-indigo-600">Running automation</span>
          <span class="text-sm text-gray-500">Ai is generating steps for this funnel.</span>
        </span>
      </div>

      <AppButton @click="isGenerateStepsModalOpen = false" variant="secondary" class="w-full">Close</AppButton>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useRoute } from 'vue-router'
import { funnelApi } from '@/domain/funnels/api/funnelApi.js'

const route = useRoute()
const loading = ref(false)
const input = ref('')

const isGenerateStepsModalOpen = inject('isGenerateStepsModalOpen')
const isGeneratingSteps = inject('isGeneratingSteps')
const errorGeneratingSteps = inject('errorGeneratingSteps')

function generateSteps() {
  console.log('Generating steps with AI...')

  isGenerateStepsModalOpen.value = false
  isGeneratingSteps.value = true
  errorGeneratingSteps.value = null

  funnelApi.generateSteps(
    route.params.organization, 
    route.params.funnel, 
    { 
      terminalPagePath: input.value 
    }
  ).then(() => {
    isGeneratingSteps.value = false
    emit('done')
  }).catch((error) => {
    console.log(error)
    isGeneratingSteps.value = false
    errorGeneratingSteps.value = 'Error generating steps.'
  })
}

const emit = defineEmits(['done'])
</script>
