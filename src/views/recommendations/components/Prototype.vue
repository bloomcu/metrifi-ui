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
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'

const props = defineProps({
  html: String
})

const recommendationStore = useRecommendationStore()
const container = ref(null)
const highlightedElement = ref(null)
const selectedElement = ref(null)

// Helper function to find the topmost selectable parent (div or section)
const findTopmostParent = (element) => {
  let currentElement = element
  let lastValidParent = null
  
  while (currentElement && currentElement !== container.value) {
    const tagName = currentElement.tagName.toLowerCase()
    // Check if it's a top-level div or section
    if ((tagName === 'div' && currentElement.parentElement === container.value) || 
        tagName === 'section') {
      return currentElement
    }
    if (tagName === 'div' || tagName === 'section') {
      lastValidParent = currentElement
    }
    currentElement = currentElement.parentElement
  }
  
  // If we found a valid parent (section) but not at the top level, return it
  return lastValidParent
}

const handleHover = (event) => {
  clearHighlight()
  
  const target = event.target
  if (target !== container.value) {
    const topmostParent = findTopmostParent(target)
    if (topmostParent) {
      topmostParent.classList.add('highlight-element')
      highlightedElement.value = topmostParent
    }
  }
}

const clearHighlight = () => {
  if (highlightedElement.value && highlightedElement.value !== selectedElement.value) {
    highlightedElement.value.classList.remove('highlight-element')
    highlightedElement.value = null
  }
}

const handleClick = (event) => {
  const target = event.target
  if (target !== container.value) {
    const topmostParent = findTopmostParent(target)
    if (!topmostParent) return

    // Remove selected styling from previously selected element
    if (selectedElement.value) {
      selectedElement.value.classList.remove('highlight-element')
    }

    // Set new selected element
    const elementHtml = topmostParent.outerHTML
    const tag = topmostParent.tagName.toLowerCase()
    
    recommendationStore.addClickedElement({
      html: elementHtml,
      tag: tag
    })

    // Update selected element reference
    selectedElement.value = topmostParent
    
    // Ensure the selected element stays highlighted
    topmostParent.classList.add('highlight-element')
  }
}

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