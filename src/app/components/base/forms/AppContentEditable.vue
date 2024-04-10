<template>
  <div
    contenteditable 
    spellcheck="false" 
    @keydown.enter="handleKeydownEnter($event)"
    @blur="handleBlur($event)"
    class="group flex items-center gap-2 w-fit cursor-text rounded-md border-0 px-1.5 py-1.5 text-gray-900 hover:ring-2 focus:ring-2 placeholder:text-gray-400 hover:ring-indigo-600 focus:ring-indigo-600"
  >
    {{ modelValue }}
    <PencilIcon class="h-3 w-3 shrink-0 text-indigo-600 invisible group-hover:visible"/>
  </div>
</template>

<script setup>
import { PencilIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  modelValue: { 
    type: [String, Number]
  }
})

const emit = defineEmits(['update:modelValue'])

function handleBlur(event) {
  emit('update:modelValue', event.target.innerText)
}

function handleKeydownEnter(event) {
  event.target.blur()
}
</script>