<template>
  <h3 class="text-xl font-medium mb-4">Step 3 - Write block content</h3>

  <div class="flex items-center justify-between gap-2 mb-3">
    <p class="text-lg font-medium">CMS blocks</p>

    <AppButton @click="createPageInWordPress()" variant="primary" size="base">
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
  }
}
</script>
[
    "{\"acf_fc_layout\":\"hero\",\"hero_fields_default\":{\"image\":{\"ID\":3493,\"id\":3493,\"title\":\"Mid adult woman organising camping equipment, New Zealand\",\"filename\":\"mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-scaled.jpg\",\"filesize\":1201789,\"url\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-scaled.jpg\",\"link\":\"https://base.bloomcudev.com/auto-loans/mid-adult-woman-organising-camping-equipment-new-zealand/\",\"alt\":\"\",\"author\":\"2\",\"description\":\"\",\"caption\":\"Mid adult woman organising camping equipment, New Zealand\",\"name\":\"mid-adult-woman-organising-camping-equipment-new-zealand\",\"status\":\"inherit\",\"uploaded_to\":3009,\"date\":\"2023-02-16 18:02:25\",\"modified\":\"2023-02-16 18:02:25\",\"menu_order\":0,\"mime_type\":\"image/jpeg\",\"type\":\"image\",\"subtype\":\"jpeg\",\"icon\":\"https://base.bloomcudev.com/wp-includes/images/media/default.png\",\"width\":2560,\"height\":1704,\"sizes\":{\"thumbnail\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-150x150.jpg\",\"thumbnail-width\":150,\"thumbnail-height\":150,\"medium\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-300x200.jpg\",\"medium-width\":300,\"medium-height\":200,\"medium_large\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-768x511.jpg\",\"medium_large-width\":768,\"medium_large-height\":511,\"large\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-1024x681.jpg\",\"large-width\":1024,\"large-height\":681,\"1536x1536\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-1536x1022.jpg\",\"1536x1536-width\":1536,\"1536x1536-height\":1022,\"2048x2048\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-2048x1363.jpg\",\"2048x2048-width\":2048,\"2048x2048-height\":1363,\"full-page-image-small\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-960x432.jpg\",\"full-page-image-small-width\":960,\"full-page-image-small-height\":432,\"full-page-image-medium\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-1280x576.jpg\",\"full-page-image-medium-width\":1280,\"full-page-image-medium-height\":576,\"full-page-image-large\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-1920x864.jpg\",\"full-page-image-large-width\":1920,\"full-page-image-large-height\":864,\"sub-page-small\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-960x200.jpg\",\"sub-page-small-width\":960,\"sub-page-small-height\":200,\"sub-page-medium\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-1280x267.jpg\",\"sub-page-medium-width\":1280,\"sub-page-medium-height\":267,\"sub-page-large\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-1920x400.jpg\",\"sub-page-large-width\":1920,\"sub-page-large-height\":400,\"icon-small\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-scaled.jpg\",\"icon-small-width\":64,\"icon-small-height\":43,\"icon-md\":\"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-scaled.jpg\",\"icon-md-width\":128,\"icon-md-height\":85}},\"pre_title\":\"Your Safety, Our Priority\",\"title\":\"Protecting What Matters Most\",\"sub_title\":\"With Security and Peace of Mind\",\"link\":{\"title\":\"Learn More\",\"url\":\"#\",\"target\":\"\"},\"link_1_style\":\"default\",\"link_2\":\"\",\"link_2_style\":\"default\"},\"layout\":\"center\",\"section_background\":\"default\",\"section_margin\":\"no_margin\",\"background_image\":false,\"divider_image\":false,\"data_source\":\"default\"}",
    "{\n  \"acf_fc_layout\": \"hero\",\n  \"hero_fields_default\": {\n    \"image\": {\n      \"ID\": 3493,\n      \"id\": 3493,\n      \"title\": \"Mid adult woman organising camping equipment, New Zealand\",\n      \"filename\": \"mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-scaled.jpg\",\n      \"filesize\": 1201789,\n      \"url\": \"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-scaled.jpg\",\n      \"link\": \"https://base.bloomcudev.com/auto-loans/mid-adult-woman-organising-camping-equipment-new-zealand/\",\n      \"alt\": \"\",\n      \"author\": \"2\",\n      \"description\": \"\",\n      \"caption\": \"Mid adult woman organising camping equipment, New Zealand\",\n      \"name\": \"mid-adult-woman-organising-camping-equipment-new-zealand\",\n      \"status\": \"inherit\",\n      \"uploaded_to\": 3009,\n      \"date\": \"2023-02-16 18:02:25\",\n      \"modified\": \"2023-02-16 18:02:25\",\n      \"menu_order\": 0,\n      \"mime_type\": \"image/jpeg\",\n      \"type\": \"image\",\n      \"subtype\": \"jpeg\",\n      \"icon\": \"https://base.bloomcudev.com/wp-includes/images/media/default.png\",\n      \"width\": 2560,\n      \"height\": 1704,\n      \"sizes\": {\n        \"thumbnail\": \"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-150x150.jpg\",\n        \"thumbnail-width\": 150,\n        \"thumbnail-height\": 150,\n        \"medium\": \"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-300x200.jpg\",\n        \"medium-width\": 300,\n        \"medium-height\": 200,\n        \"medium_large\": \"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-768x511.jpg\",\n        \"medium_large-width\": 768,\n        \"medium_large-height\": 511,\n        \"large\": \"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-1024x681.jpg\",\n        \"large-width\": 1024,\n        \"large-height\": 681,\n        \"1536x1536\": \"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-1536x1022.jpg\",\n        \"1536x1536-width\": 1536,\n        \"1536x1536-height\": 1022,\n        \"2048x2048\": \"https://base.bloomcudev.com/wp-content/uploads/2023/02/mid-adult-woman-organising-camping-equipment-new-2022-03-04-01-43-54-utc-2048x1363.jpg\",\n        \"2048x2048-width\": 2048,\n        \"2048x2048-height\": 1363\n      }\n    },\n    \"pre_title\": \"Secure Your Journey\",\n    \"title\": \"Secure Your Journey with Our Flexible Auto Loans\",\n    \"sub_title\": \"Move closer to your dream car with hassle-free financing options.\",\n    \"\": null,\n    \"link\": {\n      \"title\": \"Apply Now\",\n      \"url\": \"#\",\n      \"target\": \"\"\n    },\n    \"link_1_style\": \"button\",\n    \"link_2\": \"Whether you're buying new or used, our affordable rates and personalized service make financing simple and stress-free.\",\n    \"link_2_style\": \"text\"\n  },\n  \"layout\": \"center\",\n  \"section_background\": \"gradient\",\n  \"section_margin\": \"no_margin\",\n  \"background_image\": false,\n  \"divider_image\": false,\n  \"data_source\": \"default\"\n}"
]
<style scoped>
/* Optional: Add custom animation for the spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>