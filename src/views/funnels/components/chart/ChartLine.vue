<template>
  <div class="flex items-center gap-2 h-0">
    <p class="text-sm text-gray-400">{{ percentage }}%</p>
    <div class="flex-1 border-t border-dashed border-gray-300" />
  </div>
</template>

<script setup>
const props = defineProps({
  percentage: {
    type: Number,
  },
})
</script>