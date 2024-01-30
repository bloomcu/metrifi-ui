<template>
    <div class="flex-1 flex justify-center text-sm">
      <span class="font-bold">{{ index + 1 }}. </span>{{ name }}
    </div>
</template>

<script setup>
const props = defineProps({
  index: {
    type: Number,
  },
  name: {
    type: String,
  },
})
</script>