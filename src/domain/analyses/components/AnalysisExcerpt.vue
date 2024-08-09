<template>
    <div v-if="analysis.in_progress" class="mb-3">
        <svg aria-hidden="true" role="status" class="inline w-4 h-4 mr-3 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
        </svg>
        Analysis in progress...
    </div>

    <div v-else>
        <!-- Biggest opportunity -->
        <p v-if="analysis.bofi_performance < 0" class="mb-3">
            <span class="font-semibold">Biggest opportunity:</span>
            Step {{ analysis.bofi_step_index + 1 }} of your funnel is {{ Number(analysis.bofi_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% 
            {{ analysis.bofi_performance <= 0 ? 'lower' : 'higher' }} than the average
        </p>
        <!-- Funnel is better on all steps, so the BOFI is to compare with higher performing funnels -->
        <p v-if="analysis.bofi_performance >= 0" class="mb-3">
            <span class="font-semibold">Biggest opportunity:</span>
            All your funnel steps are above average. Compare with higher-performing funnels or drive more traffic to your funnel.
        </p>

        <!-- Overall conversion rate -->
        <p v-if="analysis.subject_funnel_performance != 0" class="mb-3">
            <span class="font-semibold">Conversion rate:</span>
            {{ Number(analysis.subject_funnel_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% 
            {{ analysis.subject_funnel_performance <= 0 ? 'lower' : 'higher' }} than the average
        </p>
        <p v-else class="mb-3">
            <span class="font-semibold">Conversion rate:</span>
            Equal to the average ({{ Number(analysis.subject_funnel_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%)
        </p>

        <!-- Users -->
        <p class="mb-3">
            <span class="font-semibold">Users:</span>
            {{ analysis.subject_funnel_users ? analysis.subject_funnel_users.toLocaleString() : 0 }}
        </p>

        <!-- Potential assets -->
        <p v-if="!analysis.subject_funnel_conversion_value" class="mb-4">
            <span class="font-semibold">Potential assets: </span>
            <span>Assets not configured at time of last analysis</span>
        </p>
        <p v-else-if="analysis.bofi_asset_change > 0" class="mb-4">
            <span class="font-semibold">Potential assets: </span>
            <span>{{ Number(analysis.bofi_asset_change).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }} every {{ analysis.period }} if you get Step {{ analysis.bofi_step_index + 1 }} on par with the average ({{ Number(analysis.bofi_median_of_comparisons).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%)</span>
        </p>
        <p v-else class="mb-4">
            <span class="font-semibold">Potential assets: </span>
            <span>{{ Number(analysis.bofi_asset_change).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }}</span>
        </p>
    </div>
</template>
  
<script setup>
import { computed } from 'vue'

const props = defineProps({
  analysis: {
    type: Object,
  },
})
</script>
  