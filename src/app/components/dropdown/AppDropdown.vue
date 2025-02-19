<template>
    <div ref="dropdown" class="relative">
        <button @click.stop="toggle" class="flex items-center justify-between w-full cursor-pointer rounded-full px-3 py-1 bg-white hover:bg-gray-50 border-0 ring-1 ring-gray-300 sm:leading-6 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
            <slot name="title">{{ title }}</slot>
        </button>

        <div 
            v-show="isOpen" 
            class="absolute right-0 z-50 flex flex-col mt-2 p-1 rounded-md bg-white border-0 text-gray-900 shadow-md ring-1 ring-gray-300 whitespace-nowrap min-w-max"
        >
            <slot />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, provide } from 'vue';

const props = defineProps({
  title: {
    type: String,
  },
})

const isOpen = ref(false);
const dropdown = ref(null);

const toggle = async () => {
    isOpen.value = !isOpen.value;
};

const handleClickOutside = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

provide("isOpen", isOpen);
</script>