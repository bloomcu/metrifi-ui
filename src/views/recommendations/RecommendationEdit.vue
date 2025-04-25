<template>
    <div v-if="recommendationStore.recommendation && organizationSubscriptionStore.subscription" class="h-screen flex flex-col overflow-auto">
        <!-- Sticky Top Bar -->
        <div class="z-20 fixed top-0 left-0 w-full bg-white border-b border-gray-200">
            <div class="px-4 py-2 flex items-center justify-between">
                <!-- Left side -->
                <div class="flex items-center gap-3 grow">
                    <!-- Back -->
                    <AppButton @click="handleBack()" variant="tertiary" size="sm">
                        <ArrowLeftIcon class="h-5 w-5 shrink-0" />
                    </AppButton>

                    <!-- Recommendation title -->
                    <p class="text-base font-semibold leading-6 text-gray-900">{{ recommendationStore.recommendation.title }}</p>

                    <!-- Created by -->
                    <span class="text-gray-400 text-sm font-normal">Created {{ moment(recommendationStore.recommendation.created_at).fromNow() }} by {{ recommendationStore.recommendation.user.name }}</span>
                </div>
                
                <!-- Right side -->
                <div class="flex items-center gap-2">
                    <p v-if="recommendationStore.isLoading" class="text-xs text-gray-400">Updating...</p>
                    
                    <AppButton v-if="!organizationSubscriptionStore.limitExceeded" :disabled="!canGenerateRecommendation" @click="handleGenerateRecommendation()" class="whitespace-nowrap">
                        Generate recommendation
                    </AppButton>
                </div>
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
        </div><!-- End quota exceeded -->

        <!-- Edit recommendation -->
        <div v-else class="max-w-4xl w-full mx-auto py-24">
            <span v-if="recommendationStore.recommendation.status == 'draft'" class="bg-slate-300 py-1 px-2.5 rounded-full text-[#2b0f52] text-sm">Draft</span>

            <!-- Recommendation title -->
            <div class="mt-8 mb-10">
                <p class="font-semibold mb-1">Title</p>
                <AppInlineEditor v-model="recommendationStore.recommendation.title" class="mb-3">
                    <h3 class="text-lg font-medium leading-7 text-gray-900 tracking-tight sm:text-2xl">
                        {{ recommendationStore.recommendation.title }}
                    </h3>
                </AppInlineEditor>
            </div>


            <!-- Additional information -->
            <div class="space-y-12">
                <!-- Instructions -->
                <div class="space-y-3">
                    <p class="font-semibold">Instructions</p>
                    <p class="text-gray-600">MetriFi AI will use the instructions below to generate a new webpage for you.</p>

                    <!-- Additional info -->
                    <AppRichtext v-model="recommendationStore.recommendation.prompt" :editable="true" placeholder="Write instructions..." class="bg-white"/>
                </div>
                
                <!-- Upload files -->
                <div class="space-y-3">
                    <p class="font-semibold mb-1">Files</p>
                    <FileUploader @fileUploaded="handleLocalFileUploaded" class="mb-5"/>

                    <!-- Files -->
                    <ul role="list" class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
                        <li v-for="file in recommendationStore.recommendation.files" :key="file.id" class="relative">
                            <div @click="" class="group relative block cursor-pointer overflow-hidden rounded-lg bg-gray-100 border mb-2">
                                <!-- Thumbnail -->
                                <img :src="file.url" :alt="file.alt" width="400" class="select-none pointer-events-none shrink-0 w-full h-36 object-cover group-hover:opacity-75"/>

                                <!-- Delete -->
                                <!-- <button @click.stop="handleDeleteLocalFile(file.id)" class="absolute hidden top-1 right-1 h-7 w-7 group-hover:flex items-center justify-center bg-white rounded-lg text-gray-600 hover:text-gray-900">
                                    <TrashIcon class="h-4 w-4"/>
                                </button> -->
                            </div>

                            <p class="block truncate text-sm font-medium text-gray-900 mb-1">{{ file.title }}</p>
                            <!-- <p class="block truncate text-sm text-gray-500">{{ file.filename }}</p> -->
                        </li>
                    </ul>
                </div>
            </div><!-- End additional information -->

            <!-- <div><pre>{{ recommendationStore.recommendation }}</pre></div> -->
        </div><!-- End edit recommendation -->

    </div><!-- End wrapper -->
</template>

<script setup>
import moment from "moment"
import { computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/domain/base/auth/store/useAuthStore'
import { useOrganizationSubscriptionStore } from '@/domain/organizations/store/useOrganizationSubscriptionStore'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { ArrowLeftIcon, TrashIcon, PlusIcon, MinusIcon, CheckCircleIcon } from '@heroicons/vue/24/solid'
import AppRichtext from '@/app/components/base/forms/AppRichtext.vue'
import FileUploader from '@/domain/files/components/FileUploader.vue'
import AppInlineEditor from '@/app/components/base/forms/AppInlineEditor.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const organizationSubscriptionStore = useOrganizationSubscriptionStore()
const recommendationStore = useRecommendationStore()

function handleLocalFileUploaded(file) {
    recommendationStore.recommendation.files.push(file)
    recommendationStore.attachFile(route.params.organization, recommendationStore.recommendation.id, [file.id], 'additional-information')
}

const handleGenerateRecommendation = () => {
    recommendationStore.generate(route.params.organization, recommendationStore.recommendation.id).then(() => {
        router.push({name: 'recommendation', params: {organization: route.params.organization, recommendation: recommendationStore.recommendation.id}})
    })
}

const handleBack = () => {
    if (recommendationStore.recommendation.dashboard_id) {
        router.push({name: 'dashboard', params: {organization: route.params.organization, dashboard: recommendationStore.recommendation.dashboard_id}})
    } else {
        router.push({ name: 'recommendations' })
    }
}

const canGenerateRecommendation = computed(() => {
  return (
    // Has additional information
    (recommendationStore.recommendation.prompt && recommendationStore.recommendation.prompt !== '<p></p>') ||
    recommendationStore.recommendation.files.length > 0
  );
});

// Debounce function
// TODO: Extract to composable
const debounce = (fn, delay) => {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}

// Debounced update function
// TODO: Extract to composable
const debouncedUpdate = debounce((org, rec, data) => {
  recommendationStore.update(org, rec, data)
}, 500)

// watch for updates to the recommendation
watch(() => recommendationStore.recommendation, (newValue, oldValue) => {
  // Skip the initial update when the component is mounted
  if (oldValue !== undefined) {
    debouncedUpdate(
      route.params.organization, 
      route.params.recommendation, 
      recommendationStore.recommendation
    )
  }
}, { deep: true })

onMounted(() => {
    recommendationStore.show(route.params.organization, route.params.recommendation)
    if (!organizationSubscriptionStore.subscription) organizationSubscriptionStore.show(route.params.organization)
})
</script>