<template>
  <AppModal 
    size="full"
    @closed="isGenerateRecommendationModalOpen = false" 
    :open="isGenerateRecommendationModalOpen"
  >
    <!-- Loading overlay -->
    <div v-if="showLoader" class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex flex-col items-center justify-center z-50 space-y-4">
      <div class="w-16 h-16 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
      <p class="text-white text-xl">Starting recommendation</p>
    </div>

    <!-- Sticky Top Bar -->
    <div class="z-20 fixed top-0 left-0 w-full bg-white border-b border-gray-200">
      <div class="flex items-center justify-between px-4 py-2">
        <AppButton @click="isGenerateRecommendationModalOpen = false" variant="tertiary" size="sm">
          <ArrowLeftIcon class="h-5 w-5 shrink-0" />
        </AppButton>

        <AppButton v-if="!organizationSubscriptionStore.limitExceeded || authStore.isAdmin" :disabled="!canGenerateRecommendation" @click="generateRecommendation()" class="whitespace-nowrap">
          Generate recommendation
        </AppButton>
      </div>
    </div>

    <!-- Quota exceeded -->
    <!-- TODO: Make this a component -->
    <div v-if="organizationSubscriptionStore.limitExceeded && !authStore.isAdmin" class="max-w-4xl mx-auto p-16 mt-24 bg-violet-50 border border-violet-200 rounded-xl">
        <div class="max-w-2xl">
            <div class="flex h-12 w-12 mb-4 flex-shrink-0 items-center justify-center rounded-full bg-white mx-0">
                <svg class="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
            </div>

            <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:text-2xl">Subscription limit reached</h3>
            <p class="text-gray-500 mb-6">You've reached the usage limit for your current plan.</p>

            <p class="mb-6">
                Your <span class="font-bold">{{ organizationSubscriptionStore.subscription.plan.title }} plan</span> allows for <span class="font-bold">{{ organizationSubscriptionStore.subscription.plan.limits.recommendations }} recommendations</span> per year. You've used all available recommendations for this billing cycle.
            </p>

            <div class="flex gap-2">
                <AppButton :to="{name: 'settingsBilling', params: {organization: route.params.slug}}">Upgrade plan</AppButton>
            </div>
        </div>
    </div>

    <div v-else class="max-w-4xl mx-auto pt-16 pb-28">
      <div class="max-w-2xl mt-6 mb-10">
        <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight mb-3 sm:text-2xl">
          Generate a recommendation for step {{ stepIndex + 1 }}
        </h3>

        <p class="text-gray-600">
          MetriFi AI will use the instructions below to generate a new webpage for you.
        </p>
      </div>

      <p class="font-semibold mb-3">Instructions</p>

      <!-- Accordion 1 - UI analysis -->
      <div class="mb-4 border border-gray-300 rounded-lg overflow-clip">
        <div class="flex items-center justify-between h-14 px-4 bg-white cursor-pointer" @click="toggleAccordion('accordion1')">
          <div class="flex items-center gap-2">
            <MinusIcon v-if="accordionStates.accordion1" class="h-6 w-6 text-gray-600"/>
            <PlusIcon v-else class="h-6 w-6 text-gray-600"/>
            <h2 class="font-medium">Compare to higher-converting pages</h2>
          </div>

          <div v-if="funnelsWithHigherPerformingComparisonStep.length" class="flex items-center gap-2">
            <span class="text-sm text-emerald-600">Included by default</span>
            <CheckCircleIcon class="h-7 w-7 text-emerald-600"/>
          </div>

          <div v-else class="flex items">
            <p class="text-sm text-gray-400">No higher-converting comparisons</p>
          </div>
        </div>
        <div v-if="accordionStates.accordion1" class="p-4 bg-gray-50 border-t transition-all duration-300 ease-in-out">
          <div class="space-y-6">
            <p class="text-gray-600">MetriFi AI compares your webpage with higher-converting pages to find opportunities to increase your conversion rate.</p>

            <!-- Get from from funnel reports via computed property -->
            <div v-if="funnelsWithHigherPerformingComparisonStep.length">
              <p class="font-semibold mb-2">Higher-converting comparisons</p>
              <p class="text-gray-600 mb-3">Up to three comparisons will be used.</p>

              <ul class="border divide-y bg-white rounded-md">
                <li v-for="(funnel, index) in funnelsWithHigherPerformingComparisonStep" :key="index" class="flex items-center justify-between py-3 px-4 gap-4">
                  <div>
                    <p class="text-gray-500">Funnel: {{ funnel.name }}</p>
                    <p>Step: <span class="font-semibold">{{ funnel.report.steps[stepIndex].name }}</span></p>
                  </div>

                  <div class="flex items-center gap-4">
                    <!-- Checkmark -->
                    <div v-if="index < 3" class="flex items-center gap-2 flex-none">
                      <span class="text-sm text-emerald-600">Included</span>
                      <CheckCircleIcon class="h-7 w-7 text-emerald-600" />
                    </div>

                    <!-- Conversion rate -->
                    <p class="text-right w-20">
                      {{ Number(funnel.report.steps[stepIndex + 1].conversionRate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%
                    </p>
                  </div>
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

            <!-- Show previously used comparisons from metadata -->
            <div v-if="recommendationStore.recommendation.metadata.comparisons">
              <p class="font-semibold mb-2">Previously used comparisons</p>
              <ul class="border divide-y bg-white rounded-md">
                <li v-for="comparison in recommendationStore.recommendation.metadata.comparisons" class="flex items-center justify-between py-3 px-4">
                  <div v-if="comparison.funnel">
                    <p class="text-gray-500">Funnel: {{ comparison.funnel}}</p>
                    <p>Step: <span class="font-semibold">{{ comparison.name }}</span></p>
                  </div>

                  <p v-else>Step: <span class="font-semibold">{{ comparison.name }}</span></p>
                  <p>{{ Number(comparison.conversion).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Accordion 2 - Competitors -->
      <!-- <div class="mb-4 border border-gray-300 rounded-lg overflow-clip">
        <div class="flex items-center justify-between h-14 px-4 bg-white cursor-pointer" @click="toggleAccordion('accordion2')">
          <div class="flex gap-2">
            <MinusIcon v-if="accordionStates.accordion2" class="h-6 w-6 text-gray-600"/>
            <PlusIcon v-else class="h-6 w-6 text-gray-600"/>
            <h2 class="font-medium">Competitors</h2>
          </div>

          <CheckCircleIcon v-if="hasCompetitors" class="h-7 w-7 text-emerald-600"/>
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
      <div class="mb-4 border border-gray-300 rounded-lg overflow-clip">
        <div class="flex items-center justify-between h-14 px-4 bg-white cursor-pointer" @click="toggleAccordion('accordion3')">
          <div class="flex gap-2">
            <MinusIcon v-if="accordionStates.accordion3" class="h-6 w-6 text-gray-600"/>
            <PlusIcon v-else class="h-6 w-6 text-gray-600"/>
            <h2 class="font-medium">Additional information</h2>
          </div>

          <CheckCircleIcon v-if="recommendationStore.recommendation.prompt && recommendationStore.recommendation.prompt !== '<p></p>' || recommendationStore.recommendation.files.length" class="h-7 w-7 text-emerald-600"/>
        </div>
        <div v-if="accordionStates.accordion3" class="p-4 bg-gray-50 border-t transition-all duration-300 ease-in-out">
          <div class="space-y-4">
            <p class="text-gray-600">Add more details for MetriFi AI to consider while generating the recommendation.</p>

            <!-- Instructions -->
            <p class="font-semibold mb-1">Instructions</p>
            <AppRichtext v-model="recommendationStore.recommendation.prompt" :editable="true" class="bg-white"/>

            <!-- Upload files -->
            <p class="font-semibold mb-1">Files</p>
            <FileUploader @fileUploaded="handleLocalFileUploaded" class="mb-5"/>

            <!-- Files -->
            <ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
              <li v-for="file in recommendationStore.recommendation.files" :key="file.id" class="relative">
                <div @click="" class="group relative block cursor-pointer overflow-hidden rounded-lg bg-gray-100 border mb-2">
                  <!-- Thumbnail -->
                  <img :src="file.url" :alt="file.alt" width="400" class="select-none pointer-events-none shrink-0 w-full h-36 object-cover group-hover:opacity-75"/>

                  <!-- Select -->
                  <!-- <button class="absolute flex top-1 left-1 h-7 w-7 items-center justify-center text-gray-600 hover:text-gray-900">
                    <input :checked="selected.includes(file.id)" type="checkbox" class="h-4 w-4 cursor-pointer rounded border-gray-300 text-violet-500 focus:ring-violet-600">
                  </button> -->

                  <!-- Delete -->
                  <button @click.stop="handleDeleteLocalFile(file.id)" class="absolute hidden top-1 right-1 h-7 w-7 group-hover:flex items-center justify-center bg-white rounded-lg text-gray-600 hover:text-gray-900">
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

      <!-- Accordion 4 - Secret shopper information -->
      <div class="mb-4 border border-gray-300 rounded-lg overflow-clip">
        <div class="flex items-center justify-between h-14 px-4 bg-white cursor-pointer" @click="toggleAccordion('accordion4')">
          <div class="flex gap-2">
            <MinusIcon v-if="accordionStates.accordion4" class="h-6 w-6 text-gray-600"/>
            <PlusIcon v-else class="h-6 w-6 text-gray-600"/>
            <h2 class="font-medium">Secret shopping study</h2>
          </div>

          <div class="flex gap-3">
            <a @click.stop href="https://metrifi.com/secret-shop-your-website/" target="_blank" class="px-2.5 py-1.5 text-sm text-violet-500 bg-violet-50 hover:bg-violet-100 font-medium rounded-full active:translate-y-px disabled:pointer-events-none disabled:opacity-50 disabled:shadow-nonefocus-visible:outline-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">Secret shop my website</a>
            <CheckCircleIcon v-if="recommendationStore.recommendation.secret_shopper_prompt && recommendationStore.recommendation.secret_shopper_prompt !== '<p></p>' || recommendationStore.recommendation.secret_shopper_files.length" class="h-7 w-7 text-emerald-600"/>
          </div>
        </div>
        <div v-if="accordionStates.accordion4" class="p-4 bg-gray-50 border-t transition-all duration-300 ease-in-out">
          <div class="space-y-4">
            <p class="text-gray-600 mb-2">Add insights from a secret shopping study for MetriFi AI to consider while generating the recommendation.</p>

            <!-- Instructions -->
            <p class="font-semibold mb-1">Details</p>
            <AppRichtext v-model="recommendationStore.recommendation.secret_shopper_prompt" :editable="true" class="bg-white"/>

            <!-- Upload files -->
            <p class="font-semibold mb-1">Files</p>
            <FileUploader @fileUploaded="handleSecretShopperFileUploaded" class="mb-5"/>

            <!-- Files -->
            <ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
              <li v-for="file in recommendationStore.recommendation.secret_shopper_files" :key="file.id" class="relative">
                <div @click="" class="group relative block cursor-pointer overflow-hidden rounded-lg bg-gray-100 border mb-2">
                  <img :src="file.url" :alt="file.alt" width="400" class="select-none pointer-events-none shrink-0 w-full h-36 object-cover group-hover:opacity-75"/>
                  <button @click.stop="handleDeleteSecretShopperFile(file.id)" class="absolute hidden top-1 right-1 h-7 w-7 group-hover:flex items-center justify-center bg-white rounded-lg text-gray-600 hover:text-gray-900">
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
import { ref, reactive, computed, onMounted, inject, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRouter } from 'vue-router'
import { ArrowLeftIcon, TrashIcon, PlusIcon, MinusIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import { useOrganizationSubscriptionStore } from '@/domain/organizations/store/useOrganizationSubscriptionStore'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useFunnelStore } from '@/domain/funnels/store/useFunnelStore'
import { useFileStore } from '@/domain/files/store/useFileStore'
import { dashboardApi } from '@/domain/dashboards/api/dashboardApi.js'
import AppRichtext from '@/app/components/base/forms/AppRichtext.vue'
import FileUploader from '@/domain/files/components/FileUploader.vue'

const props = defineProps({
  dashboardId: '',
  stepIndex: '',
  prompt: '',
  secretShopperPrompt: '',
})

const showLoader = ref(false)

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const organizationSubscriptionStore = useOrganizationSubscriptionStore()
const recommendationStore = useRecommendationStore()
const funnelStore = useFunnelStore()
const fileStore = useFileStore()

const accordionStates = reactive({
  accordion1: false,
  accordion2: false,
  accordion3: false,
  accordion4: false,
});

const isGenerateRecommendationModalOpen = inject('isGenerateRecommendationModalOpen')

// Watch the prop value and update the ref whenever it changes
watch(() => isGenerateRecommendationModalOpen.value, (modelOpen) => {
  if (modelOpen === true) {
    if (route.params.recommendation) {
      // Get the current recommendation
      recommendationStore.show(route.params.organization, route.params.recommendation)
      
    } else {
      // Start a new recommendation in the store
      recommendationStore.recommendation = {
        step_index: props.stepIndex,
        prompt: '',
        files: [],
        secret_shopper_prompt: '',
        secret_shopper_files: [],
        metadata: {},
      }
    }
  } else {
    if (route.params.recommendation) {
      recommendationStore.show(route.params.organization, route.params.recommendation)
    }
  }
});

function handleLocalFileUploaded(file) {
  recommendationStore.recommendation.files.push(file)
}

function handleSecretShopperFileUploaded(file) {
  recommendationStore.recommendation.secret_shopper_files.push(file)
}

function handleDeleteLocalFile(fileId) {
  recommendationStore.recommendation.files = recommendationStore.recommendation.files.filter(file => file.id !== fileId)
  
  if (!route.params.recommendation) {
    // We're not working with an existing recommendation, destroy the file
    fileStore.destroy(route.params.organization, fileId)
  }  
}

function handleDeleteSecretShopperFile(fileId) {
  recommendationStore.recommendation.secret_shopper_files = recommendationStore.recommendation.secret_shopper_files.filter(file => file.id !== fileId)
  
  if (!route.params.recommendation) {
    // We're not working with an existing recommendation, destroy the file
    fileStore.destroy(route.params.organization, fileId)
  }  
}

async function generateRecommendation() {
  // Show loader
  showLoader.value = true

  // We're creating a new recommendation, generate the metadata
  if (!route.params.recommendation) { 
    recommendationStore.recommendation.metadata = getMetadataForRecommendations(props.stepIndex)
  }

  // Cache file ids
  let fileIds = recommendationStore.recommendation?.files?.map(file => file.id)
  let secretShopperFileIds = recommendationStore.recommendation?.secret_shopper_files?.map(file => file.id)
  console.log('Cached fileIds', fileIds)
  console.log('Cached secretShopperFileIds', secretShopperFileIds)

  // Store recommendation
  // Set recommendation status to queued
  recommendationStore.recommendation.status = 'queued'
  await recommendationStore.store(route.params.organization, recommendationStore.recommendation).then(() => {
    // Attach files
    if (fileIds.length) {
      console.log('Attaching files', fileIds)
      recommendationStore.attachFile(route.params.organization, recommendationStore.recommendation.id, fileIds, 'additional-information')
    }

    if (secretShopperFileIds.length) {
      console.log('Attaching secret shopper files', secretShopperFileIds)
      recommendationStore.attachFile(route.params.organization, recommendationStore.recommendation.id, secretShopperFileIds, 'secret-shopper')
    }

    recommendationStore.generate(route.params.organization, recommendationStore.recommendation.id).then(() => {
        router.push({name: 'recommendation', params: {organization: route.params.organization, recommendation: recommendationStore.recommendation.id}})
    })
        
    setTimeout(() => {
        window.location.reload()
    }, 2000)
  })
}

// Compute the filtered funnels
const funnelsWithHigherPerformingComparisonStep = computed(() => {
  if (!funnelStore.funnels || funnelStore.funnels.length === 0) {
    return [];
  }

  // Get the conversion rate of the first funnel at the given step index
  const baseConversionRate =
    funnelStore.funnels[0]?.report?.steps[props.stepIndex + 1]?.conversionRate || 0;

  // Filter and sort funnels where the step's conversion rate is higher
  return funnelStore.funnels
    .filter((funnel, index) => {
      // Skip the first funnel
      if (index === 0) return false;

      const conversionRate =
        funnel?.report?.steps[props.stepIndex + 1]?.conversionRate || 0;
      return conversionRate > baseConversionRate;
    })
    .sort((a, b) => {
      const aRate = a?.report?.steps[props.stepIndex + 1]?.conversionRate || 0;
      const bRate = b?.report?.steps[props.stepIndex + 1]?.conversionRate || 0;

      // Sort in descending order
      return bRate - aRate;
    });
});


const canGenerateRecommendation = computed(() => {
  return (
    // Has comparisons
    funnelsWithHigherPerformingComparisonStep.value.length > 0 || // Via computed property
    // recommendationStore?.recommendation?.metadata.comparisons.length > 0 || // Via recommendation metadata

    // Or has additional information
    (recommendationStore.recommendation.prompt && recommendationStore.recommendation.prompt !== '<p></p>') ||
    recommendationStore.recommendation.files.length > 0 ||

    // Or has secret shopper information
    (recommendationStore.recommendation.secret_shopper_prompt && recommendationStore.recommendation.secret_shopper_prompt !== '<p></p>') ||
    recommendationStore.recommendation.secret_shopper_files.length > 0
  );
});

function getMetadataForRecommendations(stepIndex) {
  let index = Number(stepIndex)

  let focusName = funnelStore.funnels[0].report.steps[index].name
  let focusDomain = funnelStore.funnels[0].organization.domain
  let focusUrl = focusDomain + funnelStore.funnels[0].report.steps[index].metrics[0].pagePath
  let conversion = funnelStore.funnels[0].report.steps[index + 1]?.conversionRate

  let focus = {
    name: focusName,
    domain: focusDomain,
    url: focusUrl,
    conversion: conversion ?? null,
  }

  let comparisons = []

  if (funnelsWithHigherPerformingComparisonStep.value.length) {
    comparisons = funnelsWithHigherPerformingComparisonStep.value
      .map((funnel) => {
        let funnelName = funnel.name
        let name = funnel.report.steps[index].name
        let domain = funnel.organization.domain
        let url = domain + funnel.report.steps[index].metrics[0].pagePath
        let conversion = funnel.report.steps[index + 1].conversionRate
        
        return {
          funnel: funnelName,
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
  }

  return {
    focus: focus,
    comparisons: comparisons,
  }
}

function loadDashboard() {
  funnelStore.funnels = []
  
  dashboardApi.show(route.params.organization, props.dashboardId)
    .then(response => {
      // console.log(response)
      let dashboard = response.data.data

      dashboard.funnels.forEach(funnel => {
        funnelStore.addFunnel(funnel)
      })
    })
}

const toggleAccordion = (accordionName) => {
  if (accordionStates.hasOwnProperty(accordionName)) {
    accordionStates[accordionName] = !accordionStates[accordionName];
  }
};

onMounted(() => {
  if (route.params.recommendation && props.dashboardId) {
    loadDashboard()
  }
})
</script>
