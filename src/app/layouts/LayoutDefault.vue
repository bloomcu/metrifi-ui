<template>
  <main :class="widthClasses[width]" class="mx-auto">
    <slot/>
  </main>
</template>

<script setup>
const props = defineProps({
  width: {
    type: String,
    default: 'base' // xs, sm, base, full
  }
})

const widthClasses = {
  xs: 'max-w-3xl',
  sm: 'max-w-5xl',
  base: 'max-w-7xl',
  lg: 'max-w-screen-2xl',
  full: 'max-w-full'
}
</script>