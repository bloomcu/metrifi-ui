<template>
    <!-- Overall conversion rate -->
    <p v-if="analysis.subject_funnel_performance <= 0" class="mb-3">
        <span class="font-semibold">Conversion rate:</span>
        {{ Number(analysis.subject_funnel_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        % lower than the median of the comparisons
    </p>
    <p v-else class="mb-3">
        <span class="font-semibold">Conversion rate:</span>
        {{ Number(analysis.subject_funnel_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
        % higher than the median of the comparisons.

        <!-- Funnel is better, but there is still a bofi -->
        <span v-if="analysis.bofi_performance >= 0">Compare with higher performing funnels. Or, if you funnel is optimized, drive more traffic to it.</span>
    </p>

    <!-- Biggest opportunity -->
    <p v-if="analysis.bofi_performance <= 0" class="mb-3">
        <span class="font-semibold">Biggest opportunity:</span>
        Step {{ analysis.bofi_step_index + 1 }} of your funnel is {{ Number(analysis.bofi_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% {{ analysis.bofi_performance <= 0 ? 'lower' : 'higher' }} than the median of the comparisons
    </p>
    <!-- <p v-if="analysis.bofi_performance <= 0" class="mb-3">
        <span class="font-semibold">Biggest opportunity:</span>
        Step {{ analysis.bofi_step_index + 1 }} of your funnel is {{ Number(analysis.bofi_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% {{ analysis.bofi_performance <= 0 ? 'lower' : 'higher' }} than the median of the comparisons
    </p> -->

    <!-- Potential assets -->
    <p class="mb-4">
        <span class="font-semibold">Potential assets: </span>
        <span v-if="!analysis.subject_funnel_conversion_value">Assets not configured at time of last analysis</span>
        <span v-else>+{{ Number(analysis.bofi_asset_change).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }} every {{ analysis.period }} if you get Step {{ analysis.bofi_step_index + 1 }} on par with the median of the comparisons</span>
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
  