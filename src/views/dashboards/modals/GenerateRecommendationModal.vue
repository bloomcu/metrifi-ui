<template>
  <AppModal 
    size="6xl"
    @closed="isGenerateRecommendationModalOpen = false" 
    :open="isGenerateRecommendationModalOpen"
  >
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:truncate sm:text-2xl">Generate recommendation</h3>
    </div>

    <div class="space-y-4">
      <AppRichtext v-model="prompt" label="Prompt" :editable="true"/>

      <AppButton @click="generateRecommendation()">
        {{ prompt !== '' && prompt !== '<p></p>' ? 'Generate' : 'Generate without prompt' }}
      </AppButton>
    </div>

  </AppModal>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useFunnelStore } from '@/domain/funnels/store/useFunnelStore'
import AppRichtext from '@/app/components/base/forms/AppRichtext.vue'

const route = useRoute()
const router = useRouter()
const recommendationStore = useRecommendationStore()
const funnelStore = useFunnelStore()
const prompt = ref('')

const isGenerateRecommendationModalOpen = inject('isGenerateRecommendationModalOpen')
const recommendationStepIndex = inject('recommendationStepIndex')

function generateRecommendation() {
  let stepIndex = recommendationStepIndex.value
  
  let metadata = getMetadataForRecommendations(stepIndex)

  recommendationStore.store(route.params.organization, route.params.dashboard, {
    step_index: stepIndex,
    prompt: prompt.value,
    metadata: metadata,
  }).then(() => {
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
