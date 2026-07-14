<script setup lang="ts">
import ChatHeader from '../components/chatbot/ChatHeader.vue'
import ChatInput from '../components/chatbot/ChatInput.vue'
import ChatMessageList from '../components/chatbot/ChatMessageList.vue'
import ChatSuggestionList from '../components/chatbot/ChatSuggestionList.vue'
</script>

<template>
  <main class="flex min-h-[calc(100vh-4rem)] flex-col bg-gray-50 py-2">
    <ChatHeader />
    <ChatSuggestionList />
    <ChatMessageList />
    <ChatInput />
  </main>
</template>
