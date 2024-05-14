<template>
  <LayoutWithSidebar>
    <!-- Welcome -->
    <div class="mb-8">
      <h2 class="mb-2 text-3xl font-medium text-gray-900">Welcome!</h2>
      <p class="text-lg text-gray-500">Let's get setup.</p>
    </div>

    <!-- Step tabs -->
    <AppCard padding="none" class="flex mb-6">
      <div class="w-1/3 p-3 border-r">
        <ul role="list">
          <li 
            v-for="(step, index) in steps" 
            :key="step.id" 
            :class="step.current ? 'bg-indigo-50 hover:bg-indigo-100' : 'bg-white hover:bg-gray-50'" 
            class="relative flex space-x-3 rounded-lg p-3 cursor-pointer"
            @click="selectStep(step.id)"
          >
            <div v-if="step.complete" class="h-8 w-8 rounded-full flex items-center justify-center bg-emerald-500 text-white">
              <CheckIcon class="h-5 w-5" aria-hidden="true" />
            </div>
            <div v-else class="h-8 w-8 rounded-full flex items-center justify-center bg-white border-2 border-gray-300 text-indigo-600">
              <span class="text-indigo-600">{{ step.id }}</span>
            </div>
            <div class="flex items-center min-w-0 font-medium">
              <p v-if="step.current" class="text-gray-900">{{ step.title }}</p>
              <p v-else-if="step.complete" class="text-gray-400 line-through">{{ step.title }}</p>
              <p v-else class="text-gray-500">{{ step.title }}</p>
            </div>
          </li>
        </ul>
      </div>

      <!-- Content -->
      <div class="w-2/3 flex items-center px-3 py-10">
        <div class="px-12">
          <svg v-if="currentStep.id === 1" class="w-10 h-10 mb-8" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>

          <div v-if="currentStep.video" class="mb-8 aspect-video">
            <video v-if="currentStep.id === 2" class="h-full w-full rounded-lg" controls>
              <source src="/video/enable-enhanced-measurement.mp4" type="video/mp4">
            </video>
            <video v-if="currentStep.id === 3" class="h-full w-full rounded-lg" controls>
              <source src="/video/extend-data-retention-period.mp4" type="video/mp4">
            </video>
            <video v-if="currentStep.id === 4" class="h-full w-full rounded-lg" controls>
              <source src="/video/setup-cross-domain-tracking.mp4" type="video/mp4">
            </video>
            <video v-if="currentStep.id === 5" class="h-full w-full rounded-lg" controls>
              <source src="/video/add-custom-dimensions.mp4" type="video/mp4">
            </video>
            <video v-if="currentStep.id === 6" class="h-full w-full rounded-lg" controls>
              <source src="/video/filter-out-internal-traffic.mp4" type="video/mp4">
            </video>
          </div>

          <h2 class="mb-2 text-2xl font-medium text-gray-900">{{ currentStep.title }}</h2>
          <p class="mb-4 text-lg text-gray-500">{{ currentStep.content }}</p>

          <AppButton v-if="!currentStep.complete" @click="currentStep.action">{{ currentStep.cta }}</AppButton>
          <AppButton v-else variant="tertiary">Mark as incomplete</AppButton>
        </div>
      </div>
    </AppCard>
  </LayoutWithSidebar>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { CheckIcon } from '@heroicons/vue/20/solid'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { useOrganizationStore } from '@/domain/base/organizations/store/useOrganizationStore'
import { googleApi } from '@/domain/services/google/api/googleApi.js'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'

const route = useRoute()
const organizationStore = useOrganizationStore()
const { listConnections, connections } = useConnections()

const steps = ref([
  {
    id: 1,
    complete: true,
    current: false,
    slug: 'connect-google-analytics',
    title: 'Connect Google Analytics',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    cta: 'Connect Google Analytics',
    action: connectToGoogle
  },
  {
    id: 2,
    complete: false,
    current: true,
    slug: 'enable-enhanced-tracking',
    title: 'Enable enhanced tracking',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    video: true,
    cta: 'Mark as complete',
    action: () => {
      completeStep(2)
      selectStep(3)
    }
  },
  {
    id: 3,
    complete: false,
    current: false,
    slug: 'extend-data-retention-period',
    title: 'Extend data retention period',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    video: true,
    cta: 'Mark as complete',
    action: () => {
      completeStep(3)
      selectStep(4)
    }
  },
  {
    id: 4,
    complete: false,
    current: false,
    slug: 'set-up-cross-domain-tracking',
    title: 'Set up cross-domain tracking',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    video: true,
    cta: 'Mark as complete',
    action: () => {
      completeStep(4)
      selectStep(5)
    }
  },
  {
    id: 5,
    complete: false,
    current: false,
    slug: 'add-custom-dimensions',
    title: 'Add custom dimensions',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    video: true,
    cta: 'Mark as complete',
    action: () => {
      completeStep(5)
      selectStep(6)
    }
  },
  {
    id: 6,
    complete: false,
    current: false,
    slug: 'filter-out-internal-traffic',
    title: 'Filter out internal traffic',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    video: true,
    cta: 'Mark as complete',
    action: () => {
      completeStep(6)
    }
  },
])

const currentStep = computed(() => steps.value.find(step => step.current))

const selectStep = (id) => {
  steps.value = steps.value.map(step => {
    if (step.id === id) {
      step.current = true
    } else {
      step.current = false
    }
    return step
  })
}

const completeStep = (id) => {
  steps.value = steps.value.map(step => {
    if (step.id === id) {
      step.complete = true
    }
    return step
  })

  // organizationStore.update().then(() => {
  //   organizationStore.toggleUpdateModal()
  // })
}

function connectToGoogle() {
  googleApi.connect({
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    state: route.params.organization,
  })
  .then(response => {
    window.location.href = response.data.url
  })
}

onMounted(() => {
  listConnections().then(() => {
    if (connections.value.length === 0) {
      steps.value[0].complete = false
      selectStep(1)
    }
  })

  // Select the first step that is incomplete
  // const incompleteStep = steps.value.find(step => !step.complete)
  // if (incompleteStep) {
  //   selectStep(incompleteStep.id)
  // } else {
  //   selectStep(6)
  // }
})
</script>
