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
          <div 
            v-for="(block, index) in recommendationStore.recommendation?.latest_page?.blocks || []" 
            :key="index"
            class="relative group w-full block"
            @click="selectBlock(block)"
          >
            <!-- Add block button (top) -->
            <div class="absolute top-0 left-0 w-full flex justify-center -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 pointer-events-none">
              <button @click.stop="addNewBlock(index)" class="bg-neutral-50 hover:bg-neutral-100 rounded-full p-2 shadow-sm border border-neutral-200 flex items-center justify-center w-8 h-8 pointer-events-auto" title="Add block above">
                <i class="fas fa-plus text-neutral-600"></i>
              </button>
            </div>

            <!-- Block is empty -->
            <div v-if="!block.status" class="m-2 border rounded-md p-2 bg-gray-200">
                <div class="flex items-center gap-2">
                  <AppInput
                    v-model="block.outline"
                    @keydown.enter.prevent="generateBlock(block)"
                    placeholder="Describe the block you want to design"
                    class="flex-1 resize-none"
                  />
                  <AppButton @click="generateBlock(block)" :disabled="!block.outline">
                    Submit
                  </AppButton>
                </div>
            </div>

            <!-- Block is being generated -->
            <div v-if="block.status === 'generating'" class="m-2 border rounded-md p-3 bg-gray-100 animate-pulse">
                <div class="flex items-center gap-1 text-violet-600">
                    <svg aria-hidden="true" role="status" class="position w-4 h-4 mr-2 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/></svg>
                    <span class="text-sm">Designing block</span>
                </div>
            </div>

            <!-- Block has been generated -->
            <div v-else-if="block.html" class="relative">
                <div v-if="recommendationStore.recommendation.status === 'done'">
                    <div class="absolute z-[9999] top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <!-- Version controls -->
                        <div v-if="block.versions" @click.stop class="bg-slate-500 text-white px-3 py-1 rounded-md text-sm flex items-center gap-2">
                            <button 
                                v-if="canRevertBack(block)"
                                @click="revertToPreviousVersion(block)" 
                                :class="canRevertBack(block) ? 'bg-slate-600 hover:bg-slate-700' : ''"
                                class="p-0.5 -ml-2 flex items-center rounded-md gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <span>Version {{ block.current_version }} of {{ block.versions.length }}</span>
                            <button 
                                v-if="canRevertForward(block)"
                                @click="revertToNextVersion(block)" 
                                class="p-0.5 -mr-2 flex items-center rounded-md gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                :class="canRevertForward(block) ? 'bg-slate-600 hover:bg-slate-700' : ''"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                        
                        <!-- Regenerate button -->
                        <button v-if="block.outline" @click.stop="regenerateBlock(block)" class="bg-[#884DFF] hover:bg-[#6E3ECE] text-white px-3 py-1 rounded-md text-sm">
                            Regenerate
                        </button>

                        <!-- Disabled regenerate button -->
                        <button v-if="!block.outline" @click.stop="regenerateBlock(block)" class="bg-[#884DFF]/50 hover:bg-[#6E3ECE]/50 text-white px-3 py-1 rounded-md text-sm">
                            Block must have an outline to be regenerated
                        </button>
                    </div>
                </div>

                <div v-html="block.html" :class="recommendationStore.selectedBlock === block ? 'border-2 border-violet-700' : ''" class="border-2 border-transparent group-hover:border-violet-500 cursor-pointer"></div>
            </div>

            <!-- Add block button (bottom) -->
            <div class="absolute bottom-0 left-0 w-full flex justify-center translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 pointer-events-none">
              <button @click.stop="addNewBlock(index + 1)" class="bg-neutral-50 hover:bg-neutral-100 rounded-full p-2 shadow-sm border border-neutral-200 flex items-center justify-center w-8 h-8 pointer-events-auto" title="Add block below">
                <i class="fas fa-plus text-neutral-600"></i>
              </button>
            </div>
          </div>
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
import { ref } from 'vue'

const route = useRoute()
const recommendationStore = useRecommendationStore()
const emit = defineEmits(['fetch-recommendation'])

const selectBlock = (block) => {
    if (block.html) {
        recommendationStore.selectedBlock = block
    } else {
        recommendationStore.selectedBlock = null
    }
}

const addNewBlock = async (order) => {
  try {
    await blocksApi.store(
      route.params.organization,
      { 
        page_id: recommendationStore.recommendation.latest_page.id,
        order: order 
      }
    )
    
    // Fetch the updated recommendation with the new block
    emit('fetch-recommendation')
  } catch (error) {
    console.error('Error adding new block:', error)
  }
}

const generateBlock = async (block) => {
  block.status = 'generating'
  
  try {
    // Update the block in db and regenerate
    await blocksApi.update(route.params.organization, block.id, { outline: block.outline })
        .then(() => {
            blocksApi.regenerate(route.params.organization, block.id)
        })
    
    emit('fetch-recommendation')
  } catch (error) {
    // Reset status if there was an error
    block.status = null

    console.error('Error generating block:', error)
  }
}

const regenerateBlock = async (block) => {
  // Set block status to regenerating
  block.status = 'generating'
  
  try {
    await blocksApi.regenerate(route.params.organization, block.id)
    
    emit('fetch-recommendation')
  } catch (error) {
    console.error('Error regenerating block:', error)
    // Reset status if there was an error
    block.status = null
  }
}

const reorderBlock = async (e) => {
  let event = e.moved || e.added

  try {
    await blocksApi.reorder(route.params.organization, event.element.id, event.newIndex + 1)
  } catch (error) {
    console.error('Error reordering block:', error)
  }
}

const canRevertBack = (block) => {
  return block.versions && block.versions.length > 0 && block.current_version > 1
}

const canRevertForward = (block) => {
  return block.versions && block.current_version < block.versions.length
}

const revertToPreviousVersion = async (block) => {
  if (!canRevertBack(block)) return
  
  // Find the previous version
  const targetVersion = block.versions.find(v => v.version_number === block.current_version - 1)
  if (targetVersion) {

    try {
      const response = await blocksApi.revert(route.params.organization, block.id, targetVersion.id)

      // Update block with the response data
      Object.assign(block, response.data.data)

    } catch (error) {
      console.error('Error reverting to previous version:', error)
    }
  }
}

const revertToNextVersion = async (block) => {
  if (!canRevertForward(block)) return
  
  // Find the next version
  const targetVersion = block.versions.find(v => v.version_number === block.current_version + 1)
  if (targetVersion) {
    
    try {
      const response = await blocksApi.revert(route.params.organization, block.id, targetVersion.id)
      
      // Update block with the response data
      Object.assign(block, response.data.data)

    } catch (error) {
      console.error('Error reverting to next version:', error)
    }
  }
}
</script>