<template>
    <div class="h-screen flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="px-4 py-3 flex items-center justify-between border-b">
        <div v-if="recommendationStore.recommendation" class="flex items-center gap-3 grow">
            <!-- Back button -->
            <AppButton @click="handleBack()" variant="primary" size="base">
            <ArrowLeftIcon class="h-4 w-4 shrink-0" />
            </AppButton>

            <!-- Recommendation title -->
            <p class="text-base font-semibold leading-6 text-gray-900">{{ recommendationStore.recommendation.title }} recommendation</p>

            <!-- Step -->
            <p class="text-sm">For step {{ recommendationStore.recommendation.step_index + 1 }}</p>

            <!-- Created by -->
            <span class="text-gray-400 text-sm font-normal">Created {{ moment(recommendationStore.recommendation.created_at).fromNow() }} by {{ recommendationStore.recommendation.user.name }}</span>
        </div>

        <div class="flex items-center gap-2">
            <p v-if="isLoading" class="text-xs text-gray-400">Loading...</p>

            <AppButton v-if="recommendationStore.recommendation && recommendationStore.recommendation.status === 'done'" @click="toggleGenerateRecommendationModal()" variant="secondary" size="base">
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
    </div>  
</template>

<script setup>

</script>