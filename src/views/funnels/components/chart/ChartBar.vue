<template>
    <div class="bg-indigo-600 flex-1 h-full origin-bottom transition duration-300" />
</template>

<script setup>
const props = defineProps({
  height: {
    type: Number,
  },
})
</script>

<style lang="scss">
// --height: v-bind(height);
div {
    transform: scaleY(v-bind(height));
}
</style>