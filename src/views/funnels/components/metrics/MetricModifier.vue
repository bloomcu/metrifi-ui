<template>
    <div ref="content" class="relative" @click="open">
        <slot name="title">{{ title }}</slot>

        <div v-show="isOpen" class="absolute left-0 right-0 z-50 mt-2 w-full">
            <slot />
        </div>
    </div>
</template>

<script setup>
import { ref, provide } from 'vue';
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  title: {
    type: String,
  },
})

const isOpen = ref(false);
const content = ref(null)

const open = () => {
    isOpen.value = true
};

onClickOutside(content, () => {
  isOpen.value = false
})

provide("isOpen", isOpen);
</script>