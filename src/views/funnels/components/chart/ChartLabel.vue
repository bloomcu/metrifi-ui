<template>
    <div class="flex-1 flex text-sm font-bold">{{ formattedName }}</div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
  },
})

const formattedName = computed(() => {
  let name = props.name

  // If the name is longer than 18 characters, slice it and add "..."
  if (name.length > 18) name = '...' + name.slice(-18)

  return name
})
</script>