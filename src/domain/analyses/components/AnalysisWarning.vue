<template>
    <p class="mb-3 flex items-center gap-1">
        <ExclamationTriangleIcon class="h-5 w-5 shrink-0 text-orange-600" />
        <span class="font-semibold text-orange-600">Warning:</span>
        {{ warning }}
    </p>
</template>
  
<script setup>
import { computed } from 'vue'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  warning: {
    type: String,
  },
})
</script>
  