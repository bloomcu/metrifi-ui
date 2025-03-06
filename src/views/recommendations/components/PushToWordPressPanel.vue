<template>
      <template v-if="recommendationStore.isPushToWordPressPanelOpen">
        <div @click="recommendationStore.isPushToWordPressPanelOpen = false" class="fixed inset-0 h-full w-full overflow-y-auto bg-slate-600 bg-opacity-40"></div>

        <div class="fixed right-0 top-0 h-full overflow-y-auto w-96 p-6 transform rounded-l-3xl bg-white shadow-2xl ring-1 ring-gray-900/5 z-50">
            <!-- Tray header -->
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-medium">Push to WordPress</h3>
                <svg @click="recommendationStore.isPushToWordPressPanelOpen = false" class="w-6 h-6 mr-2 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </div>

            <!-- Sections -->
            <div class="text-lg font-medium mb-2">Sections</div>

            <div v-for="sectionId in getSectionIdsFromPrototype()" class="flex flex-col gap-2 border rounded-lg p-2 mb-2">
              <div class="flex justify-between">
                  <div>
                      <p class="font-medium text-gray-900">{{ sectionId }}</p>
                      <!-- <p class="text-sm text-gray-700">For step {{ recommendation.step_index + 1 }}</p> -->
                  </div>
              </div>
            </div>

            <AppButton @click="createPageInWordPress()" variant="primary" size="base" class="flex items-center gap-2 mt-6">
              Push to WordPress
            </AppButton>  
        </div>
    </template>
</template>

<script setup>
import axios from 'axios'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'

const recommendationStore = useRecommendationStore()

// Create a const function
const getSectionIdsFromPrototype = () => {
  // Create a DOMParser instance
  const parser = new DOMParser();

  // Parse the HTML string into a DOM document
  const html = parser.parseFromString(recommendationStore.recommendation.prototype, 'text/html');

  // Get all section elements with an id attribute from the parsed document
  const sectionsWithIds = html.querySelectorAll('section[id]');

  // Extract the id values into an array
  const sectionIds = Array.from(sectionsWithIds).map(section => section.id);

  return sectionIds;
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
          content_blocks: [
            {
              acf_fc_layout: 'hero',
              layout: 'hero',
            },
            {
              acf_fc_layout: 'feature',
              layout: 'feature',
            },
            {
              acf_fc_layout: 'feature',
              layout: 'feature',
            }
          ]
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