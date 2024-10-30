<template>
  <span :class="[variants[variant], alignments[alignment]]" class="pointer-events-none absolute -bottom-8 w-max rounded px-2 py-1 text-sm font-medium opacity-0 shadow transition-opacity group-hover/tooltip:opacity-100 z-10">
    {{ text }}
  </span>
</template>

<script setup>
const props = defineProps({
  text: {
    type: String,
    default: 'The tooltip content'
  },
  alignment: {
    type: String,
    default: 'left'
  },
  variant: {
    type: String,
    default: 'primary'
  }
})

const alignments = {
  left: 'left-0',
  center: 'left-1/2 transform -translate-x-1/2',
  right: 'right-0'
}

const variants = {
  primary: 'bg-violet-600 text-white',
  success: 'bg-green-600 text-white',
  danger: 'bg-red-700 text-white',
  warning: 'bg-yellow-700 text-gray-50',
  info: 'bg-blue-700 text-white',
}
</script>