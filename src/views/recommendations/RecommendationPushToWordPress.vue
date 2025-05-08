<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <div class="w-full max-w-3xl">
      <!-- Page Title -->
      <div class="mb-4 text-center">
        <h1 class="text-2xl text-gray-900 mb-5" v-if="recommendationStore.recommendation && wordpressConnection">
          Push <span class="font-semibold">"{{ recommendationStore.recommendation.title }}"</span> to <span class="font-semibold">{{ wordpressConnection.name }}</span>
        </h1>
      </div>

      <!-- No WordPress Connection Message -->
      <div v-if="!hasWordPressConnection" class="mb-4 p-6 bg-violet-50 rounded-lg">
        <p class="text-lg text-violet-700 font-medium mb-2 text-center">No WordPress Connection Found</p>
        <p class="text-violet-600 text-sm text-center mb-4">You need to connect a WordPress website before you can push content.</p>
        <div class="flex justify-center">
          <button 
            @click="goToSettingsConnections" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
          >
            Go to Connections
          </button>
        </div>
      </div>

      <!-- Please wait: Do not close tab -->
      <div v-if="hasWordPressConnection && !readyToPush && !wordpressStore.wordpressPageUrl" class="mb-4 p-6 bg-violet-50 rounded-lg">
          <p class="text-lg text-violet-700 font-medium mb-2 text-center">Important: Don't close this tab</p>
          <p class="text-violet-600 text-sm text-center">Closing this tab will interrupt the prototype being prepared for WordPress.</p>
          <p class="text-violet-600 text-sm text-center">Once the prototype is ready, you will need to push it to WordPress.</p>
        </div>

      <!-- Success: Ready to push to WordPress -->
      <div v-if="readyToPush && !wordpressStore.wordpressPageUrl" class="mb-4 p-6 bg-violet-50 rounded-lg">
          <div class="flex justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-violet-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
            </svg>
          </div>
          
          <p class="text-lg text-violet-600 font-medium mb-3 text-center">Prototype is ready to push to WordPress</p>

          <div class="flex justify-center">
            <AppButton @click="pushToWordPress" :loading="wordpressStore.isLoading">
                Push to WordPress
            </AppButton>
          </div>
        </div>

      <!-- Success: WordPress page link -->
      <div v-if="wordpressStore.wordpressPageUrl" class="mb-4 p-6 bg-[#EEFFF7] rounded-lg">
          <div class="flex justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-[#2B0F52]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <p class="text-lg text-[#2B0F52] font-medium mb-3 text-center">Success! MetriFi has drafted a new page in WordPress.</p>

          <div class="flex justify-center mb-8">
            <AppButton variant="success" :href="wordpressStore.wordpressPageUrl + '&preview=true'" target="_blank">
                View draft in WordPress
            </AppButton>
          </div>

          <p class="text-sm text-[#2B0F52]/90 mt-2 text-center">You have to be logged in WordPress to view this draft page.</p>
        </div>

      <!-- WordPress Push Content (only shown if connection exists) -->
      <div v-if="hasWordPressConnection">
        <!-- Block cards -->
        <div v-if="wordpressStore.blocks" v-for="(block, index) in wordpressStore.blocks" class="border rounded-lg mb-4">
          <div class="flex items-center justify-between p-3">
              <div class="flex items-center gap-3">
                  <!-- Block number -->   
                  <div class="text-gray-900 font-semibold">
                    Block {{ index + 1 }}
                  </div>

                  <!-- Type -->
                  <div v-if="block.type" @click="showWordpressBlocksPanel(block)" class="cursor-pointer inline-flex items-center rounded-md bg-violet-50 px-2 py-1 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-600/20 hover:bg-violet-100">
                      {{ getBlockName(block.type) }} / {{ getLayoutName(block.type, block.layout) }}

                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                  </div>

                  <!-- Error -->
                  <p v-if="block.error" class="text-red-500 text-sm">
                    {{ block.error }}. Block will not be pushed.
                  </p>
              </div>

              <div v-if="block.status" class="flex items-center gap-2 text-violet-600">
                <span class="text-sm">{{ block.status }}</span>
                <svg aria-hidden="true" role="status" class="position w-4 h-4 mr-2 animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#FFFFFF" fill-opacity="0"/><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
              </div>

              <div v-if="!block.status && block.schema_with_content" class="flex items-center gap-2">
                <span class="inline-flex items-center rounded-md bg-[#EEFFF7] px-2 py-1 text-xs font-medium text-[#2B0F52]">
                  Done
                </span>
              </div>
            </div>
            <!-- <pre>{{ block.schema_with_content }}</pre> -->
        </div>

        <!-- Error -->
        <div v-if="wordpressStore.error" class="mt-4 p-6 bg-red-50 rounded-lg">
          <p class="text-red-500 text-center">{{ wordpressStore.error }}</p>
        </div>


        <!-- Cancel button -->
        <div class="mt-6 flex justify-center gap-3">
          <AppButton :to="{ name: 'recommendation', params: { organization: route.params.organization, dashboard: route.params.dashboard, recommendation: route.params.recommendation } }" variant="secondary">
            Back to Recommendation
          </AppButton>

          <AppButton v-if="!wordpressStore.wordpressPageUrl" @click="refreshPage" variant="secondary">
            Start over
          </AppButton>

          <AppButton v-if="!wordpressStore.wordpressPageUrl"  @click="closeTab">
            Cancel and close tab
          </AppButton>
        </div>
      </div>
    </div>

    <WordpressBlocksPanel/>
  </div>
</template>

<script setup>
import wordpressBlocks from '@/domain/wordpress/store/wordpressBlocks.js'
import { watch, provide, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useConnections } from '@/domain/connections/composables/useConnections'
import { useWordPressStore } from '@/domain/wordpress/store/useWordPressStore'
import WordpressBlocksPanel from '@/views/recommendations/components/WordpressBlocksPanel.vue'

const route = useRoute()
const router = useRouter()
const recommendationStore = useRecommendationStore()
const wordpressStore = useWordPressStore()
const connections = useConnections()
const hasWordPressConnection = ref(false)
const wordpressConnection = ref(null)
const readyToPush = ref(false)

// Block types list panel state
const isWordpressBlocksPanelOpen = ref(false)
provide('isWordpressBlocksPanelOpen', isWordpressBlocksPanelOpen)

// Open block types list panel and set selected block
const showWordpressBlocksPanel = (block) => {
  isWordpressBlocksPanelOpen.value = true
  wordpressStore.selectedBlock = block
}

// Get block name by type
const getBlockName = (blockId) => {
    const block = wordpressBlocks.find(block => block.id === blockId)
    return block.name
}

// Get block layout name by type and layout
const getLayoutName = (blockId, layoutId) => {
    const block = wordpressBlocks.find(block => block.id === blockId)
    const layout = block.layouts.find(layout => layout.id === layoutId)
    return layout.name
}

// Function to close the tab
const closeTab = () => {
  window.close()
}

// Function to refresh the page
const refreshPage = () => {
  window.location.reload()
}

// Navigate to settings connections page
const goToSettingsConnections = () => {
  router.push({ name: 'settingsConnections', params: { organization: route.params.organization } })
}

// Function to push to WordPress
const pushToWordPress = () => {
  wordpressStore.createPageInWordPress(route.params.organization, recommendationStore.recommendation.title)
}

// Watch the blocks array in the WordPress store
// When all blocks have schema_with_content and no errors, show the push button
watch(() => wordpressStore.blocks, (blocks) => {
  if (blocks && blocks.length > 0) {
    // Check if all blocks without errors have schema_with_content
    const allValidBlocksHaveContent = blocks
      .filter(block => !block.error)
      .every(block => block.schema_with_content);
    
    if (allValidBlocksHaveContent && blocks.some(block => !block.error)) {
      console.log('All valid blocks have schema_with_content, ready to push');
      readyToPush.value = true
    } else {
      readyToPush.value = false
    }
  }
}, { deep: true });

onMounted(() => {
    // Check if WordPress connection exists
    connections.listConnections().then(() => {
        wordpressConnection.value = connections.connections.value.find(connection => connection.service === 'WordPress Website')
        hasWordPressConnection.value = !!wordpressConnection.value
        
        if (hasWordPressConnection.value) {
            recommendationStore.show(route.params.organization, route.params.recommendation)
                .then(() => {
                    wordpressStore.blocks = recommendationStore.recommendation.latest_page.blocks;
                    wordpressStore.predictCMSBlocks();
                })
        }
    })
})
</script>