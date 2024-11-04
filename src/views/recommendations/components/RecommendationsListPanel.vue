<template>
    <template v-if="isRecommendationsListPanelOpen">
        <div @click="isRecommendationsListPanelOpen = false" class="fixed inset-0 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-40"></div>

        <div class="fixed right-0 top-0 h-full overflow-y-auto w-96 p-6 transform rounded-l-3xl bg-white shadow-2xl ring-1 ring-gray-900/5">
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
                :class="{'bg-violet-100 border-violet-300 hover:bg-violet-200': recommendation.id == route.params.recommendation}"
                class="flex flex-col gap-2 border rounded-lg p-2 mb-3 cursor-pointer hover:bg-gray-100"
            >
                <div class="flex justify-between">
                    <div>
                        <p class="font-medium text-gray-900">{{ recommendation.title }}</p>
                        <p class="text-sm text-gray-700">For step {{ recommendation.step_index + 1 }}</p>
                    </div>
                    
                    <span v-if="recommendation.status == 'done'" class="text-green-600 text-sm">Done</span>
                    <span v-if="isInProgress(recommendation.status)" class="text-blue-600 text-sm">In progress</span>
                    <span v-if="isFailed(recommendation.status)" class="text-red-600 text-sm">Failed</span>
                </div>

                <div class="flex justify-between text-gray-500 text-sm">
                    <div class="flex items-center gap-1">
                        <ClockIcon class="h-3 w-3 text-gray-400" aria-hidden="true" />
                        <!-- <span>{{ moment(recommendation.created_at).fromNow() }}</span> -->
                        <span>{{ moment(recommendation.created_at).format('MMM DD, Y') }}</span>
                    </div>
                    
                    <div class="flex items-center gap-1">
                        <UserIcon class="h-3 w-3 text-gray-400" aria-hidden="true" />
                        <span>{{ recommendation.user.name }}</span>
                    </div>
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
import { UserIcon, ClockIcon } from '@heroicons/vue/16/solid'

const route = useRoute()
const router = useRouter()
const recommendationStore = useRecommendationStore()
const isRecommendationsListPanelOpen = inject('isRecommendationsListPanelOpen')

function isInProgress(status) {
  return status ? ['in_progress', '_completed', 'queued'].some(s => status.includes(s)) : false;
}

function isFailed(status) {
  return status ? ['requires_action', 'cancelled', 'failed', 'incomplete', 'expired'].some(s => status.includes(s)) : false;
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
  