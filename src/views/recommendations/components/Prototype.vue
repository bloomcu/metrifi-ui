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

// Add a reference to track the currently selected element
const selectedElement = ref(null)

const handleHover = (event) => {
  clearHighlight()
  
  const target = event.target
  if (target !== container.value) {
    target.classList.add('highlight-element')
    highlightedElement.value = target
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
    // Remove selected styling from previously selected element
    if (selectedElement.value) {
      selectedElement.value.classList.remove('highlight-element')
    }

    // Set new selected element
    const elementHtml = target.outerHTML
    const tag = target.tagName.toLowerCase()
    
    recommendationStore.addClickedElement({
      html: elementHtml,
      tag: tag
    })

    // Update selected element reference
    selectedElement.value = target
    
    // Ensure the selected element stays highlighted
    target.classList.add('highlight-element')
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