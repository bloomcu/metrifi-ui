import { defineStore, acceptHMRUpdate } from 'pinia'
import wordpressBlockSchemas from '@/domain/wordpress/store/wordpressBlockSchemas.js'
import OpenAI from 'openai'
import axios from 'axios'

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

const grok = new OpenAI({
    apiKey: import.meta.env.VITE_GROK_API_KEY,
    baseURL: "https://api.x.ai/v1",
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
    wordpressPageUrl: null
  }),

  actions: {
    async predictCMSBlocks() {
        this.error = null
        this.wordpressPageUrl = null
      try {
        // Process all blocks simultaneously using Promise.all
        const blockPromises = this.blocks.map(async (block, index) => {
          block.status = 'Matching block';
          
          try {
            const response = await this.predictCMSBlockWithAssistant(block.html);
            
            let splitResponse = response['data-block-id'].split('--');
            
            block.acf_fc_layout = splitResponse[0];
            block.layout = splitResponse[1];
            block.status = null;

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
    async predictCMSBlockWithAssistant(htmlContent, retries = 6) {
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
          const response = await grok.chat.completions.create({
            model: "grok-beta",
            messages: [
              { 
                role: "system", 
                content: "You are an expert at writing content in a json object. I am requesting content for a block. I will provide the html of a block and the json schema I need the content written in. " +
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
            console.warn('Received invalid JSON from Grok, attempting to clean:', jsonError);
            
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
              throw new Error('Invalid JSON response from Grok');
            }
          }
      
        } catch (error) {
          console.error('Error from Grok:', error)
          block.error = `Error writing content: ${error.message}`
      
        } finally {
          block.status = null
        }
    },

    async createPageInWordPress(pageTitle) {
        this.error = null; // Reset error state before attempting to create page
        this.isDeploying = true; // Set deploying state to true
        
        const wordpressUrl = 'https://base.bloomcudev.com/wp-json/metrifi/v1/create-page';
        const username = 'admin-base';
        const appPassword = 'ZEh4 V0zI Ihxx iJR4 D9RZ dUb3';
        
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
      
        console.log('blocks:', this.blocks);
        console.log('blocksWithSchemaWithContent:', blocksWithSchemaWithContent);
      
        if (blocksWithSchemaWithContent.length === 0) {
            this.error = 'No valid blocks to send to WordPress';
            this.isDeploying = false;
            return;
        }
      
        try {
          const response = await axios.post(wordpressUrl,
            {
              title: pageTitle + ' - ' + new Date().toISOString().split('T')[0],
              status: 'publish',
              acf: {
                content_blocks: blocksWithSchemaWithContent
              }
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Basic ' + btoa(`${username}:${appPassword}`)
              },
              timeout: 30000 // 30 second timeout
            }
          );

          if (!response.data || !response.data.link) {
            throw new Error('WordPress API returned an invalid response (missing page link)');
          }

          this.wordpressPageUrl = response.data.link
      
          console.log('Post created successfully!');
          console.log('Post data:', response.data);
        } catch (error) {
          console.log('Failed to create post');
          console.error('Error:', error.response ? error.response.data : error.message);
          
          // Store the error in the store's error state
          if (error.code === 'ECONNABORTED') {
            this.error = 'Connection timeout: WordPress server took too long to respond. Please try again later.';
          } else if (error.code === 'ERR_NETWORK') {
            this.error = 'Network error: Unable to connect to WordPress. Please check your internet connection and try again.';
          } else if (error.response) {
            // Server responded with an error status code
            const statusCode = error.response.status;
            const errorData = error.response.data;
            
            if (statusCode === 401 || statusCode === 403) {
              this.error = 'Authentication error: WordPress credentials are invalid or expired.';
            } else if (statusCode === 404) {
              this.error = 'WordPress API endpoint not found. Please contact support.';
            } else if (statusCode >= 500) {
              this.error = `WordPress server error (${statusCode}): The server encountered an issue. Please try again later.`;
            } else {
              // Get the most specific error message possible
              const errorMessage = errorData?.message || errorData?.error || errorData?.code || error.response.statusText || 'Unknown error';
              this.error = `Failed to create WordPress page: ${errorMessage}`;
            }
          } else {
            // Something happened in setting up the request that triggered an error
            this.error = `Failed to create WordPress page: ${error.message || 'Unknown error'}`;
          }
        } finally {
          // Open the wordpress page in a new tab
          this.isDeploying = false; // Set deploying state back to false
        }
    }
  },
})
  
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWordPressStore, import.meta.hot))
}