<template>
  <template v-if="recommendationStore.isPushToWordPressPanelOpen">
    <div @click="recommendationStore.isPushToWordPressPanelOpen = false" 
         class="fixed inset-0 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-40"></div>

    <div class="fixed right-0 top-0 h-full overflow-y-auto w-[60em] p-6 transform rounded-l-3xl bg-white shadow-2xl ring-1 ring-gray-900/5 z-50">
      <!-- Tray header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-base text-gray-400">Push to WordPress</h2>
        <svg @click="recommendationStore.isPushToWordPressPanelOpen = false" 
             class="w-6 h-6 mr-2 cursor-pointer" 
             fill="none" 
             viewBox="0 0 24 24" 
             stroke-width="1.5" 
             stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </div>

      <!-- Step content -->
      <PushToWordPressPanelStep1 v-if="currentStep === 1" />
      <PushToWordPressPanelStep2 v-if="currentStep === 2" />
      <PushToWordPressPanelStep3 v-if="currentStep === 3" />

      <!-- Step navigation -->
      <div class="mt-6 flex justify-between border-t pt-6">
        <AppButton v-if="currentStep > 1" @click="goToPreviousStep" variant="link">
          Previous step
        </AppButton>
        <AppButton v-if="currentStep < 3" @click="goToNextStep" variant="link" class="ml-auto">
          Next step
        </AppButton>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import PushToWordPressPanelStep1 from '@/views/recommendations/components/PushToWordPressPanelStep1.vue'
import PushToWordPressPanelStep2 from '@/views/recommendations/components/PushToWordPressPanelStep2.vue'
import PushToWordPressPanelStep3 from '@/views/recommendations/components/PushToWordPressPanelStep3.vue'

const recommendationStore = useRecommendationStore()
const currentStep = ref(1)

const goToNextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++
  }
}

const goToPreviousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// Reset step to 1 when panel is closed
watch(() => recommendationStore.isPushToWordPressPanelOpen, (newValue) => {
  if (!newValue) {
    currentStep.value = 1
  }
})
</script>