<template>
  <div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    
    <div class="_border _rounded-md shadow-lg overflow-hidden">
      <!-- Browser-like header -->
      <!-- <div class="border-b px-4 py-2 flex items-center justify-between"> -->

        <!-- Device toggles -->
        <!-- <div class="flex items-center space-x-1">
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
        </div> -->
        
        <!-- Version dropdown -->
        <!-- <div class="relative" ref="versionDropdown">
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
        </div> -->
      <!-- </div> -->
      
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
            <div 
              v-if="block.html" 
              v-html="block.html" 
              :class="[
                'border-2 border-transparent group-hover:border-violet-500 cursor-pointer',
                recommendationStore.selectedBlock === block ? 'border-2 border-violet-700' : ''
              ]"
            ></div>
            <div v-else class="m-2 border rounded-md p-3 bg-gray-200 animate-pulse">
                <div class="flex items-center gap-1 text-violet-600">
                    <svg aria-hidden="true" role="status" class="position w-4 h-4 mr-2 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                    </svg>
                    <span class="text-sm">{{ block.type ? block.type : 'Building component...' }}</span>
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
import { ref, onMounted, onUnmounted } from 'vue'

const recommendationStore = useRecommendationStore()

// const deviceType = ref('desktop')
// const showVersionDropdown = ref(false)
// const selectedVersion = ref(7)
// const versionDropdown = ref(null)

// Version data with human-readable dates
// const versions = [
//   { id: 7, date: '1 day ago' },
//   { id: 6, date: '1 day ago' },
//   { id: 5, date: '1 day ago' },
//   { id: 4, date: '1 day ago' },
//   { id: 3, date: '2 days ago' },
//   { id: 2, date: '3 days ago' },
//   { id: 1, date: '4 days ago' }
// ]

// const selectVersion = (versionId) => {
//   selectedVersion.value = versionId
//   showVersionDropdown.value = false
// }

const selectBlock = (block) => {
  recommendationStore.selectedBlock = block
}

// // Close dropdown when clicking outside
// const handleClickOutside = (event) => {
//   if (versionDropdown.value && !versionDropdown.value.contains(event.target)) {
//     showVersionDropdown.value = false
//   }
// }

// // Add event listener when component is mounted
// onMounted(() => {
//   document.addEventListener('click', handleClickOutside)
// })

// // Remove event listener when component is unmounted
// onUnmounted(() => {
//   document.removeEventListener('click', handleClickOutside)
// })
</script>