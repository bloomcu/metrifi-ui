<template>
  <span :class="`${sizeClasses[size]}`" class="inline-flex items-center justify-center rounded-full bg-gray-500">
    <img v-if="image" :src="image" :class="`${sizeClasses[size]}`" class="inline-block h-6 w-6 rounded-full" alt="User avatar" :title="name">
    <span v-else class="font-medium leading-none text-white">{{ createInitials(name) }}</span>
  </span>
</template>

<script setup>
const props = defineProps({
  name: { 
    type: String,
  },
  image: { 
    type: String,
  },
  size: {
    type: String,
    default: 'md',
  },
})

const sizeClasses = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-14 w-14',
}

function createInitials(name) {
  const names = name.split(' ')
  let initials = names[0].substring(0, 1).toUpperCase()
  
  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase()
  }
  return initials
}
</script>