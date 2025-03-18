import { defineStore, acceptHMRUpdate } from 'pinia'
import { blocksApi } from '@/domain/blocks/api/blocksApi'
import wordpressBlockSchemas from '@/domain/wordpress/store/wordpressBlockSchemas.js'
import OpenAI from 'openai'
import { wordPressApi } from '@/domain/wordpress/api/wordPressApi.js'

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

// const grok = new OpenAI({
//     apiKey: import.meta.env.VITE_GROK_API_KEY,
//     baseURL: "https://api.x.ai/v1",
//     dangerouslyAllowBrowser: true,
// })

export const useWordPressStore = defineStore('wordpressStore', {
  state: () => ({
    blocks: [],
    isDeploying: false,
    isLoading: false,
    attempts: '',
    progress: '',
    status: '',
    error: null,
    wordpressPageUrl: null
  }),

  actions: {
    async predictCMSBlocks() {
        this.error = null
        this.wordpressPageUrl = null
        this.isDeploying = true;
      try {
        // Process all blocks simultaneously using Promise.all
        const blockPromises = this.blocks.map(async (block, index) => {
          block.status = 'Matching block';
          
          try {
            const predictedCMSBlockCategory = await this.predictCMSBlockWithAssistant(block.html);
            block.status = null;

            // Update the block wordpress_category in the database
            blocksApi.update(
                block.organization.slug,
                block.id,
                { wordpress_category:  predictedCMSBlockCategory['data-block-id'] }
            )

            // Split the wordpress category into acf_fc_layout and layout
            let splitCategory = predictedCMSBlockCategory['data-block-id'].split('--');
            block.acf_fc_layout = splitCategory[0];
            block.layout = splitCategory[1];

            this.writeBlockContent(block)
            
            return { success: true, block };
          } catch (err) {
            console.error(`Failed to process block ${index + 1}:`, err);
            
            block.error = `Failed to process: ${err.message}`;
            block.status = null;
            
            return { success: false, block, error: err };
          }
        });
        
        // Wait for all promises to resolve
        const results = await Promise.all(blockPromises);
        
        // Check if any blocks failed
        const failedBlocks = results.filter(result => !result.success);
        if (failedBlocks.length > 0) {
          console.warn(`${failedBlocks.length} blocks failed to process.`);
          this.error = 'Some blocks failed to match.';
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
          console.error(`Error on attempt ${attempt}:`, err);
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
      
      throw new Error(`Run timed out after ${maxAttempts * delayMs / 1000} seconds`);
    },

    async getBlockSchema(block) {
        // Find the schema object that matches the block's acf_fc_layout
        const matchingSchema = wordpressBlockSchemas.find(
          schema => schema.acf_fc_layout === block.acf_fc_layout
        );
        
        // Set block.schema to the matching schema or undefined if not found
        block.schema = matchingSchema;
        
        // If no schema is found, set the error message
        if (!matchingSchema) {
          block.error = 'Could not find matching WordPress schema';
        }

        return
    },

    async writeBlockContent(block) {
        block.status = 'Writing content'
        
        await this.getBlockSchema(block)

        try {
          const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
              { 
                role: "system", 
                content: "You are an expert at writing content in a json object. I am requesting content for a block. I will provide the html of a block and the json schema I need the content written in. " +
                        "IMPORTANT: Don't fill in gaps in the content. That's not your job. You only job is to delete placeholder content and transfer existing content. Don't do anything else." +
                        "IMPORTANT: Your response MUST be pure JSON without any markdown wrappers, code blocks, or additional text. Do NOT wrap the response in \`\`\`json ... \`\`\` or any other markdown. Provide only the JSON object as plain text."
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
            JSON.parse(content);
            block.schema_with_content = content;
          } catch (jsonError) {
            // If it's not valid JSON, try to clean it up
            console.warn('Received invalid JSON from OpenAi, attempting to clean:', jsonError);
            
            // Remove any markdown code block indicators if present
            if (content.startsWith('```json')) {
              content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
            } else if (content.startsWith('```')) {
              content = content.replace(/^```\n/, '').replace(/\n```$/, '');
            }
            
            // Try parsing again after cleaning
            try {
              JSON.parse(content);
              block.schema_with_content = content;
            } catch (secondJsonError) {
              console.error('Failed to clean JSON:', secondJsonError);
              throw new Error('Invalid JSON response from OpenAi');
            }
          }
      
        } catch (error) {
          console.error('Error from OpenAi:', error)
          block.error = `Error writing content: ${error.message}`
      
        } finally {
          block.status = null
        }
    },

    async createPageInWordPress(organizationSlug, pageTitle) {
        this.error = null; // Reset error state before attempting to create page
        this.isDeploying = true; // Set deploying state to true
        
        // Create a new array from blocks.value array where each member 
        // of the new array is an object with only the schema_with_content property
        const blocksWithSchemaWithContent = this.blocks.map(block => {
            try {
                return JSON.parse(block.schema_with_content);
            } catch (error) {
                console.error(`Error parsing JSON for block:`, error);
                console.log('Problematic content:', block.schema_with_content);
                // Return a placeholder or null instead of failing completely
                this.error = `Error parsing block content: ${error.message}`;
                return null;
            }
        }).filter(block => block !== null); // Filter out any blocks that failed to parse
      
        // console.log('blocks:', this.blocks);
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
        this.isDeploying = false;
        this.wordpressPageUrl = response.data.page_url;
        
        return response;
        } catch (error) {
            console.error('Failed to create WordPress page:', error);
            this.error = `Failed to create page in WordPress: ${error.message}`;
            this.isDeploying = false;
            throw error;
        }
        
    }
  },
})
  
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWordPressStore, import.meta.hot))
}