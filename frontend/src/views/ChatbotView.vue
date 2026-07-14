<script setup lang="ts">
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ChatHeader from '../components/chatbot/ChatHeader.vue'
import ChatInput from '../components/chatbot/ChatInput.vue'
import ChatMessageList from '../components/chatbot/ChatMessageList.vue'
import ChatSuggestionList from '../components/chatbot/ChatSuggestionList.vue'
import { useChatStore } from '../stores/chatStore'

const chatStore = useChatStore()
const { messages, suggestions, inputMessage, isLoading } = storeToRefs(chatStore)

onMounted(async () => {
  await chatStore.initializeChat()
})
</script>

<template>
  <main class="flex min-h-[calc(100vh-4rem)] flex-col bg-gray-50 py-2">
    <ChatHeader />
    <ChatSuggestionList :suggestions="suggestions" @select="chatStore.selectSuggestion($event)" />
    <ChatMessageList :messages="messages" :is-loading="isLoading" />
    <ChatInput
      :model-value="inputMessage"
      :loading="isLoading"
      @update:model-value="chatStore.setInputMessage($event)"
      @submit="chatStore.sendMessage()"
    />
  </main>
</template>
