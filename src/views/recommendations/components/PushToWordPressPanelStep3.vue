<template>
  <h3 class="text-xl font-medium mb-4">Step 3 - Write block content</h3>

  <p class="text-lg font-medium mb-2">CMS blocks</p>
  <div v-for="block in wordpressStore.blocks" class="border rounded-lg mb-2">
    <p v-if="block.error" class="text-red-500  p-2">{{ block.error }}</p>
    <div v-else>
      <div class="text-gray-900 p-2">{{ block.acf_fc_layout }}--{{ block.layout }}</div>
      <p v-if="block.schema_with_content" class="text-gray-500 text-sm border-t line-clamp-3 pt-2 px-2 pb-1">{{ block.schema_with_content }}</p>
    </div>
  </div>

  <div class="flex items-center gap-2 mt-6">
    <AppButton @click="writeContentForAllBlocks()" variant="secondary" size="base" class="flex items-center gap-2">
      Write block content
    </AppButton>
  </div>

  <div v-if="isLoading" class="mt-4">
    <!-- Loading indicator -->
  </div>

  <div v-if="error" class="text-red-500 mb-4">
    {{ error }}
  </div>
</template>

<script setup>
import OpenAI from 'openai'
import { useWordPressStore } from '@/domain/wordpress/store/useWordPressStore'

const wordpressStore = useWordPressStore()

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
  dangerouslyAllowBrowser: true,
})

const writeContentForAllBlocks = () => {
  wordpressStore.blocks.forEach(block => {
    writeBlockContent(block)
  })
}

const writeBlockContent = async (block) => {
  block.isWritingContent = true

  try {
    const response = await openai.chat.completions.create({
      model: "grok-beta",
      messages: [
        { 
          role: "system", 
          content: "You are an expert at writing content in a json object. I am requesting content for a block. I will provide the html of a block and the json schema I need the content written in."
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
</script>