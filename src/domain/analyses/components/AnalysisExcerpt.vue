<template>
    <p class="mb-3">
        <span class="font-semibold">Conversion rate:</span>
        {{ analysis.subject_funnel_performance }}% {{ analysis.subject_funnel_performance <= 0 ? 'lower' : 'higher' }} than comparisons
    </p>
    <p class="mb-3">
        <span class="font-semibold">Biggest opportunity:</span>
        Step {{ analysis.bofi_step_index + 1 }} of your funnel is {{ analysis.bofi_performance }}% {{ analysis.bofi_performance <= 0 ? 'lower' : 'higher' }} than comparisons
    </p>
    <p class="mb-4">
        <span class="font-semibold">Potential assets:</span>
        +{{ Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(analysis.bofi_asset_change) }} every {{ analysis.period }} if you get Step {{ analysis.bofi_step_index + 1 }} on par with comparisons
        </p>
</template>
  
<script setup>
const props = defineProps({
  analysis: {
    type: Object,
  },
})
</script>
  