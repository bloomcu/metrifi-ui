<template>
    <div class="relative" @click="toggle">
        <button 
            :class="`${baseClasses} ${variantClasses} ${sizeClasses}`"
            class="flex items-center justify-between w-full cursor-pointer rounded-md px-3 py-2 text-sm active:translate-y-px disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none focus-visible:outline-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 text-gray-900 bg-white hover:bg-gray-50 ring-1 ring-inset ring-gray-300 shadow-sm"
        >
            <slot name="title">{{ title }}</slot>
        </button>

        <div v-show="isOpen" class="absolute left-0 right-0 z-50 mt-2 w-full p-1 rounded-md bg-white border-0 text-gray-900 shadow-md ring-1 ring-gray-300">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { ref, provide } from 'vue';

const props = defineProps({
  title: {
    type: String,
  },
})

const isOpen = ref(false);

const toggle = () => {
    isOpen.value = !isOpen.value;
};

provide("isOpen", isOpen);

const baseClasses = `
  cursor-pointer
  rounded-md
  active:translate-y-px
  disabled:pointer-events-none
  disabled:opacity-50
  disabled:shadow-none
  focus-visible:outline-indigo-700
  focus-visible:outline 
  focus-visible:outline-2 
  focus-visible:outline-offset-2
`

const variantClasses = `
    text-gray-900 
    bg-white 
    hover:bg-gray-50 
    ring-1 
    ring-inset 
    ring-gray-300 
    shadow-sm
`

const sizeClasses = `
    px-3 
    py-2 
    text-sm
`
</script>