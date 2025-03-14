<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="relative">
      <div 
        v-for="(block, index) in recommendationStore.recommendation?.latest_page?.blocks || []" 
        :key="index"
        class="relative group"
        @click="selectBlock(block)"
      >
        <div 
          v-if="block.html" 
          v-html="block.html" 
          :class="[
            'border-2 border-transparent group-hover:border-blue-500 cursor-pointer',
            recommendationStore.selectedBlock === block ? 'border-2 border-blue-700' : ''
          ]"
        ></div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { ref } from 'vue'

const recommendationStore = useRecommendationStore()
const tooltipPosition = ref({ x: 0, y: 0 })

const updateTooltipPosition = (event) => {
  tooltipPosition.value = {
    x: event.clientX + 10,
    y: event.clientY + 10
  }
}

const selectBlock = (block) => {
  recommendationStore.selectedBlock = block
}
</script>