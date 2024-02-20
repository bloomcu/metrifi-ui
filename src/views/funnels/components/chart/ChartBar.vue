<template>
  <!-- <div :style="`height: ${height}%;`" class="bg-indigo-600 flex-1 rounded-lg" /> -->
  <div :style="`transform: scaleY(${height});`" class="bg-indigo-600 flex-1 h-full origin-bottom transition duration-300"/>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: 0,
  max: 0,
  zoom: 0,
})

const height = computed(() => {
  if (props.value == 0) {
    return 0
  } 

  // Set the height to the value divided by the max
  let h = props.value / props.max
  
  // If the zoom is greater than 0, set the height to the value divided by the max, then multiply by the zoom
  if (props.zoom > 0) {
    h = props.value / props.max * props.zoom
  }

  // If the value is greater than 1, set it to 1
  if (h > 1 || props.value === props.max) {
    h = 1
  }

  return h
})
</script>

<!-- <style lang="scss">
div {
  transform: scaleY(v-bind(height));
}
</style> -->