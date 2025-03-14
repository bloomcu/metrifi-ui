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
        
        <!-- Version dropdown -->
        <div class="relative" ref="versionDropdown">
          <button 
            @click.stop="showVersionDropdown = !showVersionDropdown" 
            class="flex items-center space-x-2 text-sm text-gray-700 border rounded px-3 py-1 hover:bg-gray-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-gray-600">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <span>Version {{ selectedVersion }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
          
          <!-- Dropdown menu -->
          <div 
            v-if="showVersionDropdown" 
            class="absolute right-0 mt-1 w-48 bg-white border rounded-md shadow-lg z-10"
          >
            <div class="py-1">
              <button 
                v-for="version in versions" 
                :key="version.id" 
                @click.stop="selectVersion(version.id)"
                class="w-full text-left px-4 py-2 text-sm hover:bg-violet-50 flex flex-col"
                :class="{ 'bg-violet-50': selectedVersion === version.id }"
              >
                <div class="flex items-center">
                  <span class="font-medium" :class="selectedVersion === version.id ? 'text-violet-700' : 'text-gray-700'">Version {{ version.id }}</span>
                  <i v-if="selectedVersion === version.id" class="fas fa-check ml-2 text-violet-700"></i>
                </div>
                <span class="text-xs text-gray-500 mt-1">{{ version.date }}</span>
              </button>
            </div>
          </div>
        </div>
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
            <div v-else class="m-2 border rounded-md p-3 bg-gray-300 animate-pulse">{{ block.type ? block.type : 'Building block' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { ref, onMounted, onUnmounted } from 'vue'

const recommendationStore = useRecommendationStore()
const deviceType = ref('desktop')
const showVersionDropdown = ref(false)
const selectedVersion = ref(7)
const versionDropdown = ref(null)

// Version data with human-readable dates
const versions = [
  { id: 7, date: '1 day ago' },
  { id: 6, date: '1 day ago' },
  { id: 5, date: '1 day ago' },
  { id: 4, date: '1 day ago' },
  { id: 3, date: '2 days ago' },
  { id: 2, date: '3 days ago' },
  { id: 1, date: '4 days ago' }
]

const selectBlock = (block) => {
  recommendationStore.selectedBlock = block
}

const selectVersion = (versionId) => {
  selectedVersion.value = versionId
  showVersionDropdown.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (versionDropdown.value && !versionDropdown.value.contains(event.target)) {
    showVersionDropdown.value = false
  }
}

// Add event listener when component is mounted
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Remove event listener when component is unmounted
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>