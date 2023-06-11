<template>
  <div
    contenteditable 
    spellcheck="false" 
    @blur="handleBlur($event)"
    @keydown.enter="handleKeydownEnter($event)"
    class="cursor-text"
  >
    <slot/>
  </div>
</template>

<script setup>
const emit = defineEmits(['updated'])

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

function handleBlur(event) {
  emit('updated', props.id, event.target.innerText)
}

function handleKeydownEnter(event) {
  event.target.blur()
}
</script>