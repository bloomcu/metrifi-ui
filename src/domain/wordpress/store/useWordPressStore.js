import { defineStore, acceptHMRUpdate } from 'pinia'
import { blocksApi } from '@/domain/blocks/api/blocksApi'
import wordpressBlockSchemas from '@/domain/wordpress/store/wordpressBlockSchemas.js'
import { wordPressApi } from '@/domain/wordpress/api/wordPressApi.js'
import * as Sentry from '@sentry/vue'

export const useWordPressStore = defineStore('wordpressStore', {
  state: () => ({
    blocks: [],
    isDeploying: false,
    isLoading: false,
    attempts: '',
    progress: '',
    status: '',
    error: null,
    selectedBlock: null,
    wordpressPageUrl: null
  }),

  actions: {
    async predictCMSBlocks() {
        this.error = null
        this.wordpressPageUrl = null
        this.isDeploying = true;

        try {
        // Reset any existing retry counts for blocks
        this.blocks.forEach(block => {
          block.schemaRetryCount = 0;
          block.status = null;
          block.error = null;
          block.type = null;
          block.layout = null;
          block.wordpress_category = null;
        });
        
        // Process all blocks simultaneously using Promise.all
        const blockPromises = this.blocks.map(async (block, index) => {
          if (block.error) {
            return;
          }

          block.status = 'Matching block';
          
          try {
            const predictedCMSBlockCategory = await this.predictCMSBlockWithAssistant(block);
            block.status = null;

            // Split the wordpress category into acf_fc_layout and layout
            let splitBlockId = predictedCMSBlockCategory['data-block-id'].split('--');
            block.type = splitBlockId[0];
            block.layout = splitBlockId[1];

            // Update the block type and layout in the database
            blocksApi.update(
                block.organization.slug,
                block.id,
                { 
                    type: splitBlockId[0], 
                    layout: splitBlockId[1], 
                    wordpress_category: predictedCMSBlockCategory['data-block-id'] 
                }
            )

            this.writeBlockContent(block)
            
            return { success: true, block };
          } catch (err) {
            console.log('Assistant failed to predict CMS block type:', err);
            Sentry.captureException('Assistant failed to predict CMS block type:', err);
            
            block.error = `Assistant failed to predict CMS block type.`;
            block.status = null;

            blocksApi.update(
                block.organization.slug,
                block.id,
                { status: block.status, error: block.error }
            )
            
            return { success: false, block, error: err };
          }
        });
        
        // Wait for all promises to resolve
        const results = await Promise.all(blockPromises);
        
        // Check if any blocks failed
        const failedBlocks = results.filter(result => !result.success);
        if (failedBlocks.length > 0) {
          console.warn(`${failedBlocks.length} blocks failed to process.`);
        //   this.error = 'Some blocks failed to match.';
        }
        
        console.log('Matching CMS blocks complete:', this.blocks);
      } catch (err) {
        this.error = 'An unexpected error occurred while matching CMS blocks.';
        console.error('Full error:', err);
      } finally {
        this.isLoading = false;
      }
    },

    // Predict the CMS block category via the server-side proxy (OpenAI assistant)
    async predictCMSBlockWithAssistant(block, retries = 5) {
      if (!this.constructor.hasCalledBefore) {
        this.constructor.hasCalledBefore = true;
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          this.attempts = `(attempt ${attempt}/${retries})`

          if (attempt === 1) {
            block.status = 'Matching block';
          } else {
            block.status = `Retrying match (${attempt}/${retries})`;
          }

          const response = await blocksApi.predictCategory(
            block.organization.slug,
            block.id
          );

          return response.data;
        } catch (err) {
          console.log(`Assistant failed to predict CMS on attempt ${attempt}:`, err);
          if (attempt === retries) {
            throw err;
          }
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    },

    async getBlockSchema(block) {
        // Find the schema object that matches the block's type to a schema's acf_fc_layout
        const matchingSchema = wordpressBlockSchemas.find(
          schema => schema.acf_fc_layout === block.type && schema.layout === block.layout
        );

        // Set block.schema to the matching schema or undefined if not found
        block.schema = matchingSchema;
        block.schema.layout = block.layout;
        
        // If no schema is found, retry with predictCMSBlockWithAssistant up to 2 more times
        if (!matchingSchema) {
          // Initialize retry count if it doesn't exist
          block.schemaRetryCount = block.schemaRetryCount || 0;
          
          // Only retry if we haven't already tried twice
          if (block.schemaRetryCount < 2) {
            block.schemaRetryCount++;
            console.log(`No matching schema found for block. Retry attempt ${block.schemaRetryCount}/2`);
            Sentry.captureException(`No matching schema found for block. Retry attempt ${block.schemaRetryCount}/2`);
            
            try {
              // Update status to show we're retrying
              block.status = `Retrying match (${block.schemaRetryCount}/2)`;
              
              // Retry prediction with the assistant
              const predictedCMSBlockCategory = await this.predictCMSBlockWithAssistant(block);
              
              // Split the wordpress category into acf_fc_layout and layout
              let splitBlockId = predictedCMSBlockCategory['data-block-id'].split('--');
              block.type = splitBlockId[0];
              block.layout = splitBlockId[1];
              
              // Try to get the schema again with the new acf_fc_layout
              return await this.getBlockSchema(block);
            } catch (err) {
              console.log(`Failed to retry block schema matching (attempt ${block.schemaRetryCount}):`, err);
              Sentry.captureException(`Failed to retry block schema matching (attempt ${block.schemaRetryCount}):`, err)
              block.status = null;
              
              // If we've exhausted all retries, set the error message
              if (block.schemaRetryCount >= 2) {
                block.error = 'Could not find matching WordPress schema after multiple attempts';
              }
            }
          } else {
            // We've already retried twice, set the error message
            block.error = 'Could not find matching WordPress schema after multiple attempts';
          }
        }

        return
    },

    async writeBlockContent(block) {
        // Only set status if it's not already in a retry state
        if (!block.status || !block.status.includes('Retrying match')) {
            block.status = 'Writing content'
            block.schema_with_content = null // Empty out any existing content
        }
        
        await this.getBlockSchema(block)

        // If we still don't have a schema after retries, don't proceed with content writing
        if (!block.schema) {
            block.status = null;
            return;
        }

        try {
          const response = await blocksApi.writeContent(
            block.organization.slug,
            block.id,
            block.schema
          )

          block.schema_with_content = response.data.schema_with_content
          block.schema_with_content.acf_fc_layout = block.type
          block.schema_with_content.layout = block.layout
        } catch (error) {
          console.error('OpenAi error writing block content:', error)
          Sentry.captureException('OpenAi error writing block content:', error)
          block.error = `OpenAi error writing block content: ${error.message}`
        } finally {
          block.status = null
        }
    },

    async createPageInWordPress(organizationSlug, pageTitle) {
        this.isLoading = true;
        this.error = null; // Reset error state before attempting to create page
        this.isDeploying = true; // Set deploying state to true
        
        // Create a new array from blocks.value array where each member 
        // of the new array is an object with only the schema_with_content property
        const blocksWithSchemaWithContent = this.blocks.map(block => {
            try {
                return block.schema_with_content;
            } catch (e) {
                console.log('Problematic content:', block.schema_with_content);
                return null;// Return null instead of failing completely
            }
        }).filter(block => block !== null); // Filter out any blocks that failed to parse
      
        // console.log('blocksWithSchemaWithContent:', blocksWithSchemaWithContent);
      
        if (blocksWithSchemaWithContent.length === 0) {
            this.error = 'No valid blocks to send to WordPress';
            this.isDeploying = false;
            return;
        }
      
        try {
        // Prepare data to send to WordPress
        const pageData = {
            title: pageTitle,
            blocks: blocksWithSchemaWithContent
        };
        
        // Call WordPress API to create the page
        const response = await wordPressApi.storePage(organizationSlug, pageData);
        
        // Update state
        this.isLoading = false;
        this.isDeploying = false;
        this.wordpressPageUrl = response.data.page_url;
        
        return response;
        } catch (error) {
            console.error('Failed to create WordPress page:', error);
            
            // Extract the specific error message from the response if available
            if (error.response && error.response.data && error.response.data.error) {
                // Use the specific error message from the Laravel backend
                this.error = error.response.data.error;
            } else if (error.response && error.response.data && error.response.data.message) {
                // Fallback to the message if error field is not available
                this.error = error.response.data.message;
            } else {
                // Default generic error message with the JavaScript error
                this.error = `Failed to create page in WordPress: ${error.message}`;
            }
            
            this.isLoading = false;
            this.isDeploying = false;
            throw error;
        }
        
    }
  },
})
  
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWordPressStore, import.meta.hot))
}