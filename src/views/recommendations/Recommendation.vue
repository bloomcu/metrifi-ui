<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <div ref="tailwind"/>

    <!-- Header -->
    <header v-if="recommendationStore.recommendation" class="px-4 py-3 flex items-center justify-between border-b">
      <div class="flex items-center gap-3 grow">
        <!-- Back button -->
        <AppButton :to="{name: 'recommendations', params: {organization: route.params.organization}}" variant="tertiary" size="sm" class="flex items-center gap-2">
          <ArrowLeftIcon class="h-5 w-5 shrink-0" />
          Back to recommendations
        </AppButton>

        <!-- Recommendation title -->
        <AppInlineEditor 
          v-model="recommendationStore.recommendation.title" 
          @update:modelValue="recommendationStore.update(route.params.organization, recommendationStore.recommendation.id, { title: recommendationStore.recommendation.title })"
          class="text-base font-semibold leading-6 text-gray-900"
        >
          <p class="text-base font-semibold leading-6 text-gray-900">{{ recommendationStore.recommendation.title }}</p>
        </AppInlineEditor>

        <!-- Step -->
        <p class="text-sm">For step {{ recommendationStore.recommendation.step_index + 1 }}</p>

        <!-- Created by -->
        <span class="text-gray-400 text-sm font-normal">Created {{ moment(recommendationStore.recommendation.created_at).fromNow() }} by {{ recommendationStore.recommendation.user.name }}</span>
      </div>

      <div class="flex items-center gap-2">
        <p v-if="isLoading" class="text-xs text-gray-400">Loading...</p>

        <AppButton v-if="recommendationStore.recommendation.dashboard_id" :to="{name: 'dashboard', params: {dashboard: recommendationStore.recommendation.dashboard_id}}" variant="link" size="sm" class="flex items-center gap-2">
          Go to dashboard
        </AppButton>

        <AppButton v-if="recommendationStore.recommendation.status === 'done'" @click="toggleGenerateRecommendationModal()" variant="secondary" size="base">
          Regenerate
        </AppButton>

        <AppButton @click="pushToWordPress()" variant="secondary" size="base" class="flex items-center gap-2">
          Push to WordPress
        </AppButton>

        <AppButton @click="isRecommendationsListPanelOpen = true" variant="tertiary" size="base" class="flex items-center gap-2">
          Recommendations
        </AppButton>
      </div>
    </header>

    <!-- Issue -->
    <div v-if="issue" class="flex flex-col items-center justify-center min-h-screen">
      <div class="p-6 text-center text-gray-700">
        <p class="text-3xl font-bold mb-4">The AI failed to complete the job.</p>
        <p class="mb-8">Sorry, please try again later. If this issue continues, please contact support.</p>
        
        <AppButton @click="toggleGenerateRecommendationModal()" variant="primary" size="base" class="mb-14">
          Regenerate recommendation
        </AppButton>

        <pre class="bg-gray-100 text-sm rounded-md justify-end">Error details: {{ issue }}</pre>
      </div>
    </div>
    
    <!-- Recommendation -->
    <div v-if="recommendationStore.recommendation" class="min-h-screen flex flex-col">
      <!-- Container -->
      <div class="flex flex-grow h-0">
        <!-- Left Side (Collapsible) -->
        <div :class="[toggled ? 'min-w-[420px]' : 'max-w-[36px]', show === 'code' ? 'w-1/2' : 'w-1/3 max-w-[560px]']" class="pb-20 h-full overflow-y-auto bg-white border-r">
          <div v-if="toggled" class="px-4 pt-6">
            <!-- Tabs -->
            <div class="flex mb-6">
              <div class="p-1 border bg-white rounded-lg flex space-x-1 text-gray-700 font-medium">
                  <button @click="show = 'prompt'" :class="show === 'prompt' ? 'bg-violet-100 text-violet-500' : ''" class="px-3 py-2 rounded-md flex items-center space-x-1">
                    <span class="text-sm">Instructions</span>
                  </button>
                  <button @click="show = 'recommendation'" :class="show === 'recommendation' ? 'bg-violet-100 text-violet-500' : ''" class="px-3 py-2 rounded-md flex items-center space-x-1">
                    <span class="text-sm">Analysis</span>
                  </button>
                  <button @click="show = 'code'" :class="show === 'code' ? 'bg-violet-100 text-violet-500' : ''" class="px-3 py-2 rounded-md flex items-center space-x-1">
                    <span class="text-sm">Code editor</span>
                  </button>
                  <button @click="show = 'chat'" :class="show === 'chat' ? 'bg-violet-100 text-violet-500' : ''" class="px-3 py-2 rounded-md flex items-center space-x-1">
                    <span class="text-sm">AI editor</span>
                  </button>
              </div>
            </div>

            <!-- Instructions (prompt) -->
            <div v-if="show === 'prompt'">
              <!-- Accordion 1 - UI analysis -->
              <div class="mb-4 border border-gray-300 rounded-lg overflow-hidden">
                <div class="flex items-center justify-between h-14 px-4 bg-white cursor-pointer" @click="toggleAccordion('accordion1')">
                  <div class="flex items-center gap-4">
                    <MinusIcon v-if="accordionStates.accordion1" class="h-6 w-6 text-gray-600"/>
                    <PlusIcon v-else class="h-6 w-6 text-gray-600"/>
                    <h2 class="font-medium">Compare to higher-converting pages</h2>
                  </div>

                  <div v-if="recommendationStore.recommendation.metadata && recommendationStore.recommendation.metadata.comparisons" class="flex items-center gap-2">
                    <CheckCircleIcon class="h-7 w-7 text-emerald-600"/>
                  </div>
                </div>
                <div v-if="accordionStates.accordion1" class="p-4 border-t transition-all duration-300 ease-in-out">
                  <div class="space-y-4">
                    <p class="text-gray-600">MetriFi AI compares your webpage with higher-converting pages to find opportunities to increase your conversion rate.</p>

                    <div v-if="recommendationStore.recommendation.metadata && recommendationStore.recommendation.metadata.comparisons">
                      <p class="font-semibold mb-2">Higher-converting comparisons</p>
                      <ul class="border divide-y bg-white rounded-md">
                        <li v-for="comparison in recommendationStore.recommendation.metadata.comparisons" class="flex items-center justify-between py-3 px-4">
                          <div v-if="comparison.funnel">
                            <p class="text-gray-500">Funnel: {{ comparison.funnel}}</p>
                            <p>Step: <span class="font-semibold">{{ comparison.name }}</span></p>
                          </div>
                          <p v-else><span class="font-semibold">{{ comparison.name }}</span></p>
                          <p>{{ Number(comparison.conversion).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%</p>
                        </li>
                      </ul>
                    </div>

                    <div v-else>
                      <p class="font-semibold mb-2">Higher-converting comparisons</p>
                      <p class="text-gray-600">No higher-converting comparisons</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Accordion 2 - Additional information -->
              <div class="mb-4 border border-gray-300 rounded-lg overflow-hidden">
                <div class="flex items-center justify-between h-14 px-4 bg-white cursor-pointer" @click="toggleAccordion('accordion2')">
                  <div class="flex gap-4">
                    <MinusIcon v-if="accordionStates.accordion2" class="h-6 w-6 text-gray-600"/>
                    <PlusIcon v-else class="h-6 w-6 text-gray-600"/>
                    <h2 class="font-medium">Additional information</h2>
                  </div>
                  <CheckCircleIcon v-if="recommendationStore.recommendation.prompt && recommendationStore.recommendation.prompt !== '<p></p>' || recommendationStore.recommendation.files.length" class="h-7 w-7 text-emerald-600"/>
                </div>

                <div v-if="accordionStates.accordion2" class="p-4 border-t transition-all duration-300 ease-in-out">
                  <div class="space-y-6">
                    <p class="text-gray-600">More details for MetriFi AI to consider while generating the recommendation.</p>

                    <!-- Prompt content -->
                    <div v-if="recommendationStore.recommendation.prompt">
                      <p class="font-semibold mb-1">Instructions</p>
                      <AppRichtext v-model="recommendationStore.recommendation.prompt" class="mb-2"/>
                    </div>
                    <div v-else>
                      <p class="font-semibold mb-1">Instructions</p>
                      <p class="text-gray-600">No instructions provided</p>
                    </div>

                    <!-- Files -->
                    <div v-if="recommendationStore.recommendation.files.length">
                      <p class="font-semibold mb-4">Files</p>
                      <ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8">
                        <li v-for="file in recommendationStore.recommendation.files" :key="file.id" class="relative">
                          <div class="group relative block overflow-hidden rounded-lg bg-gray-100 border mb-2">
                            <img :src="file.url" :alt="file.alt" width="400" class="select-none pointer-events-none shrink-0 w-full h-32 object-cover"/>
                          </div>
                          <p class="block truncate text-sm font-medium text-gray-900 mb-1">{{ file.title }}</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Accordion 3 - Secret shopper information -->
              <div class="mb-4 border border-gray-300 rounded-lg overflow-hidden">
                <div class="flex items-center justify-between h-14 px-4 bg-white cursor-pointer" @click="toggleAccordion('accordion3')">
                  <div class="flex gap-4">
                    <MinusIcon v-if="accordionStates.accordion3" class="h-6 w-6 text-gray-600"/>
                    <PlusIcon v-else class="h-6 w-6 text-gray-600"/>
                    <h2 class="font-medium">Secret shopping study</h2>
                  </div>
                  <CheckCircleIcon v-if="recommendationStore.recommendation.secret_shopper_prompt && recommendationStore.recommendation.secret_shopper_prompt !== '<p></p>' || recommendationStore.recommendation.secret_shopper_files.length" class="h-7 w-7 text-emerald-600"/>
                </div>

                <div v-if="accordionStates.accordion3" class="p-4 border-t transition-all duration-300 ease-in-out">
                  <div class="space-y-6">
                    <p class="text-gray-600">Insights from a secret shopping study for MetriFi AI to consider while generating the recommendation.</p>

                    <!-- Prompt content -->
                    <div v-if="recommendationStore.recommendation.secret_shopper_prompt">
                      <p class="font-semibold mb-1">Details</p>
                      <AppRichtext v-model="recommendationStore.recommendation.secret_shopper_prompt" class="mb-2"/>
                    </div>
                    <div v-else>
                      <p class="font-semibold mb-1">Details</p>
                      <p class="text-gray-600">No details provided</p>
                    </div>

                    <!-- Files -->
                    <div v-if="recommendationStore.recommendation.secret_shopper_files.length">
                      <p class="font-semibold mb-4">Files</p>
                      <ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8">
                        <li v-for="file in recommendationStore.recommendation.secret_shopper_files" :key="file.id" class="relative">
                          <div class="group relative block overflow-hidden rounded-lg bg-gray-100 border mb-2">
                            <img :src="file.url" :alt="file.alt" width="400" class="select-none pointer-events-none shrink-0 w-full h-32 object-cover"/>
                          </div>
                          <p class="block truncate text-sm font-medium text-gray-900 mb-1">{{ file.title }}</p>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Analysis (recommendation) -->
            <div v-if="show === 'recommendation'" class="">
              <AppRichtext v-if="recommendationStore.recommendation.content" v-model="recommendationStore.recommendation.content" class="px-2 mb-2"/>
              <p v-else class="border bg-gray-50 rounded-lg p-4 text-base mb-1 text-gray-700 font-medium">Awaiting analysis...</p>
            </div>

            <!-- Code -->
            <div v-if="show === 'code'" class="h-[100vh] overflow-y-auto flex flex-col">
              <CodeEditor 
                v-if="recommendationStore.selectedBlock" 
                v-model="recommendationStore.selectedBlock.html" 
                @update:modelValue="updateBlock"
              />

              <div v-else class="p-4 bg-gray-50 rounded-md border">
                <p class="text-base mb-1 text-gray-700 font-medium">How to use the code editor</p>
                <p class="text-sm text-gray-500">Click a block in the prototype to view and edit its code.</p>
              </div>
            </div>

            <!-- Chat -->
            <div v-if="show === 'chat'" class="h-[calc(100vh-200px)] flex flex-col">
              <ChatInterface />
            </div>
          </div>
        </div>

        <!-- Divider with Toggle Button -->
        <div class="relative flex items-center">
          <button @click="toggled = !toggled" :class="toggled ? 'right-8' : 'rotate-180 -right-4'" class="absolute top-12 transform -translate-y-1/2 flex items-center justify-center border border-gray-300 bg-white text-gray-400 w-8 h-8 rounded-full">
            <ChevronLeftIcon class="h-5 w-5 shrink-0 -ml-[3px]" />
          </button>
        </div>

        <!-- Right Side (2/3 of the screen) -->
        <div class="pb-40 flex-1 h-full overflow-y-auto px-8 pt-5 bg-white">
          <!-- Loading content -->
          <div v-if="recommendationStore.isInProgress(recommendationStore.recommendation.status)" class="p-6">
            <div class="flex items-center justify-center mb-6">
              <div class="w-12 h-12 border-2 border-violet-300 rounded-full border-t-transparent spin"/>
            </div>
            <p class="text-xl text-center text-gray-700 mb-6">{{ currentStep.text }}</p>
            <div class="w-96 m-auto relative h-2 bg-gray-200 rounded">
              <div :style="{ width: progressWidth, transition: 'width 0.5s ease' }" class="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-600 to-violet-300 rounded"/>
            </div>
          </div>

          <Prototype 
            v-if="recommendationStore.recommendation.latest_page && recommendationStore.recommendation.latest_page.blocks.length"
            @poll-recommendation="pollRecommendation()"
            @fetch-recommendation="fetchRecommendation()"
          />
        </div>
      </div>

      <GenerateRecommendationModal 
        :dashboardId="recommendationStore.recommendation.dashboard_id" 
        :stepIndex="recommendationStepIndex" 
        :prompt="recommendationPrompt" 
        :secret-shopper-prompt="recommendationSecretShopperPrompt" 
        :open="isGenerateRecommendationModalOpen"/>
    </div>
    
    <RecommendationsListPanel/>
  </div>
</template>

<script setup>
import moment from "moment"
import debounce from 'lodash.debounce'
import { ref, reactive, provide, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { blocksApi } from '@/domain/blocks/api/blocksApi'
import { useOrganizationSubscriptionStore } from '@/domain/organizations/store/useOrganizationSubscriptionStore'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { ArrowLeftIcon, ChevronLeftIcon, PlusIcon, MinusIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import AppRichtext from '@/app/components/base/forms/AppRichtext.vue'
import CodeEditor from '@/views/recommendations/components/CodeEditor.vue'
import Prototype from '@/views/recommendations/components/Prototype.vue'
import ChatInterface from '@/views/recommendations/components/ChatInterface.vue'
import RecommendationsListPanel from '@/views/recommendations/components/RecommendationsListPanel.vue'
import GenerateRecommendationModal from '@/views/dashboards/modals/GenerateRecommendationModal.vue'
import AppInlineEditor from '@/app/components/base/forms/AppInlineEditor.vue'

const router = useRouter()
const route = useRoute()

const organizationSubscriptionStore = useOrganizationSubscriptionStore()
const recommendationStore = useRecommendationStore()

// UI states
const isLoading = ref(false)
const isRecommendationsListPanelOpen = ref(false)
const isGenerateRecommendationModalOpen = ref(false)

// Provide UI states
provide('isRecommendationsListPanelOpen', isRecommendationsListPanelOpen)
provide('isGenerateRecommendationModalOpen', isGenerateRecommendationModalOpen)

// Recommendation states
const recommendationStepIndex = ref(null)
const recommendationPrompt = ref('')
const recommendationSecretShopperPrompt = ref('')

// Tabs state
const hasShownAnalysisToUser = ref(false)
const toggled = ref(true)
const show = ref('chat')

// Accordions state
const accordionStates = reactive({
  accordion1: false,
  accordion2: false,
  accordion3: false,
})

const toggleAccordion = (accordionName) => {
  if (accordionStates.hasOwnProperty(accordionName)) {
    accordionStates[accordionName] = !accordionStates[accordionName]
  }
}

// Generating recommendation states
const steps = [
  { status: 'initializing', text: 'Engaging design thrusters', completed: false },
  { status: 'screenshot_grabber_in_progress', text: 'Taking screenshots', completed: false },
  { status: 'comparison_analyzer_in_progress', text: 'Analyzing comparisons', completed: false },
  { status: 'synthesizer_in_progress', text: 'Synthesizing prompt', completed: false },
  { status: 'anonymizer_in_progress', text: 'Reviewing analysis', completed: false },
  { status: 'content_writer_in_progress', text: 'Writing new content', completed: false },
  { status: 'section_counter_in_progress', text: 'Counting sections', completed: false },
  { status: 'page_builder_in_progress', text: 'Building component', completed: false },
  { status: 'page_builder_completed', text: 'Queuing next component', completed: false },
  { status: 'done', text: 'All done', completed: false },
]

/**
 * Push to WordPress functionality
 * ------------------------------
 */

function pushToWordPress() {
  let route = router.resolve({name: 'recommendation-push-to-wordpress'})
  window.open(route.href, '_blank')
}

/** 
 * Block CRUD functionality
 * --------------------
 */
const updateBlock = debounce(() => {
  console.log('Updating block...')
  isLoading.value = true

  blocksApi.update(
      route.params.organization,
      recommendationStore.selectedBlock.id,
      { html: recommendationStore.selectedBlock.html }
  ).then((response) => {
    // Update block with the response data
    Object.assign(recommendationStore.selectedBlock, response.data.data)

    setTimeout(() => isLoading.value = false, 800)
  })
}, 1500)

function toggleGenerateRecommendationModal() {
  isGenerateRecommendationModalOpen.value = !isGenerateRecommendationModalOpen.value 
  recommendationStepIndex.value = recommendationStore.recommendation.step_index
  recommendationPrompt.value = recommendationStore.recommendation.prompt
  recommendationSecretShopperPrompt.value = recommendationStore.recommendation.secret_shopper_prompt
}

let interval = null
const issue = ref(null)
const currentStepIndex = ref(0)
const currentStep = computed(() => steps[currentStepIndex.value])

const progressWidth = computed(() => {
  return `${((currentStepIndex.value + 1) / steps.length) * 100}%`
})

function pollRecommendation() {
  if (interval == null) {
    console.log('Polling recommendation')
    interval = setInterval(fetchRecommendation, 1500)
  }
}

function fetchRecommendation() {
  console.log('Fetching recommendation')
  isLoading.value = true

  recommendationStore.show(route.params.organization, route.params.recommendation)
    .then(response => {
      const recommendation = recommendationStore.recommendation
      
      // Update current step of the recommendation's progress
      const currentStepIdx = steps.findIndex(step => step.status === recommendation.status)
      if (currentStepIdx !== -1) {
        currentStepIndex.value = currentStepIdx
      }

      // If any blocks are still generating, continue polling
      const someBlocksAreGenerating = recommendation?.latest_page?.blocks?.length > 0 && recommendation.latest_page.blocks.some(block => block.status === 'generating');
      if (someBlocksAreGenerating) {
        console.log('Some blocks are being generated')
        setTimeout(() => isLoading.value = false, 800)
        return
      }

      // If recommendation is not done, continue polling
      if (recommendation.status !== 'done') {
        console.log('Recommendation is not done being generated')
        setTimeout(() => isLoading.value = false, 800)
        return
      }
      
      // If recommendation is failed, show error
      if (recommendationStore.isFailed(recommendation.status)) {
        console.log('Recommendation failed with status:', recommendation.status)
        issue.value = recommendation.status
      }

      // If recommendation is done and no blocks are generating, stop polling
      if (interval !== null) {
        console.log('Stopping polling')
        clearInterval(interval)
        interval = null
      }
      
      setTimeout(() => isLoading.value = false, 800)
    })

    .catch(error => {
      console.error('Error fetching recommendation status:', error)
    })
}

const tailwind = ref(null)

onMounted(() => {
  // Initial fetch and polling
  fetchRecommendation()
  pollRecommendation()
  
  
  // Setup Tailwind
  const tailwindScript = document.createElement('script')
  tailwindScript.src = 'https://cdn.tailwindcss.com'
  document.head.appendChild(tailwindScript)
  
  organizationSubscriptionStore.show(route.params.organization)
})

onUnmounted(() => {
  if (interval) {
    clearInterval(interval)
  }
})
</script>

<style>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spin {
  animation: spin 2s linear infinite;
}
</style>