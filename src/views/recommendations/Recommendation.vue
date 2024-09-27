<template>
  <div>
    <div ref="tailwind"/>

    <!-- Header -->
    <header class="px-4 py-3 flex items-center justify-between border-b">
      <div class="flex items-center gap-3 grow">
        <AppButton @click="router.push({name: 'dashboard'})" variant="primary" size="base">
          <ArrowLeftIcon class="h-4 w-4 shrink-0" />
        </AppButton>
        <p v-if="recommendationStore.recommendation" class="text-base font-semibold leading-6 text-gray-900">{{ recommendationStore.recommendation.title }} recommendation</p>
        <span v-if="recommendationStore.recommendation" class="text-gray-400 text-sm font-normal">Created {{ moment(recommendationStore.recommendation.created_at).fromNow() }}</span>
      </div>

      <div class="flex items-center gap-3">
        <p v-if="isLoading" class="text-xs text-gray-400">Loading...</p>

        <AppButton v-if="recommendationStore.recommendation && recommendationStore.recommendation.status === 'done'" @click="generateRecommendation()" variant="tertiary" size="base">
          Regenerate recommendation
        </AppButton>
      </div>
    </header>

    <div v-if="issue" class="flex flex-col items-center justify-center min-h-screen">
      <div class="p-6 text-center text-gray-700">
        <p class="text-xl mb-4"><span class="font-bold">Issue:</span> {{ issue }}</p>
        <p class="mb-8">The assistant was not able to complete it's job.</p>
        <AppButton @click="generateRecommendation()" variant="primary" size="base">
          Regenerate recommendation
        </AppButton>
      </div>
    </div>
    
    <div v-if="recommendationStore.recommendation" class="min-h-screen flex flex-col">
      <!-- Container -->
      <div class="flex flex-grow">
        <!-- Left Side (Collapsible) -->
        <div id="left-panel" :class="toggled ? 'w-1/3' : ''" class="bg-white min-w-[36px] max-w-[520px]">
          <div v-if="toggled" class="p-8">
            <!-- <div v-html="recommendationStore.recommendation.content" class="prose prose-h2:mb-2 prose-h3:mb-1.5 prose-p:my-1 py-2 px-4"></div> -->
            <AppRichtext v-model="recommendationStore.recommendation.content" class="mb-2"/>
          </div>
        </div>

        <!-- Divider with Toggle Button -->
        <div v-if="recommendationStore.recommendation.content" class="w-0.5 relative flex items-center">
          <button @click="toggled = !toggled" :class="toggled ? '' : 'rotate-180'" class="absolute -right-4 top-8 transform -translate-y-1/2 flex items-center justify-center border bg-white text-gray-400 w-8 h-8 rounded-full">
            <ChevronLeftIcon class="h-5 w-5 shrink-0 -ml-[3px]" />
          </button>
        </div>

        <!-- Right Side (2/3 of the screen) -->
        <div class="flex-1 overflow-y-auto px-12 pt-5 pb-24 bg-gray-100">
          <!-- Loading content -->
          <div v-if="recommendationStore.recommendation.status != 'done'" class="p-6">
            <div class="flex items-center justify-center mb-6">
              <div class="w-12 h-12 border-2 border-indigo-300 rounded-full border-t-transparent spin"/>
            </div>
            <p class="text-xl text-center text-gray-700 mb-6">{{ currentStep.text }}</p>
            <div class="w-96 m-auto relative h-2 bg-gray-200 rounded">
              <div :style="{ width: progressWidth, transition: 'width 0.5s ease' }" class="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-indigo-300 rounded"/>
            </div>
          </div>

          <div v-if="recommendationStore.recommendation.prototype">
            <p class="text-xl font-semibold mb-4">Prototype</p>
            <Prototype :html="recommendationStore.recommendation.prototype"/>
            <!-- <div v-html="recommendationStore.recommendation.prototype" class="relative overflow-hidden rounded-xl shadow"></div> -->
          </div>

          <!-- <p v-else>The complete HTML was not generated</p> -->
        </div>
      </div>
    </div>

    <!-- <div v-else class="flex flex-col items-center justify-center min-h-screen">
      <div class="w-96 p-6">
        <div class="flex items-center justify-center mb-10">
          <div class="w-24 h-24 border-2 border-indigo-300 rounded-full border-t-transparent spin"/>
        </div>

        <p class="text-xl text-center text-gray-700 mb-10">{{ currentStep.text }}</p>

        <div class="relative h-2 bg-gray-200 rounded">
          <div :style="{ width: progressWidth, transition: 'width 0.5s ease' }" class="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-indigo-300 rounded"/>
        </div>
      </div>
    </div> -->

    <!-- <div v-else class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div class="w-64 p-6 bg-white rounded-lg shadow-lg">
        <div class="flex items-center gap-2 mb-10">
          <div class="w-5 h-5 border-2 border-indigo-500 rounded-full border-t-transparent spin"/>
          <p class="text-center text-gray-700">{{ currentStep.text }}</p>
        </div>

        <div class="relative h-2 bg-gray-200 rounded">
          <div :style="{ width: progressWidth, transition: 'width 0.5s ease' }" class="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-600 to-indigo-300 rounded"/>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import moment from "moment"
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { ArrowLeftIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid'
import AppRichtext from '@/app/components/base/forms/AppRichtext.vue'
import Prototype from '@/views/recommendations/components/Prototype.vue'

const router = useRouter()
const route = useRoute()

const recommendationStore = useRecommendationStore()
const isLoading = ref(false)
const toggled = ref(false)

const steps = [
  { status: 'screenshot_grabber_in_progress', text: 'Taking screenshots', completed: false },
  { status: 'ui_analyzer_in_progress', text: 'Analyzing UI', completed: false },
  { status: 'confidentiality_rule_qa_in_progress', text: 'Reviewing analysis', completed: false },
  { status: 'content_writer_in_progress', text: 'Writing new content', completed: false },
  { status: 'section_counter_in_progress', text: 'Counting sections', completed: false },
  // { status: 'section_categorizer_in_progress', text: 'Categorizing sections', completed: false },
  // { status: 'component_picker_in_progress', text: 'Picking webpage components', completed: false },
  { status: 'page_builder_in_progress', text: 'Building component', completed: false },
  { status: 'page_builder_completed', text: 'Queuing next component', completed: false },
  { status: 'done', text: 'All done', completed: false },
]

function generateRecommendation() {
  recommendationStore.store(route.params.organization, route.params.dashboard, {
    title: 'Webpage recommendation',
  }).then(() => {
    // Go back to the dashboard view and add url param ?generate-recommendation=true
    router.push({ 
      name: 'dashboard', 
      params: { organization: route.params.organization, dashboard: route.params.dashboard }, 
      query: { 'recommendation-step': recommendationStore.recommendation.step_index } })

    // router.push({ name: 'dashboard', params: { organization: route.params.organization, dashboard: route.params.dashboard }, query: { 'generate-recommendation': true } }).then(() => {
    //   window.location.reload()
    // })

    // router.push({ name: 'recommendation', params: { organization: route.params.organization, dashboard: route.params.dashboard, recommendation: recommendationStore.recommendation.id } }).then(() => {
    //   window.location.reload()
    // })
  })
}

let interval = null
const issue = ref(null)
const currentStepIndex = ref(0)
const currentStep = computed(() => steps[currentStepIndex.value])

const progressWidth = computed(() => {
  return `${((currentStepIndex.value + 1) / steps.length) * 100}%`
})

function fetchRecommendation() {
  isLoading.value = true;

  recommendationStore.show(route.params.organization, route.params.dashboard, route.params.recommendation)
    .then(response => {
      const recommendation = recommendationStore.recommendation;
      setTimeout(() => isLoading.value = false, 800)
      
      if (recommendation.content) {
        toggled.value = true;
      } 

      // Update the current step based on the recommendation status
      const currentStepIdx = steps.findIndex(step => step.status === recommendation.status);
      if (currentStepIdx !== -1) {
        currentStepIndex.value = currentStepIdx;
        setTimeout(() => isLoading.value = false, 800) // move into store
      }
      
      // Stop polling if the recommendation process is completed
      if (recommendation.status === 'done') {
        clearInterval(interval);
        setTimeout(() => isLoading.value = false, 800)
      }

      // Stop polling if the recommendation process is completed
      if (['requires_action', 'cancelled', 'failed', 'expired'].some(status => recommendation.status.includes(status))) {
        clearInterval(interval);
        issue.value = recommendation.status;
        setTimeout(() => isLoading.value = false, 800)
      }
    })
    .catch(error => {
      console.error('Error fetching recommendation status:', error);
    });
}

const tailwind = ref('tailwind')
let tailwindScript = null

onMounted(() => {
  // Initial fetch for recommendation status
  fetchRecommendation()

  // Poll recommendation status every 3 seconds
  interval = setInterval(fetchRecommendation, 3000)

  // Load Tailwind play css
  tailwindScript = document.createElement('script')
  tailwindScript.src = 'https://cdn.tailwindcss.com'
  tailwind.value.appendChild(tailwindScript)
})

onUnmounted(() => {
  // Clear loader interval
  if (interval) {
    clearInterval(interval)
  }

  // Unload Tailwind play css
  // if (tailwindScript && tailwindScript.parentNode) {
  //   document.head.removeChild(tailwindScript)
  // }
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