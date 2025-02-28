<template>
  <div class="h-[calc(100vh-200px)] flex flex-col">
    <!-- Chat Messages -->
    <div class="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-100 scrollbar-thumb-rounded">
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
                <span class="text-xs">{{ message.element.tag }}</span>
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
    <div v-if="recommendationStore.clickedElement" class="mb-2 space-y-2 px-4">
      <div class="flex items-center gap-2 bg-white border shadow-sm p-2 rounded w-full">
        <div class="h-8 bg-gray-200 rounded flex items-center justify-center flex-shrink-0 px-2">
          <span class="text-xs">{{ recommendationStore.clickedElement.tag }}</span>
        </div>
        <span class="text-xs truncate flex-1">{{ recommendationStore.clickedElement.html }}</span>
        <button 
          @click="removeElement" 
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
      <textarea
        v-model="newMessage"
        @keydown.enter.prevent="sendMessage"
        placeholder="Request changes to the prototype"
        class="flex-1 p-2 border border-gray-300 rounded resize-none h-12 focus:outline-none focus:ring-2 focus:ring-violet-500"
        :disabled="isSending"
      ></textarea>
      <button 
        @click="sendMessage"
        :disabled="!newMessage.trim() || isSending"
        class="px-4 py-2 bg-violet-500 text-white rounded disabled:bg-gray-300 relative"
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
import { ref, reactive } from 'vue'
import OpenAI from 'openai'
import { useRecommendationStore } from '@/domain/recommendations/store/useRecommendationStore'
import { useRoute } from 'vue-router'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
  dangerouslyAllowBrowser: true,
})

const route = useRoute()
const recommendationStore = useRecommendationStore()

const isSending = ref(false)
const messages = reactive([])
const newMessage = ref('')

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  isSending.value = true

  const userMessage = {
    role: 'user',
    content: newMessage.value,
    element: recommendationStore.clickedElement,
    timestamp: new Date().toLocaleTimeString()
  }
  messages.push(userMessage)

  let accumulatedHtml = ''
  let assistantMessage = null
  let originalPrototype = recommendationStore.recommendation.prototype || ''
  let lastValidPrototype = originalPrototype

  try {
    const stream = await openai.chat.completions.create({
      model: "grok-beta",
      messages: [
        { 
          role: "system", 
          content: "You are a coding expert. I am requesting changes to an HTML element (a div or section). " +
            "Modify the provided element_to_be_changed_in_the_prototype based on the user's request. " +
            "Stream back ONLY the updated element as a raw HTML string. " +
            "Do NOT wrap the output in Markdown, code blocks (like ```html), JSON, objects, or any other formatting. " +
            "Stream ONLY the raw HTML string of the modified element."
        },
        { 
          role: "user",
          content: JSON.stringify({
            message: newMessage.value,
            element_to_be_changed_in_the_prototype: recommendationStore.clickedElement?.html || null
          })
        }
      ],
      stream: true
    })

    function replaceElementByStringIndex(htmlString, newElement, index) {
      const elementRegex = /<(div|section)[^>]*>[\s\S]*?<\/\1>/gi;
      let elements = [];
      let match;

      while ((match = elementRegex.exec(htmlString)) !== null) {
        elements.push({
          content: match[0],
          start: match.index,
          end: elementRegex.lastIndex
        });
      }

      if (index < 0 || index >= elements.length) {
        console.error('Invalid element index:', index, 'Elements found:', elements.length);
        return htmlString;
      }

      const elementToReplace = elements[index];
      return (
        htmlString.substring(0, elementToReplace.start) +
        newElement +
        htmlString.substring(elementToReplace.end)
      );
    }

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
      }
    }

    // Clean the HTML and remove the highlight-element class
    const cleanedHtml = accumulatedHtml.replace(/```html\s*|\s*```/g, '').trim()
    const withoutHighlight = cleanedHtml.replace(/class=["']([^"']*)\bhighlight-element\b([^"']*)["']/i, (match, before, after) => {
      const newClass = `${before || ''}${after || ''}`.trim();
      return newClass ? `class="${newClass}"` : '';
    }).replace(/class=["']\s*["']/g, ''); // Remove empty class attributes

    // Update the prototype with the cleaned HTML
    lastValidPrototype = replaceElementByStringIndex(
      originalPrototype,
      withoutHighlight,
      recommendationStore.clickedElement?.index || 0
    )
    recommendationStore.recommendation.prototype = lastValidPrototype
    recommendationStore.recommendation = { ...recommendationStore.recommendation }

    await recommendationStore.update(
      route.params.organization,
      route.params.dashboard,
      route.params.recommendation,
      { prototype: lastValidPrototype }
    )

    recommendationStore.clearClickedElement()

  } catch (error) {
    console.error('Error streaming from Grok:', error)
    messages.push({
      role: 'assistant',
      content: `Error processing request: ${error.message}`,
      timestamp: new Date().toLocaleTimeString()
    })
    recommendationStore.recommendation.prototype = lastValidPrototype
  } finally {
    isSending.value = false
    newMessage.value = ''
    recommendationStore.clearClickedElement()
  }
}

const removeElement = () => { // Updated to handle single element
  recommendationStore.setClickedElement(null) // Updated to singular
}
</script>