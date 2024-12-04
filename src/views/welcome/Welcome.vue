<template>
  <LayoutWithSidebar>
    <template #overlay>
      <!-- Force GA connection first -->
      <div v-if="organizationStore.organization && organizationStore.organization.connections_count == 0"  class="fixed h-full w-full items-center bg-white bg-opacity-60 backdrop-blur-sm flex justify-center z-50">
        <div class="-ml-60 -mt-96 flex flex-col text-center items-center justify-center border rounded-xl bg-white shadow-xl p-10">
          <svg class="w-10 h-10 mb-8" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
          <h1 class="mb-2 text-3xl font-medium text-gray-900">Connect Google Analytics</h1>
          <p class="text-lg text-gray-700 mb-4">Connecting your Google Analytics 4 account allows MetriFi to access your GA4 data and build funnels.</p>
          <AppButton @click="connectToGoogle()">Connect Google Analytics</AppButton>
        </div>
      </div>
    </template>

    <div v-if="organizationStore.organization.onboarding['connect-google-analytics'] == 'complete'">
      <!-- Complete -->
      <div v-if="organizationStore.organization.onboarding['onboardingComplete'] == true" class="rounded-xl bg-violet-50 p-4 mb-8">
        <h2 class="mb-2 text-3xl font-medium text-gray-900">You're all done! Nice work!</h2>
        <p class="text-lg text-gray-700 mb-4">You can unhide this Welcome screen at any time by going to Settings.</p>
        <AppButton @click="hideOnboarding()">Hide Welcome screen</AppButton>
      </div>

      <!-- Welcome -->
      <div v-else-if="organizationStore.organization.funnels_count == 0" class="rounded-lg border border-violet-400 bg-violet-50 p-6 mb-8">
        <div class="flex items-center gap-4 mb-2">
          <div class="w-6 h-6 border-2 border-t-transparent border-violet-600 rounded-full animate-spin"></div>
          <h2 class="text-2xl font-medium text-violet-600">Funnels in progress</h2>
        </div>
        <p class="text-lg text-gray-700">MetriFi is working on building funnels for you. We’ll notify your email when we’re done.</p>
      </div>
      
      <!-- Step tabs -->
      <AppCard v-if="organizationStore.organization" padding="none" class="">
        <!-- Welcome message -->
        <div class="p-6 border-b">
          <h3 v-if="organizationStore.organization.funnels_count == 0" class="text-2xl mb-1 font-medium text-gray-900">In the meantime</h3>
          <h3 v-else class="text-2xl mb-1 font-medium text-gray-900">Finish Google Analytics setup</h3>
          <p class="text-lg text-gray-500">Make sure google analytics is configured correctly so we can get all the data we need.</p>
        </div>

        <div class="flex mb-6">
          <div class="w-1/3 p-3 border-r">
            <ul role="list">
              <li 
                v-for="(step, index) in steps" 
                :key="step.id" 
                :class="step.current ? 'bg-violet-50 hover:bg-violet-100' : 'bg-white hover:bg-gray-50'" 
                class="relative flex space-x-3 rounded-lg p-3 cursor-pointer"
                @click="selectStep(step.id)"
              >
                <div v-if="organizationStore.organization.onboarding[step.id] === 'complete'" class="h-8 w-8 rounded-full flex items-center justify-center bg-emerald-500 text-white">
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </div>
                <div v-else class="h-8 w-8 rounded-full flex items-center justify-center bg-white border-2 border-gray-300 text-violet-600">
                  <span class="text-violet-600">{{ index + 1 }}</span>
                </div>
                <div class="flex items-center min-w-0 font-medium">
                  <p v-if="step.current" class="text-gray-900">{{ step.title }}</p>
                  <p v-else-if="organizationStore.organization.onboarding[step.id] === 'complete'" class="text-gray-400 line-through">{{ step.title }}</p>
                  <p v-else class="text-gray-500">{{ step.title }}</p>
                </div>
              </li>
            </ul>
          </div>

          <!-- Content -->
          <div v-if="currentStep" class="w-2/3 flex items-center px-3 py-10">
            <div v-if="currentStep.id === 'connect-google-analytics'" class="px-12">
              <svg class="w-10 h-10 mb-8" viewBox="-14 0 284 284" preserveAspectRatio="xMidYMid"><path d="M256.003 247.933a35.224 35.224 0 0 1-39.376 35.161c-18.044-2.67-31.266-18.371-30.826-36.606V36.845C185.365 18.591 198.62 2.881 216.687.24A35.221 35.221 0 0 1 256.003 35.4v212.533Z" fill="#F9AB00"/><path d="M35.101 213.193c19.386 0 35.101 15.716 35.101 35.101 0 19.386-15.715 35.101-35.101 35.101S0 267.68 0 248.295c0-19.386 15.715-35.102 35.101-35.102Zm92.358-106.387c-19.477 1.068-34.59 17.406-34.137 36.908v94.285c0 25.588 11.259 41.122 27.755 44.433a35.161 35.161 0 0 0 42.146-34.56V142.089a35.222 35.222 0 0 0-35.764-35.282Z" fill="#E37400"/></svg>
              <h2 class="mb-2 text-2xl font-medium text-gray-900">{{ currentStep.title }}</h2>
              <div v-html="currentStep.content" class="mb-5 text-lg text-gray-700"></div>
              <AppButton v-if="organizationStore.organization.onboarding[currentStep.id] !== 'complete'" @click="currentStep.action">{{ currentStep.cta }}</AppButton>
            </div>

            <div v-else class="px-12">
              <div v-if="currentStep.video" class="mb-8 aspect-video">
                <video v-if="currentStep.id === 'enable-enhanced-measurement'" class="h-full w-full rounded-lg" controls>
                  <source src="/video/enable-enhanced-measurement.mp4" type="video/mp4">
                </video>
                <video v-if="currentStep.id === 'extend-data-retention-period'" class="h-full w-full rounded-lg" controls>
                  <source src="/video/extend-data-retention-period.mp4" type="video/mp4">
                </video>
                <video v-if="currentStep.id === 'setup-cross-domain-tracking'" class="h-full w-full rounded-lg" controls>
                  <source src="/video/setup-cross-domain-tracking.mp4" type="video/mp4">
                </video>
                <video v-if="currentStep.id === 'add-custom-dimensions'" class="h-full w-full rounded-lg" controls>
                  <source src="/video/add-custom-dimensions.mp4" type="video/mp4">
                </video>
                <video v-if="currentStep.id === 'filter-out-internal-traffic'" class="h-full w-full rounded-lg" controls>
                  <source src="/video/filter-out-internal-traffic.mp4" type="video/mp4">
                </video>
              </div>

              <h2 class="mb-2 text-2xl font-medium text-gray-900">{{ currentStep.title }}</h2>
              <div v-html="currentStep.content" class="mb-5 text-lg text-gray-700"></div>

              <AppButton v-if="organizationStore.organization.onboarding[currentStep.id] === 'complete'" @click="markStepIncomplete(currentStep.id)" variant="tertiary">Mark as incomplete</AppButton>
              <AppButton v-else @click="currentStep.action">{{ currentStep.cta }}</AppButton>
            </div>
          </div>
        </div>
      </AppCard>
    </div>
  </LayoutWithSidebar>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckIcon, CheckCircleIcon } from '@heroicons/vue/20/solid'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { useOrganizationStore } from '@/domain/organizations/store/useOrganizationStore'
