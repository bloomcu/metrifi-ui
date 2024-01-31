<template>
  <!-- <div :style="`height: ${height}%;`" class="bg-indigo-600 flex-1 rounded-lg" /> -->
  <div :style="`transform: scaleY(${height});`" class="bg-indigo-600 flex-1 h-full origin-bottom transition duration-300"/>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // index: {
  //   type: Number,
  // },
  // height: {
  //   type: Number,
  // },
  value: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
  },
  zoom: '',
  // max: {
  //   type: Number,
  // },
})

const height = computed(() => {
  if (props.value === props.max) return 1
  if (props.zoom > 0) return props.value / props.max * props.zoom
  return props.value / props.max
})
</script>

<!-- <style lang="scss">
div {
  transform: scaleY(v-bind(height));
}
</style> -->