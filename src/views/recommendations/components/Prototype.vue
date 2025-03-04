<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <div 
      ref="container" 
      v-html="html" 
      class="relative overflow-hidden rounded-md shadow-md border"
      @mouseover="handleHover"
      @mouseleave="clearHighlight"
      @click="handleClick"
    >
    </div>
  </div>
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

// Get top-level sections from the live DOM
const getTopLevelSections = () => {
  if (!container.value) return []
  return Array.from(container.value.children).filter(
    el => el.tagName.toLowerCase() === 'section' && el.id
  )
}

// Helper function to find the topmost section parent and its id
const findTopmostSection = (element) => {
  let currentElement = element
  const topLevelSections = getTopLevelSections()

  while (currentElement && currentElement !== container.value) {
    if (currentElement.tagName.toLowerCase() === 'section' && 
        currentElement.id && 
        currentElement.parentElement === container.value) {
      return { 
        element: currentElement, 
        id: currentElement.id 
      }
    }
    currentElement = currentElement.parentElement
  }

  return { element: null, id: null }
}

const handleHover = (event) => {
  clearHighlight()
  
  const target = event.target
  if (target !== container.value) {
    const { element } = findTopmostSection(target)
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
    const { element, id } = findTopmostSection(target)
    if (!element || !id) return

    // Remove selected styling from previously selected element
    if (selectedElement.value) {
      selectedElement.value.classList.remove('highlight-element')
    }

    // Set new selected element with id
    const elementHtml = element.outerHTML
    const tag = element.tagName.toLowerCase()
    
    recommendationStore.addClickedElement({
      html: elementHtml,
      tag: tag,
      id: id
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