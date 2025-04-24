<template>
  <div 
    class="relative group w-full block"
    @click="selectBlock(block)"
  >
    <!-- Add block button (top) -->
    <div v-if="recommendationStore.recommendation.status === 'done'" class="absolute top-0 left-0 w-full flex justify-center -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100">
      <button @click.stop="addNewBlock(block.order)" class="bg-neutral-50 hover:bg-neutral-100 rounded-full p-2 shadow-sm border border-neutral-200 flex items-center justify-center w-8 h-8 pointer-events-auto" title="Add block above">
        <i class="fas fa-plus text-neutral-600"></i>
      </button>
    </div>

    <!-- Block is empty -->
    <div v-if="!block.status && recommendationStore.recommendation.status === 'done'" class="m-2 border rounded-md p-2 bg-gray-200">
      <div class="flex items-center gap-2">
        <AppInput
          v-model="block.outline"
          @keydown.enter="generateBlock(block)"
          placeholder="Describe the block you want to design"
          class="flex-1 resize-none"
        />
        <AppButton @click="generateBlock(block)" :disabled="!block.outline">
          Submit
        </AppButton>
        <!-- Delete block -->
        <AppButton @click="destroyBlock(block)" variant="tertiary">
          Cancel
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
        <!-- Drag handle icon -->
        <div class="absolute z-[9999] top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div class="bg-white border rounded-md p-1 cursor-move" title="Drag to reorder">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-4 w-4 text-slate-500">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            </svg>
          </div>
        </div>
        
        <div class="absolute z-[9999] top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <!-- Confirm delete -->
          <div v-if="confirmingDelete[block.id]" class="flex items-center bg-white gap-1 border rounded-lg p-1">
            <span class="text-sm px-2">Are you sure?</span>
            <button @click.stop="cancelDelete(block)" class="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded-md text-sm">
              Cancel
            </button>
            <button @click.stop="destroyBlock(block)" class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm">
              Yes, delete
            </button>
          </div>

          <div v-else class="flex gap-2">
            <!-- Version controls -->
            <div v-if="block.versions" @click.stop class="bg-white border text-slate-600 px-3 py-1 rounded-md text-sm flex items-center gap-2">
                <button 
                v-if="canRevertBack(block)"
                @click="revertToPreviousVersion(block)" 
                class="bg-white border hover:bg-slate-100 text-slate-600 p-0.5 -ml-2 flex items-center rounded-md gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                </button>
                
                <span class="text-xs text-center w-10">v{{ block.current_version }}/{{ block.versions.length }}</span>
                
                <button 
                v-if="canRevertForward(block)"
                @click="revertToNextVersion(block)" 
                class="bg-white border hover:bg-slate-100 text-slate-600 p-0.5 -mr-2 flex items-center rounded-md gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                </button>
            </div>

            <!-- Duplicate button -->
            <button @click.stop="replicateBlock(block)" class="bg-white border hover:bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-sm">
                Duplicate
            </button>

            <!-- Regenerate button -->
            <button v-if="block.outline" @click.stop="regenerateBlock(block)" class="bg-white border hover:bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-sm">
                Regenerate
            </button>

            <!-- Delete button -->
            <button @click.stop="confirmDelete(block)" class="bg-white border hover:bg-slate-100 text-slate-600 px-3 py-1 rounded-md text-sm">
                Delete
            </button>
          </div>
        </div>

      <div v-html="block.html" :class="recommendationStore.selectedBlock === block ? 'border-2 border-violet-700' : ''" class="border-2 border-transparent group-hover:border-violet-500 cursor-pointer"></div>
    </div>

    <!-- Add block button (bottom) -->
    <div v-if="recommendationStore.recommendation.status === 'done'" class="absolute bottom-0 left-0 w-full flex justify-center translate-y-1/2 z-10 opacity-0 group-hover:opacity-100">
      <button @click.stop="addNewBlock(block.order + 1)" class="bg-neutral-50 hover:bg-neutral-100 rounded-full p-2 shadow-sm border border-neutral-200 flex items-center justify-center w-8 h-8 pointer-events-auto" title="Add block below">
        <i class="fas fa-plus text-neutral-600"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useRoute } from 'vue-router'
import { blocksApi } from '@/domain/blocks/api/blocksApi'
import { ref } from 'vue'

const props = defineProps({
  block: {
    type: Object,
    required: true
  }
})

const route = useRoute()
const recommendationStore = useRecommendationStore()
const emit = defineEmits(['poll-recommendation', 'fetch-recommendation'])

const confirmingDelete = ref({})

const selectBlock = (block) => {
  if (block.html) {
    recommendationStore.selectedBlock = block
  } else {
    recommendationStore.selectedBlock = null
  }
}

const addNewBlock = async (order) => {
//   if (order === 0) order = 1

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
    await blocksApi.update(route.params.organization, block.id, { 
        outline: block.outline ,
        status: 'generating'
    }).then(() => {
        blocksApi.regenerate(route.params.organization, block.id)
    })
    
    emit('poll-recommendation')
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
    
    emit('poll-recommendation')
  } catch (error) {
    console.error('Error regenerating block:', error)
    // Reset status if there was an error
    block.status = null
  }
}

const destroyBlock = async (block) => {
  try {
    await blocksApi.destroy(route.params.organization, block.id)
    emit('fetch-recommendation')
  } catch (error) {
    console.error('Error deleting block:', error)
  }
}

const replicateBlock = async (block) => {
  try {
    await blocksApi.replicate(route.params.organization, block.id)
    emit('fetch-recommendation')
  } catch (error) {
    console.error('Error duplicating block:', error)
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

const confirmDelete = (block) => {
  confirmingDelete.value[block.id] = true
}

const cancelDelete = (block) => {
  confirmingDelete.value[block.id] = false
}
</script>
