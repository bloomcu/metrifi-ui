<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <div ref="tailwind"/>

    <!-- Header -->
    <header class="px-4 py-3 flex items-center justify-between border-b">
      <div class="flex items-center gap-3 grow">
        <AppButton @click="router.push({name: 'dashboard'})" variant="primary" size="base">
          <ArrowLeftIcon class="h-4 w-4 shrink-0" />
        </AppButton>
        <p v-if="recommendationStore.recommendation" class="text-base font-semibold leading-6 text-gray-900">{{ recommendationStore.recommendation.title }} recommendation</p>
        <p v-if="recommendationStore.recommendation" class="text-sm">For step {{ recommendationStore.recommendation.step_index + 1 }}</p>
        <span v-if="recommendationStore.recommendation" class="text-gray-400 text-sm font-normal">Created {{ moment(recommendationStore.recommendation.created_at).fromNow() }} by {{ recommendationStore.recommendation.user.name }}</span>
      </div>

      <div class="flex items-center gap-2">
        <p v-if="isLoading" class="text-xs text-gray-400">Loading...</p>

        <AppButton v-if="recommendationStore.recommendation && recommendationStore.recommendation.status === 'done'" @click="toggleGenerateRecommendationModal()" variant="secondary" size="base">
          Regenerate
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
        <div :class="[toggled ? 'min-w-[420px]' : 'max-w-[36px]', show === 'code' ? 'w-1/2' : 'w-1/3 max-w-[560px]']" class="pb-20 h-full overflow-y-auto bg-gray-50 border-r">
          <div v-if="toggled" class="px-8 py-6">
            <!-- Tabs -->
            <div class="flex mb-6">
              <div class="p-1 border border-gray-300 bg-white rounded-lg flex space-x-1">
                  <button @click="show = 'prompt'" :class="show === 'prompt' ? 'bg-violet-100 text-violet-500' : ''" class="px-3 py-2 rounded-md flex items-center space-x-1">
                    <span class="text-sm">Instructions</span>
                  </button>
                  <button @click="show = 'recommendation'" :class="show === 'recommendation' ? 'bg-violet-100 text-violet-500' : ''" class="px-3 py-2 rounded-md flex items-center space-x-1">
                    <span class="text-sm">Analysis</span>
                  </button>
                  <button @click="show = 'chat'" :class="show === 'chat' ? 'bg-violet-100 text-violet-500' : ''" class="px-3 py-2 rounded-md flex items-center space-x-1">
                    <span class="text-sm">Chat</span>
                  </button>
                  <button @click="show = 'code'" :class="show === 'code' ? 'bg-violet-100 text-violet-500' : ''" class="px-3 py-2 rounded-md flex items-center space-x-1">
                    <span class="text-sm">Code</span>
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

                  <div v-if="recommendationStore.recommendation.metadata.comparisons?.length" class="flex items-center gap-2">
                    <CheckCircleIcon class="h-7 w-7 text-green-600"/>
                  </div>
                </div>
                <div v-if="accordionStates.accordion1" class="p-4 bg-gray-50 border-t transition-all duration-300 ease-in-out">
                  <div class="space-y-4">
                    <p class="text-gray-600">MetriFi AI compares your webpage with higher-converting pages to find opportunities to increase your conversion rate.</p>

                    <div v-if="recommendationStore.recommendation.metadata.comparisons?.length">
                      <p class="font-semibold mb-2">Higher-converting comparisons</p>
                      <ul class="border divide-y bg-white rounded-md">
                        <li v-for="comparison in recommendationStore.recommendation.metadata.comparisons" class="flex items-center justify-between py-3 px-4">
                          <!-- <p v-if="comparison.funnel"><span class="font-semibold">{{ comparison.funnel}}</span> funnel, step <span class="font-semibold">{{ comparison.name }}</span></p> -->
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
                      <ul class="border border-dashed divide-y bg-white rounded-md">
                        <li class="py-3 px-4">
                          <p class="text-gray-500">No higher-converting comparisons</p>
                        </li>
                      </ul>
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
                  <CheckCircleIcon v-if="recommendationStore.recommendation.prompt && recommendationStore.recommendation.prompt !== '<p></p>' || recommendationStore.recommendation.files.length" class="h-7 w-7 text-green-600"/>
                </div>

                <div v-if="accordionStates.accordion2" class="p-4 bg-gray-50 border-t transition-all duration-300 ease-in-out">
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
                  <CheckCircleIcon v-if="recommendationStore.recommendation.secret_shopper_prompt && recommendationStore.recommendation.secret_shopper_prompt !== '<p></p>' || recommendationStore.recommendation.secret_shopper_files.length" class="h-7 w-7 text-green-600"/>
                </div>

                <div v-if="accordionStates.accordion3" class="p-4 bg-gray-50 border-t transition-all duration-300 ease-in-out">
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
            <div v-if="show === 'recommendation'" class="border border-gray-300 bg-white rounded-lg p-4">
              <AppRichtext v-if="recommendationStore.recommendation.content" v-model="recommendationStore.recommendation.content" class="mb-2"/>
              <p v-else>Awaiting analysis...</p>
            </div>

            <!-- Chat -->
            <div v-if="show === 'chat'">
              
            </div>

            <!-- Code -->
            <div v-if="show === 'code'" class="h-[100vh] overflow-y-auto flex flex-col">
              <CodeEditor 
                v-if="recommendationStore.recommendation.prototype" 
                v-model="recommendationStore.recommendation.prototype" 
                @update:modelValue="updatePrototype"
              />
              <p v-else>Awaiting prototype code...</p>
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
          <div v-if="recommendationStore.recommendation.status != 'done'" class="p-6">
            <div class="flex items-center justify-center mb-6">
              <div class="w-12 h-12 border-2 border-violet-300 rounded-full border-t-transparent spin"/>
            </div>
            <p class="text-xl text-center text-gray-700 mb-6">{{ currentStep.text }}</p>
            <div class="w-96 m-auto relative h-2 bg-gray-200 rounded">
              <div :style="{ width: progressWidth, transition: 'width 0.5s ease' }" class="absolute top-0 left-0 h-full bg-gradient-to-r from-violet-600 to-violet-300 rounded"/>
            </div>
          </div>

          <div v-if="recommendationStore.recommendation.prototype">
            <p class="text-xl font-semibold mb-4">Prototype</p>
            <p>Clicked element: {{ clickedElement }}</p>
            <Prototype 
              :html="recommendationStore.recommendation.prototype"
              @element-clicked="handleElementClick"
            />
            <!-- <div v-html="recommendationStore.recommendation.prototype" class="relative overflow-hidden rounded-xl shadow"></div> -->
          </div>

          <!-- <p v-else>The complete HTML was not generated</p> -->
        </div>
      </div>
    </div>

    <GenerateRecommendationModal :stepIndex="recommendationStepIndex" :prompt="recommendationPrompt" :secret-shopper-prompt="recommendationSecretShopperPrompt" :open="isGenerateRecommendationModalOpen"/>
    <RecommendationsListPanel/>
  </div>
