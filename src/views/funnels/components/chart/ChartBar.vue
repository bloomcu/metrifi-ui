<template>
  <!-- <div :style="`height: ${height}%;`" class="bg-indigo-600 flex-1 rounded-lg" /> -->
  <div class="bg-indigo-600 flex-1 h-full origin-bottom transition duration-300" />
</template>

<script setup>
// import { computed } from 'vue'

const props = defineProps({
  // index: {
  //   type: Number,
  // },
  height: {
    type: Number,
  },
  // value: {
  //   type: Number,
  // },
  // max: {
  //   type: Number,
  // },
})

// const height = computed(() => {
//   if (props.index === 0) return 100
//   return props.value / props.max * 100
// })
</script>

<style lang="scss">
div {
  transform: scaleY(v-bind(height));
}
</style>