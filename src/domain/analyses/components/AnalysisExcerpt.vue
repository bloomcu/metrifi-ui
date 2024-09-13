<template>
    <div>
        <!-- 
        Step opportunity 
        -->
        <!-- There's an opportunity in your steps -->
        <p v-if="analysis.bofi_performance < 0" class="mb-3">
            <span class="font-semibold">Step opportunity:</span>
            Step {{ analysis.bofi_step_index + 1 }} is converting {{ Number(analysis.bofi_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% 
            {{ analysis.bofi_performance <= 0 ? 'lower' : 'higher' }} than the comparisons 
            ({{ Number(analysis.bofi_conversion_rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% vs {{ Number(analysis.bofi_median_of_comparisons).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%)
        </p>

        <!-- There is not an opportunity in your steps -->
        <p v-else-if="analysis.bofi_performance > 0" class="mb-3">
            <span class="font-semibold">Step opportunity:</span>
            All your funnel steps are better than the comparisons. Compare with higher-performing funnels.
        </p>

        <!-- All funnels are performing the same -->
        <p v-else-if="analysis.bofi_performance == 0" class="mb-3">
            <span class="font-semibold">Step opportunity:</span>
            All of your funnel steps are on par with the comparisons. Compare with higher-performing funnels.
        </p>    

        <!-- 
        Overall conversion rate 
        -->
        <!-- Conversion rate is higher or lower than comparisons -->
        <p v-if="analysis.subject_funnel_performance != 0" class="mb-3">
            <span class="font-semibold">Conversion rate:</span>
            {{ Number(analysis.subject_funnel_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% 
            {{ analysis.subject_funnel_performance <= 0 ? 'lower' : 'higher' }} than the comparisons
            ({{ Number(analysis.subject_funnel_conversion_rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% vs {{ Number(analysis.median_of_comparison_conversion_rates).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%)
        </p>
        
        <!-- Subject funnel conversion rate is equal to the comparisons -->
        <p v-else-if="analysis.subject_funnel_performance == 0" class="mb-3">
            <span class="font-semibold">Conversion rate:</span>
            Equal to the comparisons ({{ Number(analysis.subject_funnel_conversion_rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%)
        </p>

        <!-- 
        Users 
        -->
        <p class="mb-3">
            <span class="font-semibold">Users:</span>
            {{ analysis.subject_funnel_users ? analysis.subject_funnel_users.toLocaleString() : 0 }}
        </p>

        <!-- 
        Potential assets 
        -->
        <!-- Assets not configured on the funnel -->
        <p v-if="!analysis.subject_funnel_conversion_value" class="mb-4">
            <span class="font-semibold">Potential assets: </span>
            <span>Assets not configured at time of last analysis</span>
        </p>

        <!-- There's an opportunity in your steps -->
        <p v-else-if="analysis.bofi_performance < 0" class="mb-4">
            <span class="font-semibold">Potential assets: </span>
            <span>{{ Number(analysis.bofi_asset_change).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }} every {{ analysis.period }} if you get Step {{ analysis.bofi_step_index + 1 }} on par with the comparisons ({{ Number(analysis.bofi_median_of_comparisons).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%)</span>
        </p>

        <!-- Funnel is better on all steps, so the asset change would be negative, thus not applicable -->
        <p v-else-if="analysis.bofi_performance > 0" class="mb-4">
            <span class="font-semibold">Potential assets: </span>
            <span>Since all your funnel steps are better than the comparisons, we can't calculate potential assets.</span>
        </p>

        <!-- There is not an opportunity in your steps -->
        <p v-else-if="analysis.bofi_performance == 0" class="mb-4">
            <span class="font-semibold">Potential assets: </span>
            <span>Since all your funnel steps are on par with the comparisons, we can't calculate potential assets.</span>
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
  