</template>

<script setup>
import moment from "moment"
import debounce from 'lodash.debounce'
import { ref, reactive, watch, provide, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOrganizationSubscriptionStore } from '@/domain/organizations/store/useOrganizationSubscriptionStore'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { ArrowLeftIcon, ChevronLeftIcon, PlusIcon, MinusIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import AppRichtext from '@/app/components/base/forms/AppRichtext.vue'
import CodeEditor from '@/views/recommendations/components/CodeEditor.vue'
import Prototype from '@/views/recommendations/components/Prototype.vue'
import RecommendationsListPanel from '@/views/recommendations/components/RecommendationsListPanel.vue'
import GenerateRecommendationModal from '@/views/dashboards/modals/GenerateRecommendationModal.vue'

const router = useRouter()
const route = useRoute()

const organizationSubscriptionStore = useOrganizationSubscriptionStore()
const recommendationStore = useRecommendationStore()

const isLoading = ref(false)
const isRecommendationsListPanelOpen = ref(false)
const isGenerateRecommendationModalOpen = ref(false)
const recommendationStepIndex = ref(null)
const recommendationPrompt = ref('')
const recommendationSecretShopperPrompt = ref('')

// Tabs state
const hasShownAnalysisToUser = ref(false)
const toggled = ref(true)
const show = ref('prompt')

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

provide('isRecommendationsListPanelOpen', isRecommendationsListPanelOpen)
provide('isGenerateRecommendationModalOpen', isGenerateRecommendationModalOpen)

const clickedElement = ref('')
const handleElementClick = (htmlString) => {
  clickedElement.value = htmlString
}

const updatePrototype = debounce(() => {
  console.log('Updating prototype...')
  isLoading.value = true

  recommendationStore.update(route.params.organization, route.params.dashboard, route.params.recommendation, { 
    prototype: recommendationStore.recommendation.prototype 
  }).then(() => {
    setTimeout(() => isLoading.value = false, 800)
  })
}, 800)

const steps = [
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

function fetchRecommendation() {
  isLoading.value = true
  recommendationStore.show(route.params.organization, route.params.dashboard, route.params.recommendation)
    .then(response => {
      const recommendation = recommendationStore.recommendation
      setTimeout(() => isLoading.value = false, 800)
      
      if (hasShownAnalysisToUser.value === false && recommendation.content) {
        hasShownAnalysisToUser.value = true
        show.value = 'recommendation'
      }

      const currentStepIdx = steps.findIndex(step => step.status === recommendation.status)
      if (currentStepIdx !== -1) {
        currentStepIndex.value = currentStepIdx
        setTimeout(() => isLoading.value = false, 800)
      }

      if (recommendation.status === null || recommendation.status === 'queued') {
        return
      }
      
      if (recommendation.status === 'done') {
        clearInterval(interval)
        setTimeout(() => isLoading.value = false, 800)
      }

      if (['requires_action', 'cancelled', 'failed', 'expired'].some(status => recommendation.status.includes(status))) {
        clearInterval(interval)
        issue.value = recommendation.status
        setTimeout(() => isLoading.value = false, 800)
      }
    })
    .catch(error => {
      console.error('Error fetching recommendation status:', error)
    })
}

const tailwind = ref('tailwind')
let tailwindScript = null

onMounted(() => {
  fetchRecommendation()
  interval = setInterval(fetchRecommendation, 3000)

  tailwindScript = document.createElement('script')
  tailwindScript.src = 'https://cdn.tailwindcss.com'
  tailwind.value.appendChild(tailwindScript)

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