import { defineStore, acceptHMRUpdate } from 'pinia'
import { blocksApi } from '@/domain/blocks/api/blocksApi'
import wordpressBlockSchemas from '@/domain/wordpress/store/wordpressBlockSchemas.js'
import { wordPressApi } from '@/domain/wordpress/api/wordPressApi.js'
import * as Sentry from '@sentry/vue'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

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
            const predictedCMSBlockCategory = await this.predictCMSBlockWithAssistant(block.html);
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

    // Function to process HTML and get layout type from OpenAI assistant
    async predictCMSBlockWithAssistant(htmlContent, retries = 5) {
      // Static variable to track if this is the first call
      if (!this.constructor.hasCalledBefore) {
        this.constructor.hasCalledBefore = true;
      } else {
        // Add a fixed 1-second delay between API calls
        console.log('Rate limiting: waiting 1 second before next API call');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          this.attempts = `(attempt ${attempt}/${retries})`
          
          // Update the block status to show retry attempts
          const block = this.blocks.find(b => b.html === htmlContent);
          if (block) {
            if (attempt === 1) {
              block.status = 'Matching block';
            } else {
              block.status = `Retrying match (${attempt}/${retries})`;
            }
          }
          
          // Create a thread and start a run
          const run = await openai.beta.threads.createAndRun({
            assistant_id: 'asst_jjPmiRkOknWPAYxPdyfQLpvJ', // Match AI component to CMS block v4 (production)
            // assistant_id: 'asst_krcoPvnnz9FqO1g7luVGzrRL', // Match AI component to CMS block v5 (production)
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
          await this.waitForRunComplete(run.thread_id, run.id, 60, 1000);

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
          console.log(`Assistant failed to predict CMS on attempt ${attempt}:`, err);
          if (attempt === retries) {
            throw err; // If this was the last attempt, throw the error
          }
          // Wait before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
    },

    // Function to wait for a run to complete
    async waitForRunComplete(threadId, runId, maxAttempts = 60, delayMs = 1000) {
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const runStatus = await openai.beta.threads.runs.retrieve(threadId, runId);
        
        this.status = `Thread status check ${attempt + 1}/${maxAttempts} (${runStatus.status})`
        
        if (runStatus.status === 'completed') {
          return runStatus;
        }
        
        if (['failed', 'cancelled', 'expired'].includes(runStatus.status)) {
          throw new Error(`Run ${runStatus.status}: ${runStatus.last_error?.message || 'Unknown error'}`);
        }

        // Wait before the next check
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
      
      throw new Error(`Assistant timed out after ${maxAttempts * delayMs / 1000} seconds`);
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
              const predictedCMSBlockCategory = await this.predictCMSBlockWithAssistant(block.html);
              
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
          const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              { 
                role: "system", 
                content: "You are an expert at writing content in a json object. I am requesting content for a block. I will provide the html of a block and the json schema I need the content written in. " +
                        "IMPORTANT: Remove unused keys in the json–these are keys with empty values. Don't fill in gaps in the content. That's not your job. Your only job is to delete placeholder content and transfer existing content." +
                        "IMPORTANT: Never remove the data_source key." +
                        "IMPORTANT: Do not remove image keys." +
                        "IMPORTANT: Do not remove keys that are arrays containing ids." +
                        "IMPORTANT: The \"title key\" is almost always used. The \"sub_title\" key is usually used." +
                        "IMPORTANT: Your response MUST be pure JSON without any markdown wrappers, code blocks, or additional text. Do NOT wrap the response in \`\`\`json ... \`\`\` or any other markdown. Provide only the JSON object as plain text."

                // content: "You are an expert at writing content in a json object. I am requesting content for a block. I will provide the html of a block and the json schema I need the content written in. " +
                //         "IMPORTANT: Do not change the acf_fc_layout or layout properties in the json." +
                //         "IMPORTANT: When you are done writing content, remove properties with empty values except for the acf_fc_layout and layout properties. " +
                //         "IMPORTANT: Your response MUST be pure JSON without any markdown wrappers, code blocks, or additional text. Do NOT wrap the response in \`\`\`json ... \`\`\` or any other markdown. Provide only the JSON object as plain text."
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
      
          // Clean the response to ensure it's valid JSON
          let content = response.choices[0].message.content.trim();
          
          // Try to validate if it's proper JSON
          try {
                let parsedContent = JSON.parse(content);
                block.schema_with_content = parsedContent;
                block.schema_with_content.acf_fc_layout = block.type;
                block.schema_with_content.layout = block.layout;
          } catch (jsonError) {
                // If it's not valid JSON, try to clean it up
                console.log('Received invalid JSON from OpenAi, attempting to clean:', jsonError);
                Sentry.captureException('Received invalid JSON from OpenAi:', jsonError)
                
                // Remove any markdown code block indicators if present
                if (content.startsWith('```json')) {
                content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
                } else if (content.startsWith('```')) {
                content = content.replace(/^```\n/, '').replace(/\n```$/, '');
                }
            
                // Try parsing again after cleaning
                try {
                    let parsedContent = JSON.parse(content);
                    block.schema_with_content = parsedContent;
                    block.schema_with_content.acf_fc_layout = block.type;
                    block.schema_with_content.layout = block.layout;
                } catch (secondJsonError) {
                    console.error('Failed to clean JSON:', secondJsonError);
                    throw new Error('Invalid JSON response from OpenAi');
                }
          }
      
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