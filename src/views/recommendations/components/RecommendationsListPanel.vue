<template>
    <template v-if="isRecommendationsListPanelOpen">
        <!-- <div @click="toggleTray()" class="fixed inset-0 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-20"></div> -->

        <div class="fixed right-0 top-0 h-full overflow-y-auto w-96 p-6 transform rounded-r-3xl bg-white shadow-2xl ring-1 ring-gray-900/5">
            <!-- Tray header -->
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-medium">Recommendations</h3>
                <svg @click="isRecommendationsListPanelOpen = false" class="w-6 h-6 mr-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>

            <!-- Recommendations -->
            <div 
                v-for="recommendation in recommendationStore.recommendations" 
                @click="showRecommendation(recommendation.id)"
                :class="{'bg-indigo-100 border-indigo-300 hover:bg-indigo-200': recommendation.id == route.params.recommendation}"
                class="border rounded-md p-2 mb-2 cursor-pointer hover:bg-gray-100"
            >
                <div class="flex justify-between">
                    <p class="font-medium text-gray-900">{{ recommendation.title }}</p>
                    <span v-if="recommendation.status == 'done'" class="text-green-600 text-sm">Done</span>
                    <span v-if="isInProgress(recommendation.status)" class="text-blue-600 text-sm">In progress</span>
                    <span v-if="isFailed(recommendation.status)" class="text-red-600 text-sm">Failed</span>
                </div>

                <div class="flex justify-between text-gray-500 text-sm">
                    <p>{{ moment(recommendation.created_at).fromNow() }}</p>
                    <span>{{ moment(recommendation.created_at).format('MMM DD, Y') }}</span>
                </div>
                
            </div>
        </div>
    </template>
</template>

<script setup>
import moment from "moment"
import { inject, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'

const route = useRoute()
const router = useRouter()
const recommendationStore = useRecommendationStore()
const isRecommendationsListPanelOpen = inject('isRecommendationsListPanelOpen')

function isInProgress(status) {
  return ['in_progress', 'queued'].some(s => status.includes(s))
}

function isFailed(status) {
  return ['requires_action', 'cancelled', 'failed', 'incomplete', 'expired'].some(s => status.includes(s))
}

function showRecommendation(recommendationId) {
    router.push({name: 'recommendation', params:{ organization: route.params.organization, dashboard: route.params.dashboard, recommendation: recommendationId }})
        .then(() => {
            window.location.reload()
        })
}

onMounted(() => {
    recommendationStore.index(route.params.organization, route.params.dashboard)
})
</script>
  