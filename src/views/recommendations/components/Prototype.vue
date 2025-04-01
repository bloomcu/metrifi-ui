<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="_border _rounded-md shadow-lg overflow-hidden">
      <!-- Content container with responsive width -->
      <div class="bg-white overflow-auto transition-all duration-300 flex justify-center"
        :style="{
          width: '100%',
          minHeight: '300px'
        }"
      >
        <!-- Content with responsive width -->
        <div class="transition-all duration-300 w-full">
          <div 
            v-for="(block, index) in recommendationStore.recommendation?.latest_page?.blocks || []" 
            :key="index"
            class="relative group w-full block"
            @click="selectBlock(block)"
          >
            <div v-if="block.status === 'regenerating'" class="m-2 border rounded-md p-3 bg-gray-200 animate-pulse">
                <div class="flex items-center gap-1 text-violet-600">
                    <svg aria-hidden="true" role="status" class="position w-4 h-4 mr-2 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>
                    <span class="text-sm">Regenerating block</span>
                </div>
            </div>

            <div v-else-if="block.html" class="relative">
              <div v-if="recommendationStore.recommendation.status === 'done'">
                <button 
                  v-if="block.outline"
                  @click.stop="regenerateBlock(block)"
                  class="absolute top-2 right-2 bg-violet-600 hover:bg-violet-700 text-white px-3 py-1 rounded-md text-sm font-medium z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  Regenerate
                </button>

                <div v-else class="absolute top-2 right-2 bg-neutral-200 text-neutral-600 px-3 py-1 rounded-md text-sm font-medium z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Block must have an outline to be regenerated
                </div>
              </div>
              
              <div v-html="block.html" :class="recommendationStore.selectedBlock === block ? 'border-2 border-violet-700' : ''" class="border-2 border-transparent group-hover:border-violet-500 cursor-pointer"></div>
            </div>

            <div v-else class="m-2 border rounded-md p-3 bg-gray-100 animate-pulse">
                <div class="flex items-center gap-1 text-violet-600">
                    <svg aria-hidden="true" role="status" class="position w-4 h-4 mr-2 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>
                    <span class="text-sm">{{ block.type ? 'Building ' + block.type : 'Building block' }}</span>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useRoute } from 'vue-router'
import { blocksApi } from '@/domain/blocks/api/blocksApi'

const route = useRoute()
const recommendationStore = useRecommendationStore()
const emit = defineEmits(['regenerate-block'])

const selectBlock = (block) => {
  recommendationStore.selectedBlock = block
}

const regenerateBlock = async (block) => {
  // Set block status to regenerating
  block.status = 'regenerating'
  
  try {
    await blocksApi.regenerate(route.params.organization, block.id)
    
    // Emit event to parent component
    emit('regenerate-block')
  } catch (error) {
    console.error('Error regenerating block:', error)
    // Reset status if there was an error
    block.status = null
  }
}
</script>