import { googleApi } from '@/domain/services/google/api/googleApi.js'
import LayoutWithSidebar from '@/app/layouts/LayoutWithSidebar.vue'

const route = useRoute()
const router = useRouter()
const { listConnections, connections, connectToGoogle } = useConnections()

const organizationStore = useOrganizationStore()

const steps = ref([
  {
    id: 'connect-google-analytics',
    current: true,
    title: 'Connect Google Analytics',
    content: 'Connecting your Google Analytics 4 account allows MetriFi to access your GA4 data and build funnels.',
    cta: 'Connect Google Analytics',
    action: connectToGoogle
  },
  {
    id: 'enable-enhanced-measurement',
    current: false,
    title: 'Enable enhanced measurement',
    content: 'Enhanced measurement in Google Analytics 4 enables additional event measurement such as outbound clicks and form submissions.',
    video: true,
    cta: 'Mark as complete',
    action: () => {
      completeStep('enable-enhanced-measurement')
    }
  },
  {
    id: 'extend-data-retention-period',
    current: false,
    title: 'Extend data retention period',
    content: 'Set both event and user data to 14 months. Extending the data retention period allows our app to access a longer history of your data.',
    video: true,
    cta: 'Mark as complete',
    action: () => {
      completeStep('extend-data-retention-period')
    }
  },
  {
    id: 'setup-cross-domain-tracking',
    current: false,
    title: 'Set up cross-domain tracking',
    content: 'Set up cross-domain tracking for all third-party domains affiliated with your website, such as MeridianLink and Blend. IMPORTANT: In order for cross-domain tracking to work, the same GA must be installed on those other websites.',
    video: true,
    cta: 'Mark as complete',
    action: () => {
      completeStep('setup-cross-domain-tracking')
    }
  },
  {
    id: 'filter-out-internal-traffic',
    current: false,
    title: 'Filter out internal traffic',
    content: `
      <p>Filtering out internal traffic ensures that our app analyzes only genuine user interactions, giving you more accurate insights and a clearer picture of your audience\'s behavior.</p>

      <p class="pt-4">To complete this step, you need to do two things in Google Analytics 4: (1) enter the IP addresses used by you and your coworkers and (2) enable a data filter so that traffic from those IP addresses doesn't show up in your analytics reports. Watch the video to learn how to do it.</p>
    `,
    video: true,
    cta: 'Mark as complete',
    action: () => {
      completeStep('filter-out-internal-traffic')
    }
  },
  {
    id: 'add-custom-dimensions',
    current: false,
    title: 'Add custom dimensions (optional)',
    content: `
      <p>Adding custom dimensions allows MetriFi to track additional analytics specific to forms, including form destination, form ID, form length, and form submit text.</p>
      <p class="pt-3 font-bold">Add a custom dimension with the following user properties:</p>
      <ul class="list-disc pl-5 pt-2">
        <li>form_destination</li>
        <li>form_id</li>
        <li>form_length</li>
        <li>form_submit_text</li>
      </ul>
    `,
    video: true,
    cta: 'Mark as complete',
    action: () => {
      completeStep('add-custom-dimensions')
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

const selectNextIncompleteStep = () => {
  for (const property in organizationStore.organization.onboarding) {
    if (organizationStore.organization.onboarding[property] === 'incomplete') {
      selectStep(property)
      return
    }
  }
}

const completeStep = (id) => {
  organizationStore.organization.onboarding[id] = 'complete'

  // check if all steps are complete
  for (const property in organizationStore.organization.onboarding) {
    if (organizationStore.organization.onboarding[property] === 'incomplete') {
      organizationStore.update().then(() => {
        selectNextIncompleteStep()
      })
      return
    }
  }

  organizationStore.organization.onboarding['onboardingComplete'] = true
  organizationStore.update()
}

const hideOnboarding = () => {
  organizationStore.organization.onboarding['hideOnboarding'] = true

  organizationStore.update().then(() => {
    router.push({ name: 'dashboards'})
  })
}

const markStepIncomplete = (id) => {
  organizationStore.organization.onboarding[id] = 'incomplete'
  organizationStore.organization.onboarding['onboardingComplete'] = false
  organizationStore.update()
}

// function connectToGoogle() {
//   googleApi.connect({
//     scope: 'https://www.googleapis.com/auth/analytics.readonly',
//     state: route.params.organization,
//   })
//   .then(response => {
//     window.location.href = response.data.url
//   })
// }

function checkConnections() {
  listConnections().then(() => {

    if (connections.value.length !== 0) {
      organizationStore.organization.onboarding['connect-google-analytics'] = 'complete'
    }

    selectNextIncompleteStep()
  })
}

onMounted(() => {
  checkConnections()
})
</script>
