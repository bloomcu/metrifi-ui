<template>
    <div class="flex-1 flex text-sm font-bold">{{ name }}</div>
</template>

<script setup>
const props = defineProps({
  // index: {
  //   type: Number,
  // },
  name: {
    type: String,
  },
})
</script>