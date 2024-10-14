<template>
  <AppModal 
    size="full"
    @closed="isGenerateRecommendationModalOpen = false" 
    :open="isGenerateRecommendationModalOpen"
  >
    <!-- Sticky Top Bar -->
    <div class="fixed top-0 left-0 w-full bg-white border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-2">
        <AppButton @click="isGenerateRecommendationModalOpen = false" variant="tertiary" size="base">
          <ArrowLeftIcon class="h-5 w-5 shrink-0" />
        </AppButton>

        <AppButton @click="generateRecommendation()" class="whitespace-nowrap">
          Generate recommendation
        </AppButton>
      </div>
    </div>

    <div class="max-w-4xl mx-auto pt-16 pb-28">
      <div class="max-w-2xl mt-6 mb-10">
        <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-3 sm:text-2xl">
          Generate recommendation for step {{ stepIndex + 1 }}
        </h3>

        <p class="text-gray-600">
          Analyze your web page, compare it to top-performing comparisons, and get insights to optimize design, copy, and
          interactivity for higher conversions and a better user experience.
        </p>
      </div>

      <!-- Accordion 1 - UI analysis -->
      <div class="mb-4 border border-gray-300 rounded-lg overflow-hidden">
        <div class="flex items-center justify-between h-14 px-4 bg-white cursor-pointer" @click="toggleAccordion('accordion1')">
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
        <div v-if="accordionStates.accordion1" class="p-4 bg-gray-50 border-t transition-all duration-300 ease-in-out">
          <p class="text-gray-600">The latest UI analysis will be used as context for the recommendation.</p>
        </div>
      </div>

      <!-- Accordion 2 - Competitors -->
      <!-- <div class="mb-4 border border-gray-300 rounded-lg overflow-hidden">
        <div class="flex items-center justify-between h-14 px-4 bg-white cursor-pointer" @click="toggleAccordion('accordion2')">
          <div class="flex gap-2">
            <MinusIcon v-if="accordionStates.accordion2" class="h-6 w-6 text-gray-600"/>
            <PlusIcon v-else class="h-6 w-6 text-gray-600"/>
            <h2 class="font-medium">Competitors</h2>
          </div>

          <CheckCircleIcon v-if="hasCompetitors" class="h-7 w-7 text-green-600"/>
        </div>
        <div v-if="accordionStates.accordion2" class="p-4 bg-gray-50 border-t transition-all duration-300 ease-in-out">
          <div class="space-y-4">
            <AppInput v-model="competitors[0]" label="Competitor URL" placeholder="https://example.com"/>
            <AppInput v-model="competitors[1]" label="Competitor URL" placeholder="https://example.com"/>
            <AppInput v-model="competitors[2]" label="Competitor URL" placeholder="https://example.com"/>
          </div>
        </div>
      </div> -->

      <!-- Accordion 3 - Additional information -->
      <div class="mb-6 border border-gray-300 rounded-lg overflow-hidden">
        <div class="flex items-center justify-between h-14 px-4 bg-white cursor-pointer" @click="toggleAccordion('accordion3')">
          <div class="flex gap-2">
            <MinusIcon v-if="accordionStates.accordion3" class="h-6 w-6 text-gray-600"/>
            <PlusIcon v-else class="h-6 w-6 text-gray-600"/>
            <h2 class="font-medium">Additional information</h2>
          </div>

          <CheckCircleIcon v-if="localPrompt && localPrompt !== '<p></p>'" class="h-7 w-7 text-green-600"/>
        </div>
        <div v-if="accordionStates.accordion3" class="p-4 bg-gray-50 border-t transition-all duration-300 ease-in-out">
          <div class="space-y-4">
            <p class="text-gray-600">This information will be provided as context for the recommendation.</p>
            <AppRichtext v-model="localPrompt" :editable="true"/>

            <!-- Upload files -->
            <FileUploader @fileUploaded="handleFileUploaded" class="mb-5"/>

            <!-- Files -->
            <ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
              <li v-for="file in fileStore.files" :key="file.id" class="relative">
                <div @click="" class="group relative block cursor-pointer overflow-hidden rounded-lg bg-gray-100 border mb-2">
                  <!-- Thumbnail -->
                  <img :src="file.url" :alt="file.alt" width="400" class="select-none pointer-events-none shrink-0 w-full h-36 object-cover group-hover:opacity-75"/>

                  <!-- Select -->
                  <!-- <button class="absolute flex top-1 left-1 h-7 w-7 items-center justify-center text-gray-600 hover:text-gray-900">
                    <input :checked="selected.includes(file.id)" type="checkbox" class="h-4 w-4 cursor-pointer rounded border-gray-300 text-indigo-600 focus:ring-indigo-600">
                  </button> -->

                  <!-- Delete -->
                  <button @click.stop="fileStore.destroy(route.params.organization, file.id)" class="absolute hidden top-1 right-1 h-7 w-7 group-hover:flex items-center justify-center bg-white rounded-lg text-gray-600 hover:text-gray-900">
                    <TrashIcon class="h-4 w-4"/>
                  </button>
                </div>
                <p class="block truncate text-sm font-medium text-gray-900 mb-1">{{ file.title }}</p>
                <p class="block truncate text-sm text-gray-500">{{ file.filename }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </AppModal>
</template>

<script setup>
import { ref, reactive, computed, inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, TrashIcon, PlusIcon, MinusIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useFunnelStore } from '@/domain/funnels/store/useFunnelStore'
import { useFileStore } from '@/domain/files/store/useFileStore'
import AppRichtext from '@/app/components/base/forms/AppRichtext.vue'
import FileUploader from '@/domain/files/components/FileUploader.vue'

const props = defineProps({
  stepIndex: '',
  prompt: '',
})

const route = useRoute()
const router = useRouter()
const recommendationStore = useRecommendationStore()
const funnelStore = useFunnelStore()
const fileStore = useFileStore()

const accordionStates = reactive({
  accordion1: false,
  accordion2: false,
  accordion3: false,
});

const files = ref([])
const localPrompt = ref(props.prompt)
const isGenerateRecommendationModalOpen = inject('isGenerateRecommendationModalOpen')

// Watch the prop value and update the ref whenever it changes
watch(() => props.prompt, (newValue) => {
  localPrompt.value = newValue;
});

function handleFileUploaded(file) {
  files.value.push(file.id)
}

async function generateRecommendation() {
  let metadata = {}
  let file_ids = []

  // If we're on a recommendation page, use the metadata from the recommendation
  if (route.params.recommendation) {
    await recommendationStore.show(route.params.organization, route.params.dashboard, route.params.recommendation)
      .then(response => {
        // We're regenerating an existing recommendation
        metadata = recommendationStore.recommendation.metadata
        file_ids = recommendationStore.recommendation.file_ids
      })
      
  } else {
    // We're generating a new recommendation
    metadata = getMetadataForRecommendations(props.stepIndex)
  }

  // Store the recommendation
  recommendationStore.store(route.params.organization, route.params.dashboard, {
    // status: 'draft',
    step_index: props.stepIndex,
    prompt: localPrompt.value,
    metadata: metadata,
    file_ids: files.value,
  }).then(() => {
    // isGenerateRecommendationModalOpen.value = false
    // router.push({ name: 'recommendation', params: { organization: route.params.organization, dashboard: route.params.dashboard, recommendation: recommendationStore.recommendation.id } })
    //   .then(() => {
    //       window.location.reload()
    //   })
  })

  // Clear the prompt and files
  // localPrompt.value = ''
  // files.value = []
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

const toggleAccordion = (accordionName) => {
  if (accordionStates.hasOwnProperty(accordionName)) {
    accordionStates[accordionName] = !accordionStates[accordionName];
  }
};
</script>
