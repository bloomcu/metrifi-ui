<template>
      <template v-if="recommendationStore.isPushToWordPressPanelOpen">
        <div @click="recommendationStore.isPushToWordPressPanelOpen = false" class="fixed inset-0 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-40"></div>

        <div class="fixed right-0 top-0 h-full overflow-y-auto w-[60em] p-6 transform rounded-l-3xl bg-white shadow-2xl ring-1 ring-gray-900/5 z-50">
            <!-- Tray header -->
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-medium">Push to WordPress</h3>
                <svg @click="recommendationStore.isPushToWordPressPanelOpen = false" class="w-6 h-6 mr-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>

            <!-- Sections -->
            <div class="grid grid-cols-2 gap-4">
              <!-- Left -->
              <div>
                <p class="text-lg font-medium mb-2">Prototype</p>
                <div v-for="section in getSectionsFromPrototype()" class="border rounded-lg p-2 mb-2">
                  <p class="text-gray-900">ID: {{ section.id }}</p>
                </div>
                <!-- <pre class="text-xs">{{ getSectionsFromPrototype() }}</pre> -->
              </div>

              <!-- Right -->
              <div>
                <p class="text-lg font-medium mb-2">CMS</p>
                <div v-for="block in blocks" class="border rounded-lg p-2 mb-2">
                  <p class="text-gray-900">Layout: {{ block.layout }}</p>
                </div>
              </div>
          </div>

          <!-- <AppButton @click="createPageInWordPress()" variant="primary" size="base" class="flex items-center gap-2 mt-6">
            Push to WordPress
          </AppButton>   -->

          <AppButton @click="predictCMSBlocks()" variant="primary" size="base" class="flex items-center gap-2 mt-6">
            Predict CMS Blocks
          </AppButton>  

          <div v-if="isLoading" class="text-center">
            <p>Predicting CMS blocks... Please wait</p>
          </div>

          <div v-if="error" class="text-red-500 mb-4">
            {{ error }}
          </div>
        </div>
    </template>
</template>

<script setup>
import axios from 'axios'
import OpenAI from 'openai'
import { ref } from 'vue'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'

const recommendationStore = useRecommendationStore()

// const blocks = ref([
//   {
//     layout: 'hero',
//   },
//   {
//     layout: 'feature',
//   },
// ])

/**
 * Get CMS Block layouts from OpenAI Assistant
 * --------------------
 */
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

// Array to store the processed results
const blocks = ref([]);
const isLoading = ref(false);
const error = ref(null);

// Function to process HTML and get layout type from OpenAI assistant
const processHtmlWithAssistant = async (htmlContent) => {
  try {
    const response = await openai.beta.threads.createAndRun({
      assistant_id: 'asst_jjPmiRkOknWPAYxPdyfQLpvJ', // Match AI component to CMS block v4
      thread: {
        messages: [
          {
            role: 'user',
            content: htmlContent
          }
        ]
      }
    });

    // Wait for the run to complete and get the messages
    const threadMessages = await openai.beta.threads.messages.list(response.thread_id);
    const assistantResponse = threadMessages.data[0].content[0].text.value;

    return assistantResponse;
  } catch (err) {
    console.error('Error processing HTML:', err);
    throw err;
  }
};

// Function to process all items in sequence
const predictCMSBlocks = async () => {
  isLoading.value = true;
  error.value = null;
  blocks.value = []; // Reset the results array

  let sections = getSectionsFromPrototype()

  try {
    // Process items sequentially to maintain order
    for (const [index, item] of sections.entries()) {
      
      console.log(`Processing item ${index + 1} of ${sections.length}`);
      
      const response = await processHtmlWithAssistant(item.html);

      console.log('Response:', response);
      
      // Add the result in the same index position
      blocks.value.push({
        layout: response['data-block-id']
      });
    }
    
    console.log('Processing complete:', blocks.value);
  } catch (err) {
    error.value = 'Error processing items: ' + err.message;
  } finally {
    isLoading.value = false;
  }
};

/**
 * Get Sections with ID from Prototype
 * --------------------
 */
 function getSectionsFromPrototype() {
    // Create a new DOMParser instance
    const parser = new DOMParser();
    
    // Parse the HTML string into a DOM document
    const doc = parser.parseFromString(recommendationStore.recommendation.prototype, 'text/html');
    
    // Get all section elements
    const elements = doc.getElementsByTagName('section');
    
    // Convert sections to array of strings
    const sections = Array.from(elements).map(element => {
        return {
          id: element.id,
          html: element.outerHTML,
        };
    });
    
    return sections;
}

/**
 * Push to WordPress
 * --------------------
 */
 const createPageInWordPress = async () => {
  const wordpressUrl = 'https://base.bloomcudev.com/wp-json/metrifi/v1/create-page';
  const username = 'admin-base'; // e.g., 'admin'
  const appPassword = 'ZEh4 V0zI Ihxx iJR4 D9RZ dUb3'; // From Application Passwords

  try {
    const response = await axios.post(
      wordpressUrl,
      {
        title: 'New page from MetriFi',
        content: 'This is the page content from MetriFi',
        status: 'publish', // or 'draft'
        acf: {
          content_blocks: blocks.value
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

const updatePageInWordPress = async (pageId, flexibleContent) => {
  const wordpressUrl = `https://base.bloomcudev.com/wp-json/metrifi/v1/update-page${pageId}`;
  const username = 'admin-base';
  const appPassword = 'ZEh4 V0zI Ihxx iJR4 D9RZ dUb3';

  try {
    const response = await axios.post(
      wordpressUrl,
      {
        acf: {
          content_blocks: flexibleContent
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic ' + btoa(`${username}:${appPassword}`)
        }
      }
    );

    console.log('Page flexible content updated successfully!');
    console.log('Updated page data:', response.data);
    return response.data;
  } catch (error) {
    console.log('Failed to update page flexible content');
    console.error('Error:', error.response ? error.response.data : error.message);
    throw error;
  }
};
</script>