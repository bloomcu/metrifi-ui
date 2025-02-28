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

// Get top-level divs and sections from the live DOM
const getTopLevelElements = () => {
  if (!container.value) return []
  return Array.from(container.value.children).filter(
    el => el.tagName.toLowerCase() === 'div' || el.tagName.toLowerCase() === 'section'
  )
}

// Helper function to find the topmost selectable parent (div or section) and its index
const findTopmostParentWithIndex = (element) => {
  let currentElement = element
  const topLevelElements = getTopLevelElements()

  while (currentElement && currentElement !== container.value) {
    const tagName = currentElement.tagName.toLowerCase()
    // Check if it's a top-level div or section
    if ((tagName === 'div' || tagName === 'section') && 
        currentElement.parentElement === container.value) {
      const index = topLevelElements.indexOf(currentElement)
      return { element: currentElement, index }
    }
    currentElement = currentElement.parentElement
  }

  return { element: null, index: -1 }
}

const handleHover = (event) => {
  clearHighlight()
  
  const target = event.target
  if (target !== container.value) {
    const { element } = findTopmostParentWithIndex(target)
    if (element) {
      element.classList.add('highlight-element')
      highlightedElement.value = element
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
    const { element, index } = findTopmostParentWithIndex(target)
    if (!element) return

    // Remove selected styling from previously selected element
    if (selectedElement.value) {
      selectedElement.value.classList.remove('highlight-element')
    }

    // Set new selected element with index
    const elementHtml = element.outerHTML
    const tag = element.tagName.toLowerCase()
    
    recommendationStore.addClickedElement({
      html: elementHtml,
      tag: tag,
      index: index
    })

    // Update selected element reference
    selectedElement.value = element
    
    // Ensure the selected element stays highlighted
    element.classList.add('highlight-element')
  }
}

onMounted(() => {
  const style = document.createElement('style')
  style.textContent = `
    .highlight-element {
      background-color: rgba(237, 234, 255, 1) !important;
      background-image: linear-gradient(rgba(237, 234, 255, 1), rgba(237, 234, 255, 1)) !important;
      outline: 1px solid rgba(139, 92, 246, 1) !important;
      transition: all 0.4s ease;
      cursor: pointer;
    }
  `
  document.head.appendChild(style)
})
</script>