<template>
  <div
    contenteditable 
    spellcheck="false" 
    @keydown.enter="handleKeydownEnter($event)"
    @blur="handleBlur($event)"
    class="group flex items-center gap-2 w-fit cursor-text rounded-md border-0 -ml-1.5 px-1.5 py-1.5 hover:ring-2 focus:ring-2 placeholder:text-gray-400 hover:ring-violet-600 focus:ring-violet-600 focus:outline-violet-600"
    ref="element"
  >
    <slot/>
    <PencilIcon class="h-3 w-3 shrink-0 text-violet-500"/>
  </div>
</template>

<script setup>
import { PencilIcon } from '@heroicons/vue/24/solid'
import { onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { 
    type: [String, Number],
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])
const element = ref(null)

function handleBlur(event) {
  emit('update:modelValue', event.target.innerText)
}

function handleKeydownEnter(event) {
  event.target.blur()
}

// onMounted(() => {
//   if (element.value && props.modelValue) {
//     element.value.innerText = props.modelValue
//   }
// })

// watch(() => props.modelValue, (newValue) => {
//   if (element.value && newValue !== element.value.innerText) {
//     element.value.innerText = newValue
//   }
// })
</script>