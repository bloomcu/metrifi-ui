<template>
  <div class="h-[calc(100vh-200px)] flex flex-col">
    <!-- Instructions -->
    <div v-if="!recommendationStore.selectedBlock" class="p-4 bg-white rounded-md border">
      <p class="text-sm mb-1 text-gray-700 font-medium">How to use the AI editor</p>
      <p class="text-sm text-gray-500">Click on the part of the page you want to change, then enter your request below.</p>
    </div>

    <!-- Chat Messages -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100 scrollbar-thumb-rounded">
      <div v-for="(message, index) in messages" :key="index" 
          :class="[message.role === 'user' ? 'ml-auto' : 'mr-auto', 'chat-message transition-all duration-200 ease-in-out hover:opacity-90']" 
          class="max-w-[70%]">
        <div :class="message.role === 'user' ? 'bg-violet-100' : 'bg-gray-100'" 
            class="rounded-lg p-3 overflow-hidden">
          <p class="text-sm">{{ message.content }}</p>
          <!-- Attached Element (singular) -->
          <div v-if="message.element" class="mt-2 space-y-2">
            <div class="flex items-center gap-2 bg-white border shadow-sm p-2 rounded w-full">
              <div class="h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 px-2">
                <span class="text-xs ">{{ message.element.type }}</span>
              </div>
              <span class="text-xs truncate flex-1">{{ message.element.html }}</span>
            </div>
          </div>
        </div>
        <span class="text-xs text-gray-500 block mt-1">
          {{ message.timestamp }}
        </span>
      </div>
    </div>

    <!-- Current Attachment (singular) -->
    <div v-if="recommendationStore.selectedBlock" class="mb-2 space-y-2 px-4">
      <div class="flex items-center gap-2 bg-white border shadow-sm p-2 pr-3 rounded-md w-full">
        <div class="h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 px-2">
            <span class="text-xs ">{{ recommendationStore.selectedBlock.type }}</span>
        </div>
        <span class="text-xs truncate flex-1">{{ recommendationStore.selectedBlock.html }}</span>
        <button 
          @click="recommendationStore.selectedBlock = null" 
          class="text-red-500 bg-red-100 hover:bg-red-200 p-1 rounded-full transition-colors duration-200 flex items-center justify-center w-6 h-6"
          title="Remove attachment"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Input Area -->
    <div class="flex gap-2 px-4">
      <input
        v-model="newMessage"
        @keydown.enter.prevent="sendMessage"
        placeholder="Request changes to the prototype"
        class="flex-1 p-2 text-sm border border-gray-300 rounded-lg resize-none h-12 focus:outline-none focus:ring-1 focus:ring-violet-400"
        :disabled="isSending"
      />
      <button 
        @click="sendMessage"
        :disabled="!newMessage.trim() || isSending"
        class="px-4 py-2 bg-violet-500 text-white rounded-lg disabled:bg-gray-300 relative"
      >
        <span v-if="isSending" class="flex items-center gap-2">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Working...
        </span>
        <span v-else>Send</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import OpenAI from 'openai'
import { ref, reactive, nextTick } from 'vue'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useRoute } from 'vue-router'
import { blocksApi } from '@/domain/blocks/api/blocksApi'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
  dangerouslyAllowBrowser: true,
})

const route = useRoute()
const recommendationStore = useRecommendationStore()

const messagesContainer = ref(null) // Reference to messages container
const isSending = ref(false)
const messages = reactive([])
const newMessage = ref('')

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  isSending.value = true

  const userMessage = {
    role: 'user',
    content: newMessage.value,
    element: recommendationStore.selectedBlock,
    timestamp: new Date().toLocaleTimeString()
  }
  messages.push(userMessage)
  scrollToBottom() // Scroll when user message is added

  let accumulatedHtml = ''
  let assistantMessage = null

  try {
    const stream = await openai.chat.completions.create({
      model: "grok-beta",
      messages: [
        { 
          role: "system", 
          content: "You are a coding expert. I am requesting changes to an HTML element (a section). " +
            "Modify the provided element_to_be_changed_in_the_prototype based on the user's request. " +
            "Stream back ONLY the updated element as a raw HTML string. " +
            "Do NOT wrap the output in Markdown, code blocks (like ```html), JSON, objects, or any other formatting. " +
            "Stream ONLY the raw HTML string of the modified element."
        },
        { 
          role: "user",
          content: JSON.stringify({
            message: newMessage.value,
            element_to_be_changed_in_the_prototype: recommendationStore.selectedBlock?.html || null
          })
        }
      ],
      stream: true
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0].delta.content
      if (content) {
        accumulatedHtml += content

        if (!assistantMessage) {
          assistantMessage = {
            role: 'assistant',
            content: accumulatedHtml || 'Processing your request...',
            timestamp: new Date().toLocaleTimeString()
          }
          messages.push(assistantMessage)
        } else {
          assistantMessage.content = accumulatedHtml
          messages[messages.length - 1] = { ...assistantMessage }
        }
        scrollToBottom() // Scroll on each stream update
      }
    }

    // Clean the HTML and remove the highlight-element class
    const cleanedHtml = accumulatedHtml.replace(/```html\s*|\s*```/g, '').trim()

    // Update the selectedBlock's html property directly
    recommendationStore.selectedBlock.html = cleanedHtml
    
    // Update the block in the backend
    await blocksApi.update(
      route.params.organization,
      recommendationStore.selectedBlock.id,
      { html: cleanedHtml }
    )

  } catch (error) {
    console.error('Error streaming from Grok:', error)
    messages.push({
      role: 'assistant',
      content: `Error processing request: ${error.message}`,
      timestamp: new Date().toLocaleTimeString()
    })
    scrollToBottom() // Scroll for error message
  } finally {
    isSending.value = false
    newMessage.value = ''
    recommendationStore.selectedBlock = null
    scrollToBottom() // Final scroll
  }
}
</script>