<template>
    <template v-if="isWordpressBlocksPanelOpen">
        <div @click="isWordpressBlocksPanelOpen = false" class="fixed inset-0 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-20"></div>

        <div class="fixed right-0 top-0 h-full overflow-y-auto w-[500px] p-6 transform rounded-l-3xl bg-white shadow-2xl ring-1 ring-gray-900/5 z-50">
            <!-- Tray header -->
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-medium">WordPress blocks</h3>
                <svg @click="isWordpressBlocksPanelOpen = false" class="w-6 h-6 mr-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>

            <!-- Search -->
            <AppInput
              v-model="searchQuery"
              placeholder="Search blocks"
              class="mb-4"
              ref="searchInputRef"
              autofocus
            />

            <!-- Block type options -->
            <div v-for="block in filteredBlocks" class="border rounded-lg mb-4 overflow-hidden">
                <div class="p-3 bg-violet-50/60 flex items-center justify-between">
                    <p class="text-md font-medium text-gray-900">{{ block.name }}</p>
                    <p class="text-xs text-gray-500">{{ block.layouts.length }} {{ block.layouts.length === 1 ? 'layout' : 'layouts' }}</p>
                </div>
                <div 
                    v-for="layout in block.layouts" 
                    @click="updateBlock(block.id, layout.id)"
                    class="group flex items-center justify-between border-t p-3 gap-2 cursor-pointer hover:bg-violet-50/60"
                >
                    <p class="text-gray-700 group-hover:text-violet-600">{{ layout.name }}</p>
                    <svg class="hidden group-hover:block size-5 text-violet-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </div>
            </div>
        </div>
    </template>
</template>

<script setup>
import wordpressBlocks from '@/domain/wordpress/store/wordpressBlocks.js'
import { blocksApi } from '@/domain/blocks/api/blocksApi'
import { inject, ref, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useWordPressStore } from '@/domain/wordpress/store/useWordPressStore'
import AppInput from '@/app/components/base/forms/AppInput.vue'

const route = useRoute()
const recommendationStore = useRecommendationStore()
const wordpressStore = useWordPressStore()
const isWordpressBlocksPanelOpen = inject('isWordpressBlocksPanelOpen')

// Search state
const searchInputRef = ref(null)
const searchQuery = ref('')

const filteredBlocks = computed(() => {
    return wordpressBlocks.filter(block => 
        block.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

watch(isWordpressBlocksPanelOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      setTimeout(() => {
        if (searchInputRef.value?.inputRef) {
          searchInputRef.value.inputRef.focus()
        }
      }, 100)
    })
  } else {
    // Reset search query when panel is closed
    searchQuery.value = ''
  }
})

// Update selected block's type
const updateBlock = (blockType, layoutType) => {
    console.log('Updating block:', blockType, layoutType)

    // Update local block
    wordpressStore.selectedBlock.type = blockType
    wordpressStore.selectedBlock.layout = layoutType

    // Update the local block's schema with content
    wordpressStore.selectedBlock.schema_with_content.acf_fc_layout = blockType
    wordpressStore.selectedBlock.schema_with_content.layout = layoutType
    
    wordpressStore.writeBlockContent(wordpressStore.selectedBlock)

    // Update block in database
    blocksApi.update(route.params.organization, wordpressStore.selectedBlock.id, { 
        type: blockType, 
        layout: layoutType 
    })

    // Reset wordpress page url
    wordpressStore.wordpressPageUrl = null
    
    // Close panel
    isWordpressBlocksPanelOpen.value = false
}
</script>