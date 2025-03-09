<template>
  <h3 class="text-xl font-medium mb-4">Step 1 - Predict CMS blocks</h3>

  <div class="grid grid-cols-2 gap-4">
    <!-- Left -->
    <div>
      <p class="text-md font-medium mb-2">Prototype sections</p>
      <div v-for="section in getSectionsFromPrototype()" class="border rounded-lg p-2 mb-2">
        <p class="text-gray-900">{{ section.id }}</p>
      </div>
    </div>

    <!-- Right -->
    <div>
      <p class="text-md font-medium mb-2">CMS blocks</p>
      <div v-for="block in wordpressStore.blocks" class="border rounded-lg p-2 mb-2">
        <p v-if="block.error" class="text-red-500">{{ block.error }}</p>
        <p v-else class="text-gray-900">{{ block.acf_fc_layout }}--{{ block.layout }}</p>
      </div>
    </div>
  </div>

  <div class="flex items-center gap-2 mt-6">
    <AppButton v-if="!isLoading" @click="predictCMSBlocks()" variant="secondary" size="base" class="flex items-center gap-2">
      {{ !wordpressStore.blocks ? 'Predict' : 'Re-predict' }} CMS Blocks
    </AppButton>
  </div>

  <div v-if="isLoading" class="mt-4">
  <p>{{ progress }} {{ attempts }}</p>
  <p>{{ status }}</p>
  </div>

  <div v-if="error" class="text-red-500 mb-4">
  {{ error }}
  </div>
</template>

<script setup>
import axios from 'axios'
import OpenAI from 'openai'
import { ref } from 'vue'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useWordPressStore } from '@/domain/wordpress/store/useWordPressStore'

const recommendationStore = useRecommendationStore()
const wordpressStore = useWordPressStore()

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
})

const isLoading = ref(false);
const attempts = ref('');
const progress = ref('');
const status = ref('');
const error = ref(null);

// Function to wait for a run to complete
const waitForRunComplete = async (threadId, runId, maxAttempts = 60, delayMs = 1000) => {
  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
    
    status.value = `Thread status check ${attempts + 1}/${maxAttempts} (${runStatus.status})`
    
    if (runStatus.status === 'completed') {
      return runStatus;
    }
    
    if (['failed', 'cancelled', 'expired'].includes(runStatus.status)) {
      throw new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message || 'Unknown error'}`);
    }

    // Wait before the next check
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  
  throw new Error(`Run timed out after ${maxAttempts * delayMs / 1000} seconds`);
};

// Function to process HTML and get layout type from OpenAI assistant
const processHtmlWithAssistant = async (htmlContent, retries = 6) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      attempts.value = `(attempt ${attempt}/${retries})`
      
      // Create a thread and start a run
      const run = await openai.beta.threads.createAndRun({
        assistant_id: 'asst_jjPmiRkOknWPAYxPdyfQLpvJ',
        thread: {
          messages: [
            {
              role: 'user',
              content: htmlContent
            }
          ]
        }
      });

      // Wait for the run to complete (increased timeout to 60 seconds)
      await waitForRunComplete(run.thread_id, run.id, 60, 1000);

      // Get the messages from the thread
      const threadMessages = await openai.beta.threads.messages.list(run.thread_id);
      
      // Find the latest assistant message
      const assistantMessage = threadMessages.data
        .filter(msg => msg.role === 'assistant')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      
      if (!assistantMessage) {
        throw new Error('No assistant response found');
      }

      const assistantResponse = assistantMessage.content[0].text.value;
      
      // Parse the response if it's JSON, otherwise return the raw text
      try {
        const parsedResponse = JSON.parse(assistantResponse);
        return parsedResponse;
      } catch {
        return { 'data-block-id': assistantResponse };
      }
    } catch (err) {
      console.error(`Error on attempt ${attempt}:`, err);
      if (attempt === retries) {
        throw err; // If this was the last attempt, throw the error
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
};

// Function to process all items in sequence
const predictCMSBlocks = async () => {
  isLoading.value = true;
  error.value = null;
  wordpressStore.blocks = []; // Reset the results array

  let sections = getSectionsFromPrototype();

  try {
    // Process items sequentially to maintain order
    for (const [index, item] of sections.entries()) {
      progress.value = `Predicting block ${index + 1} of ${sections.length}`;
      
      try {
        const response = await processHtmlWithAssistant(item.html);
        
        let splitResponse = response['data-block-id'].split('--');
        
        wordpressStore.blocks.push({
          acf_fc_layout: splitResponse[0],
          layout: splitResponse[1],
          html: item.html,
        });
      } catch (err) {
        console.error(`Failed to process item ${index + 1}:`, err);
        // Instead of throwing, add an error object to blocks
        wordpressStore.blocks.push({
          error: `Failed to process: ${err.message}`
        });
      }

      // Optional: Add a delay between requests to avoid rate limiting
      if (index < sections.length - 1) {
        console.log('Waiting 1 second before next request...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('Processing complete:', wordpressStore.blocks);
  } catch (err) {
    // This catch block is now redundant since we're handling errors per item,
    // but we'll keep it to set a general error message if needed
    error.value = 'Some items failed to process. See details in the CMS blocks section.';
    console.error('Full error:', err);
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
  const username = 'admin-base';
  const appPassword = 'ZEh4 V0zI Ihxx iJR4 D9RZ dUb3';

  console.log('content_blocks:', blocks.value);

  try {
    const response = await axios.post(
      wordpressUrl,
      {
        title: 'New page from MetriFi',
        content: 'This is the page content from MetriFi',
        status: 'publish',
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

// const updatePageInWordPress = async (pageId, flexibleContent) => {
//   const wordpressUrl = `https://base.bloomcudev.com/wp-json/metrifi/v1/update-page${pageId}`;
//   const username = 'admin-base';
//   const appPassword = 'ZEh4 V0zI Ihxx iJR4 D9RZ dUb3';

//   try {
//     const response = await axios.post(
//       wordpressUrl,
//       {
//         acf: {
//           content_blocks: flexibleContent
//         }
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: 'Basic ' + btoa(`${username}:${appPassword}`)
//         }
//       }
//     );

//     console.log('Page flexible content updated successfully!');
//     console.log('Updated page data:', response.data);
//     return response.data;
//   } catch (error) {
//     console.log('Failed to update page flexible content');
//     console.error('Error:', error.response ? error.response.data : error.message);
//     throw error;
//   }
// };

</script>