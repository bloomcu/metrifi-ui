<template>
  <template v-if="recommendationStore.isPushToWordPressPanelOpen">
    <div @click="recommendationStore.isPushToWordPressPanelOpen = false" 
         class="fixed inset-0 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-40"></div>

    <div class="fixed right-0 top-0 h-full overflow-y-auto w-[60em] p-6 transform rounded-l-3xl bg-white shadow-2xl ring-1 ring-gray-900/5 z-50">
      <!-- Tray header -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-base text-gray-400">Push to WordPress</h2>
        <svg @click="recommendationStore.isPushToWordPressPanelOpen = false" 
             class="w-6 h-6 mr-2 cursor-pointer" 
             fill="none" 
             viewBox="0 0 24 24" 
             stroke-width="1.5" 
             stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </div>

      <!-- Blocks -->
      <div v-if="wordpressStore.blocks" v-for="(block, index) in wordpressStore.blocks" class="border rounded-lg mb-2">
        <p v-if="block.error" class="text-red-500 p-3">{{ block.error }}</p>

        <div v-else>
          <!-- Block id and loader -->
          <div class="flex items-center justify-between p-3">
            <div class="flex items-center gap-3">
                <div class="text-gray-900 font-semibold">Block {{ index + 1 }}</div>
                <div v-if="block.acf_fc_layout" class="inline-flex items-center rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-600/20">
                    {{ block.acf_fc_layout.charAt(0).toUpperCase() + block.acf_fc_layout.slice(1) }}
                </div>
            </div>

            <div v-if="block.status" class="flex items-center gap-2 text-violet-600">
              <span class="text-sm">{{ block.status }}</span>
              <svg aria-hidden="true" role="status" class="position w-4 h-4 mr-2 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
              </svg>
            </div>

            <div v-if="!block.status && block.schema_with_content" class="flex items-center gap-2">
              <span class="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                Done
              </span>
            </div>
            
          </div>
        </div>
      </div>

      <div v-if="wordpressStore.wordpressPageUrl" class="mt-4 p-4 bg-violet-50 rounded-lg">
        <p class="text-violet-700 font-medium mb-2">WordPress page created successfully!</p>
        <a :href="wordpressStore.wordpressPageUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500">
          View WordPress Page
        </a>
      </div>

      <div v-if="wordpressStore.error" class="mt-4 p-4 bg-red-50 rounded-lg">
        <p class="text-red-700 font-medium">Error:</p>
        <p class="text-red-600">{{ wordpressStore.error }}</p>
      </div>

      
      <!-- <pre v-if="wordpressStore.blocks">{{ wordpressStore.blocks }}</pre> -->
    </div>
  </template>
</template>

<script setup>
import { watch } from 'vue'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useWordPressStore } from '@/domain/wordpress/store/useWordPressStore'

const recommendationStore = useRecommendationStore()
const wordpressStore = useWordPressStore()

/**
 * Get Sections with ID from Prototype
 * --------------------
 */
 async function getSectionsFromPrototype() {
    const prototype = await recommendationStore.recommendation.prototype
    const parser = new DOMParser();
    const doc = parser.parseFromString(prototype, 'text/html');
    const elements = doc.getElementsByTagName('section');
    const sections = Array.from(elements).map(element => {
        return {
          id: element.id,
          html: element.outerHTML,
        };
    });

    wordpressStore.blocks = sections;
}

watch(() => recommendationStore.isPushToWordPressPanelOpen, async (newVal) => {
  if (newVal && !wordpressStore.isDeploying) {
    getSectionsFromPrototype().then(() => {
      console.log('Got sections from protottype')
      wordpressStore.predictCMSBlocks();
      wordpressStore.isDeploying = true;
    });
  }
});

// Watch the blocks array in the WordPress store
// When all blocks have schema_with_content, create the WordPress page
watch(() => wordpressStore.blocks, (blocks) => {
  if (blocks && blocks.length > 0) {
    // Check if all blocks have schema_with_content
    const allBlocksHaveContent = blocks.every(block => block.schema_with_content);
    
    if (allBlocksHaveContent) {
      console.log('All blocks have schema_with_content, creating WordPress page');
      wordpressStore.createPageInWordPress(recommendationStore.recommendation.title)
    }
  }
}, { deep: true });
</script>