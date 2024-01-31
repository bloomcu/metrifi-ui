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
    default: 0,
  },
  max: {
    default: 0,
  },
  zoom: '',
  // max: {
  //   type: Number,
  // },
})

const height = computed(() => {
  let h = props.value / props.max

  if (props.zoom > 0) {
    h = props.value / props.max * props.zoom
  }

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