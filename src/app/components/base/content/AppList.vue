<template>
  <ul role="list" class="mt-8 space-y-3 text-sm leading-6 text-gray-600">
    <li v-for="item in list" :key="item.content" class="flex gap-x-3">
      <CheckIcon class="h-6 w-5 flex-none text-violet-500" aria-hidden="true" />
      {{ item.content }}
    </li>
  </ul>
</template>

<script setup>
import { CheckIcon } from '@heroicons/vue/20/solid'

const props = defineProps({
  list: { 
    type: Array,
    required: true
  },
})
</script>