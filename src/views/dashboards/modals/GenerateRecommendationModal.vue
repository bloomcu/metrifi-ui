<template>
  <AppModal 
    size="6xl"
    @closed="isGenerateRecommendationModalOpen = false" 
    :open="isGenerateRecommendationModalOpen"
  >
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">
        Generate recommendation for step {{ stepIndex + 1 }}
      </h3>
    </div>

    <div class="space-y-4">
      <AppRichtext v-model="localPrompt" label="Prompt" :editable="true"/>

      <AppButton @click="generateRecommendation()">
        {{ localPrompt !== '' && localPrompt !== '<p></p>' ? 'Generate' : 'Generate without prompt' }}
      </AppButton>
    </div>

  </AppModal>
</template>

<script setup>
import { ref, inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useFunnelStore } from '@/domain/funnels/store/useFunnelStore'
import AppRichtext from '@/app/components/base/forms/AppRichtext.vue'

const props = defineProps({
  stepIndex: '',
  prompt: '',
})

const route = useRoute()
const router = useRouter()
const recommendationStore = useRecommendationStore()
const funnelStore = useFunnelStore()

const localPrompt = ref(props.prompt)

const isGenerateRecommendationModalOpen = inject('isGenerateRecommendationModalOpen')
// const recommendationStepIndex = inject('recommendationStepIndex')

// Watch the prop value and update the ref whenever it changes
watch(() => props.prompt, (newValue) => {
  localPrompt.value = newValue;
});

async function generateRecommendation() {
  let metadata = {}

  // If we're on a recommendation page, use the metadata from the recommendation
  if (route.params.recommendation) {
    await recommendationStore.show(route.params.organization, route.params.dashboard, route.params.recommendation)
      .then(response => {
        metadata = recommendationStore.recommendation.metadata
        console.log('We are regenerating an existing recommendation.', metadata)
      })
      
  } else {
    metadata = getMetadataForRecommendations(props.stepIndex)
    console.log('We are generating a new recommendation.', metadata)
  }

  recommendationStore.store(route.params.organization, route.params.dashboard, {
    step_index: props.stepIndex,
    prompt: localPrompt.value,
    metadata: metadata,
  }).then(() => {
    isGenerateRecommendationModalOpen.value = false
    router.push({ name: 'recommendation', params: { organization: route.params.organization, dashboard: route.params.dashboard, recommendation: recommendationStore.recommendation.id } })
  })
}

function getMetadataForRecommendations(stepIndex) {
  let index = Number(stepIndex)

  let focusName = funnelStore.funnels[0].report.steps[index].name
  let focusDomain = funnelStore.funnels[0].organization.domain
  let focusUrl = focusDomain + funnelStore.funnels[0].report.steps[index].metrics[0].pagePath
  let conversion = funnelStore.funnels[0].report.steps[index + 1].conversionRate

  let focus = {
    name: focusName,
    domain: focusDomain,
    url: focusUrl,
    conversion: conversion,
  }

  let comparisons = funnelStore.funnels
    .filter((funnel, i) => i !== 0)
    .map((funnel) => {
      let name = funnel.report.steps[index].name
      let domain = funnel.organization.domain
      let url = domain + funnel.report.steps[index].metrics[0].pagePath
      let conversion = funnel.report.steps[index + 1].conversionRate
      
      return {
        name: name,
        domain: domain,
        url: url,
        conversion: conversion,
      };
    });

  // Sort the comparisons by the step conversion rate
  comparisons.sort((a, b) => b.conversion - a.conversion)

  // Get the top three comparisons
  comparisons = comparisons.slice(0, 3)

  return {
    focus: focus,
    comparisons: comparisons,
  }
}
</script>
