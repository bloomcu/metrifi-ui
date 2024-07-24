<template>
    <div v-if="analysis.subject_funnel_performance <= 0">
        <p class="mb-3">
            <span class="font-semibold">Conversion rate:</span>
            {{ Number(analysis.subject_funnel_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% lower than comparisons
        </p>
        <p class="mb-3">
            <span class="font-semibold">Biggest opportunity:</span>
            Step {{ analysis.bofi_step_index + 1 }} of your funnel is {{ Number(analysis.bofi_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% {{ analysis.bofi_performance <= 0 ? 'lower' : 'higher' }} than comparisons
        </p>
        <p class="mb-4">
            <span class="font-semibold">Potential assets:</span>
            <!-- +{{ Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(analysis.bofi_asset_change) }} every {{ analysis.period }} if you get Step {{ analysis.bofi_step_index + 1 }} on par with comparisons -->
            +{{ Number(analysis.bofi_asset_change).toLocaleString('en-US', {style:'currency', currency:'USD', minimumFractionDigits: 0, maximumFractionDigits: 0}) }} every {{ analysis.period }} if you get Step {{ analysis.bofi_step_index + 1 }} on par with comparisons
        </p>
    </div>

    <div v-else>
        <p class="mb-3">
            <span class="font-semibold">Conversion rate:</span>
            {{ Number(analysis.subject_funnel_performance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}% higher than comparisons. Consider comparing it the highest performing funnels, or drive more traffic.
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
  