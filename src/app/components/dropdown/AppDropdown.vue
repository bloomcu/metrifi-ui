<template>
    <div class="relative" @click="toggle">
        <button class="flex items-center justify-between w-full cursor-pointer rounded-md px-2 py-2 bg-white shadow-sm hover:bg-gray-50 border-0 ring-1 ring-gray-300 sm:leading-6 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none">
            <slot name="title">{{ title }}</slot>
        </button>

        <div v-show="isOpen" class="absolute inline-block right-0 z-50 mt-2 p-1 rounded-md bg-white border-0 text-gray-900 shadow-md ring-1 ring-gray-300">
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
</script>