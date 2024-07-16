<template>
  <div @click="emit('stepSelected')" class="flex flex-1 h-full items-end p-1.5 rounded-lg transition-colors duration-200 hover:bg-gray-200/60">
    <div 
      :style="`height: ${height}%;`"
      :class="updating ? 'animate-pulse' : ''"
      class="flex-1 rounded-lg transition duration-300 bg-gradient-to-b from-indigo-600 to-indigo-700" 
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: 0,
  max: 0,
  zoom: 0,
  updating: false,
})

const emit = defineEmits(['stepSelected'])

const height = computed(() => {
  let value = props.value
  let max = props.max
  let zoom = props.zoom
  
  if (value == 0) {
    return 0
  } 

  // Set the height to the value divided by the max
  let h = value / max
  
  // If the zoom is greater than 0, set the height to the value divided by the max, then multiply by the zoom
  if (zoom > 0) {
    h = value / max * zoom
  }

  // If the value is greater than 1, set it to 1
  if (h > 1 || value === max) {
    h = 1
  }

  return h * 100
})
</script>

<!-- <style lang="scss">
div {
  transform: scaleY(v-bind(height));
}
</style> -->