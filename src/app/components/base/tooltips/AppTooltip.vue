<template>
  <span class="pointer-events-none absolute -bottom-8 left-0 w-max rounded bg-indigo-700 px-2 py-1 text-sm font-medium text-gray-50 opacity-0 shadow transition-opacity group-hover:opacity-100 z-10">
    {{ text }}
  </span>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: 'The tooltip content'
  },
})
</script>