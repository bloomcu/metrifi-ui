<template>
  <AppModal 
    size="5xl"
    @closed="isGenerateRecommendationModalOpen = false" 
    :open="isGenerateRecommendationModalOpen"
  >
    <div class="mb-6 max-w-4xl">
      <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-3 sm:truncate sm:text-2xl">Generate recommendation for step {{ stepIndex + 1 }}</h3>
      <p class="text-gray-500">Analyze your web page, compare it to top-performing comparisons, and get insights to optimize design, copy, and interactivity for higher conversions and a better user experience.</p>
    </div>

    <!-- Accordion 1 - UI analysis -->
    <div class="mb-4 border rounded-lg shadow-lg">
      <div class="flex items-center justify-between p-4 bg-white cursor-pointer" @click="toggleAccordion('accordion1')">
        <div class="flex gap-2">
          <MinusIcon v-if="accordionStates.accordion1" class="h-6 w-6 text-gray-600"/>
          <PlusIcon v-else class="h-6 w-6 text-gray-600"/>
          <h2 class="font-medium">UI analysis</h2>
        </div>

        <!-- <AppTooltipWrapper> -->
          <CheckCircleIcon class="h-7 w-7 text-green-600"/>
          <!-- <AppTooltip text="Enabled" alignment="center" variant="success" /> -->
        <!-- </AppTooltipWrapper> -->
      </div>
      <div v-if="accordionStates.accordion1" class="p-4 bg-gray-100 border-t transition-all duration-300 ease-in-out">
        <p>The latest UI analysis will be used as context for the recommendation.</p>
      </div>
    </div>

    <!-- Accordion 2 - Competitors -->
    <div class="mb-4 border rounded-lg overflow-hidden shadow-lg">
      <div class="flex items-center justify-between p-4 bg-white cursor-pointer" @click="toggleAccordion('accordion2')">
        <div class="flex gap-2">
          <MinusIcon v-if="accordionStates.accordion2" class="h-6 w-6 text-gray-600"/>
          <PlusIcon v-else class="h-6 w-6 text-gray-600"/>
          <h2 class="font-medium">Competitors</h2>
        </div>

        <CheckCircleIcon v-if="hasCompetitors" class="h-7 w-7 text-green-600"/>
      </div>
      <div v-if="accordionStates.accordion2" class="p-4 bg-gray-100 border-t transition-all duration-300 ease-in-out">
        <div class="space-y-4">
          <AppInput v-model="competitors[0]" label="Competitor URL" placeholder="https://example.com"/>
          <AppInput v-model="competitors[1]" label="Competitor URL" placeholder="https://example.com"/>
          <AppInput v-model="competitors[2]" label="Competitor URL" placeholder="https://example.com"/>
        </div>
      </div>
    </div>

    <!-- Accordion 3 - Additional information -->
    <div class="mb-6 border rounded-lg overflow-hidden shadow-lg">
      <div class="flex items-center justify-between p-4 bg-white cursor-pointer" @click="toggleAccordion('accordion3')">
        <div class="flex gap-2">
          <MinusIcon v-if="accordionStates.accordion3" class="h-6 w-6 text-gray-600"/>
          <PlusIcon v-else class="h-6 w-6 text-gray-600"/>
          <h2 class="font-medium">Additional information</h2>
        </div>

        <CheckCircleIcon v-if="hasCompetitors" class="h-7 w-7 text-green-600"/>
      </div>
      <div v-if="accordionStates.accordion3" class="p-4 bg-gray-100 border-t transition-all duration-300 ease-in-out">
        <div class="space-y-4">
          <p>This information will be provided as context for the recommendation.</p>
          <!-- <label class="inline-block text-md font-medium leading-6 text-gray-900">Additional information</label> -->
          <AppRichtext v-model="localPrompt" :editable="true" editorClasses="max-h-[50vh] overflow-y-scroll"/>
        </div>
      </div>
    </div>

    <AppButton @click="generateRecommendation()">Generate recommendation</AppButton>
  </AppModal>
</template>

<script setup>
import { ref, reactive, computed, inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { PlusIcon, MinusIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useFunnelStore } from '@/domain/funnels/store/useFunnelStore'
import AppRichtext from '@/app/components/base/forms/AppRichtext.vue'
import AppTooltip from '@/app/components/base/tooltips/AppTooltip.vue'
import AppTooltipWrapper from '@/app/components/base/tooltips/AppTooltipWrapper.vue'

const props = defineProps({
  stepIndex: '',
  prompt: '',
})

const route = useRoute()
const router = useRouter()
const recommendationStore = useRecommendationStore()
const funnelStore = useFunnelStore()

const accordionStates = reactive({
  accordion1: false,
  accordion2: false,
  accordion3: false,
});

const competitors = ref(['', '', ''])
const hasCompetitors = computed(() => competitors.value.some(competitor => competitor))

const toggleAccordion = (accordionName) => {
  if (accordionStates.hasOwnProperty(accordionName)) {
    accordionStates[accordionName] = !accordionStates[accordionName];
  }
};

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
      .then(() => {
          window.location.reload()
      })
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
