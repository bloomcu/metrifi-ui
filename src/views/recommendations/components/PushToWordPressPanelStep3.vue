<template>
  <h3 class="text-xl font-medium mb-4">Step 3 - Write block content</h3>

  <div class="flex items-center justify-between gap-2 mb-3">
    <p class="text-lg font-medium">CMS blocks</p>

    <AppButton 
      @click="createPageInWordPress()" 
      variant="primary" 
      size="base"
      class="flex items-center gap-2"
      :disabled="isCreatingWordPressPage"
    >
      <span v-if="isCreatingWordPressPage" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
      Create page in WordPress
    </AppButton>
  </div>

  <div v-for="block in wordpressStore.blocks" class="border rounded-lg mb-2 relative">
    <p v-if="block.error" class="text-red-500 p-2">{{ block.error }}</p>
    <div v-else>
      <div class="text-gray-900 p-2">{{ block.acf_fc_layout }}--{{ block.layout }}</div>
      <p v-if="block.schema_with_content" class="text-gray-500 line-clamp-6 text-sm border-t pt-2 px-2 pb-1"><span class="text-gray-800 font-medium">Schema with content:</span> <br>{{ block.schema_with_content }}</p>
      
      <!-- Block-level loading indicator -->
      <div v-if="block.isWritingContent" class="absolute inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span class="ml-2 text-gray-700">Writing content...</span>
      </div>
    </div>
  </div>

  <div class="flex items-center gap-2 mt-6">
    <AppButton 
      @click="writeContentForAllBlocks()" 
      variant="secondary" 
      size="base" 
      class="flex items-center gap-2"
      :disabled="isLoading"
    >
      <span v-if="isLoading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
      Write block content
    </AppButton>
  </div>

  <!-- Global loading indicator -->
  <div v-if="isLoading && !wordpressStore.blocks.some(block => block.isWritingContent)" class="mt-4">
    <div class="flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span class="ml-2 text-gray-700">Processing blocks...</span>
    </div>
  </div>

  <div v-if="error" class="text-red-500 mb-4">
    {{ error }}
  </div>
</template>

<script setup>
import axios from 'axios'
import OpenAI from 'openai'
import { ref } from 'vue'
import { useWordPressStore } from '@/domain/wordpress/store/useWordPressStore'

const wordpressStore = useWordPressStore()
const error = ref(null)
const isLoading = ref(false)
const isCreatingWordPressPage = ref(false) // New loading state

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
  dangerouslyAllowBrowser: true,
})

const writeContentForAllBlocks = async () => {
  isLoading.value = true
  error.value = null

  try {
    const promises = wordpressStore.blocks.map(block => writeBlockContent(block))
    await Promise.all(promises)
  } catch (err) {
    error.value = 'An error occurred while processing blocks'
    console.error('Batch processing error:', err)
  } finally {
    isLoading.value = false
  }
}

const writeBlockContent = async (block) => {
  block.isWritingContent = true
  block.error = null

  try {
    const response = await openai.chat.completions.create({
      model: "grok-beta",
      messages: [
        { 
          role: "system", 
          content: `You are an expert at writing content in a json object. I am requesting content for a block. I will provide the html of a block and the json schema I need the content written in.
          
          IMPORTANT: Your response MUST be pure JSON without any markdown wrappers, code blocks, or additional text. Do NOT wrap the response in \`\`\`json ... \`\`\` or any other markdown. Provide only the JSON object as plain text.`
        },
        { 
          role: "user",
          content: JSON.stringify({
            message: "Write content for this block into the provided schema",
            html: block.html,
            schema: block.schema
          })
        }
      ],
    })

    block.schema_with_content = response.choices[0].message.content

  } catch (error) {
    console.error('Error from Grok:', error)
    block.error = `Error writing content: ${error.message}`

  } finally {
    block.isWritingContent = false
  }
}

/**
 * Push to WordPress
 * --------------------
 */
const createPageInWordPress = async () => {
  isCreatingWordPressPage.value = true // Set loading state to true
  const wordpressUrl = 'https://base.bloomcudev.com/wp-json/metrifi/v1/create-page';
  const username = 'admin-base';
  const appPassword = 'ZEh4 V0zI Ihxx iJR4 D9RZ dUb3';
  
  // Create a new array from blocks.value array where each member 
  // of the new array is an object with only the schema_with_content property
  const blocksWithSchemaWithContent = wordpressStore.blocks.map(block => (JSON.parse(block.schema_with_content)));

  console.log('blocks:', wordpressStore.blocks);
  console.log('blocksWithSchemaWithContent:', blocksWithSchemaWithContent);

  try {
    const response = await axios.post(
      wordpressUrl,
      {
        title: 'New page from MetriFi',
        content: 'This is the page content from MetriFi',
        status: 'publish',
        acf: {
          content_blocks: blocksWithSchemaWithContent
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${username}:${appPassword}`)
        }
      }
    );

    console.log('Post created successfully!');
    console.log('Post data:', response.data);
  } catch (error) {
    console.log('Failed to create post');
    console.error('Error:', error.response ? error.response.data : error.message);
  } finally {
    isCreatingWordPressPage.value = false // Reset loading state
  }
}
</script>

<style scoped>
/* Optional: Add custom animation for the spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>