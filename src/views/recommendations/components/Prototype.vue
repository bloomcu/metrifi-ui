<template>
  <div 
    ref="container" 
    v-html="html" 
    class="relative overflow-hidden rounded-md shadow-md border"
    @mouseover="handleHover"
    @mouseleave="clearHighlight"
    @click="handleClick"
  ></div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Define props
const props = defineProps({
  html: String
})

// Define emits
const emit = defineEmits(['element-clicked'])

// References
const container = ref(null)
const highlightedElement = ref(null)

// Hover handling
const handleHover = (event) => {
  clearHighlight() // Clear previous highlight
  
  const target = event.target
  if (target !== container.value) {
    // Add highlight styling
    target.classList.add('highlight-element')
    highlightedElement.value = target
  }
}

const clearHighlight = () => {
  if (highlightedElement.value) {
    highlightedElement.value.classList.remove('highlight-element')
    highlightedElement.value = null
  }
}

// Click handling
const handleClick = (event) => {
  const target = event.target
  if (target !== container.value) {
    // Get the outer HTML of the clicked element
    const elementHtml = target.outerHTML
    emit('element-clicked', elementHtml)
  }
}

// Add CSS styles
onMounted(() => {
  const style = document.createElement('style')
  style.textContent = `
    .highlight-element {
      background-color: rgba(237, 234, 255, 1);
      outline: 2px solid rgba(139, 92, 246, 1) !important;
      transition: all 0.4s ease;
      cursor: pointer;
    }
  `
  document.head.appendChild(style)
})
</script>