<template>
    <!-- Overall conversion rate -->
    <p v-if="analysis.subject_funnel_performance != 0" class="mb-3">
        <span class="font-semibold">Conversion rate:</span>
        {{ Number(analysis.subject_funnel_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% 
        {{ analysis.subject_funnel_performance <= 0 ? 'lower' : 'higher' }} than the median of the comparisons
    </p>

    <!-- Biggest opportunity -->
    <p v-if="analysis.bofi_performance < 0" class="mb-3">
        <span class="font-semibold">Biggest opportunity:</span>
        Step {{ analysis.bofi_step_index + 1 }} of your funnel is {{ Number(analysis.bofi_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% 
        {{ analysis.bofi_performance <= 0 ? 'lower' : 'higher' }} than the median of the comparisons
    </p>
    <!-- Funnel is better on all steps, so the BOFI is to compare with higher performing funnels -->
    <p v-if="analysis.bofi_performance >= 0" class="mb-3">
        <span class="font-semibold">Biggest opportunity:</span>
        All your funnel steps are above average. Compare with higher-performing funnels or drive more traffic to your funnel.
    </p>

    <!-- Potential assets -->
    <p v-if="!analysis.subject_funnel_conversion_value" class="mb-4">
        <span class="font-semibold">Potential assets: </span>
        <span>Assets not configured at time of last analysis</span>
    </p>
    <p v-else-if="analysis.bofi_asset_change > 0" class="mb-4">
        <span class="font-semibold">Potential assets: </span>
        <span>{{ Number(analysis.bofi_asset_change).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }} every {{ analysis.period }} if you get Step {{ analysis.bofi_step_index + 1 }} on par with the median of the comparisons</span>
    </p>
</template>
  
<script setup>
import { computed } from 'vue'

const props = defineProps({
  analysis: {
    type: Object,
  },
})
</script>
  