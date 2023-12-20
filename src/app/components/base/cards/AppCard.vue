<template>
  <div :class="`${baseClasses} ${paddingClasses[padding]}`">
    <slot/>
  </div>
</template>

<script setup>
const props = defineProps({
  padding: {
    type: String,
    default: 'sm' // none, sm, md, lg
  },
})

const baseClasses = 'bg-white shadow-sm ring-1 ring-gray-200 rounded-xl overflow-hidden'

const paddingClasses = {
  none: '',
  sm: 'p-4 sm:p-6',
  md: 'p-6 sm:p-8',
}
</script>