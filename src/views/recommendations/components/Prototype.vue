<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="_border _rounded-md shadow-lg">
      <!-- Content container with responsive width -->
      <div class="bg-white transition-all duration-300 flex justify-center"
        :style="{
          width: '100%',
          minHeight: '300px'
        }"
      >
        <!-- Content with responsive width -->
        <VueDraggableNext 
            :list="recommendationStore.recommendation?.latest_page?.blocks"
            :animation="150"
            @change="reorderBlock($event)"
            class="transition-all duration-300 w-full"
        >
          <PrototypeBlock
            v-for="(block, index) in recommendationStore.recommendation?.latest_page?.blocks || []" 
            :key="index"
            :block="block"
            :index="index"
            @poll-recommendation="$emit('poll-recommendation')"
            @fetch-recommendation="$emit('fetch-recommendation')"
          />
        </VueDraggableNext>
      </div>
    </div>
  </div>
</template>

<script setup>
import { VueDraggableNext } from 'vue-draggable-next'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useRoute } from 'vue-router'
import { blocksApi } from '@/domain/blocks/api/blocksApi'
import PrototypeBlock from '@/views/recommendations/components/PrototypeBlock.vue'

const route = useRoute()
const recommendationStore = useRecommendationStore()
const emit = defineEmits(['poll-recommendation', 'fetch-recommendation'])

const reorderBlock = async (e) => {
  let event = e.moved || e.added

  try {
    await blocksApi.reorder(route.params.organization, event.element.id, event.newIndex + 1)
  } catch (error) {
    console.error('Error reordering block:', error)
  }
}
</script>