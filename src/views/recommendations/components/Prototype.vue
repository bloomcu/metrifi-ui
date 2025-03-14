<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="border rounded-md shadow-sm overflow-hidden">
      <!-- Browser-like header -->
      <div class="border-b px-4 py-2 flex items-center justify-between">

        <!-- Device toggles -->
        <div class="flex items-center space-x-1">
          <button 
            @click="deviceType = 'desktop'" 
            class="w-8 p-1 rounded"
            :class="deviceType === 'desktop' ? 'bg-violet-100 text-violet-700' : 'text-gray-500'"
            title="Desktop view"
          >
            <i class="fas fa-desktop text-sm"></i>
          </button>
          <button 
            @click="deviceType = 'tablet'" 
            class="w-8 p-1 rounded"
            :class="deviceType === 'tablet' ? 'bg-violet-100 text-violet-700' : 'text-gray-500'"
            title="Tablet view"
          >
            <i class="fas fa-tablet-alt text-sm"></i>
          </button>
          <button 
            @click="deviceType = 'mobile'" 
            class="w-8 p-1 rounded"
            :class="deviceType === 'mobile' ? 'bg-violet-100 text-violet-700' : 'text-gray-500'"
            title="Mobile view"
          >
            <i class="fas fa-mobile-alt text-sm"></i>
          </button>
        </div>
        
        <div class="w-16"></div> <!-- Spacer for balance -->
      </div>
      
      <!-- Content container with responsive width -->
      <div class="bg-white overflow-auto transition-all duration-300 flex justify-center"
        :style="{
          width: '100%',
          minHeight: '300px'
        }"
      >
        <!-- Content with responsive width -->
        <div 
          class="transition-all duration-300"
          :style="{
            width: deviceType === 'desktop' ? '100%' : 'auto',
            maxWidth: deviceType === 'tablet' ? '768px' : deviceType === 'mobile' ? '375px' : 'none'
          }"
        >
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
                'border-2 border-transparent group-hover:border-violet-500 cursor-pointer',
                recommendationStore.selectedBlock === block ? 'border-2 border-violet-700' : ''
              ]"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { ref } from 'vue'

const recommendationStore = useRecommendationStore()
const deviceType = ref('desktop')

const selectBlock = (block) => {
  recommendationStore.selectedBlock = block
}
</script>