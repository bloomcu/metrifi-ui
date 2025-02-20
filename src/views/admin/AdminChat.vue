<template>
  <LayoutAdmin>
    <template #topbar>
      <div class="relative pb-5 sm:pb-0">
        <!-- Title -->
        <div class="md:flex md:items-center md:justify-between">
          <h1 class="text-2xl font-medium leading-6 text-gray-900 tracking-tight">Chat with AB Test Case Studies</h1>
        </div>
      </div>
    </template>
    
    <p class="text-lg text-gray-500">Look at the bottom right corner of the screen.</p>
  </LayoutAdmin>
</template>

<script setup>
import { onMounted } from 'vue'
import LayoutAdmin from '@/app/layouts/LayoutAdmin.vue'

onMounted(() => {
  const scriptId = 'chatbot-widget-script';
  
  // Avoid adding the script multiple times
  if (!document.getElementById(scriptId)) {
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = "https://agent-47572307adb771f5315c-m4n5b.ondigitalocean.app/static/chatbot/widget.js";

    // Add dataset attributes dynamically
    script.dataset.agentId = "e154247b-e7ef-11ef-bf8f-4e013e2ddde4";
    script.dataset.chatbotId = "oAUH1ezvhxqZAXy18QA-Sib2c4aKUame";
    script.dataset.name = "AB Test Case Study Agent Chatbot";
    script.dataset.primaryColor = "#031B4E";
    script.dataset.secondaryColor = "#E5E8ED";
    script.dataset.buttonBackgroundColor = "#0061EB";
    script.dataset.startingMessage = "Hello! How can I help you today?";
    script.dataset.logo = "/static/chatbot/icons/default-agent.svg";

    document.head.appendChild(script);
  }
});
</script>

<style scoped>
#sentry-feedback { display: none; }
</style>