<template>
    <div class="flex-1 flex text-sm font-bold">
      <p class="line-clamp-3">{{ name }}</p>
    </div>
</template>

<script setup>
const props = defineProps({
  name: String,
})
</script>