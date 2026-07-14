<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue'
import ChatWidget from './components/chatbot/ChatWidget.vue'
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>

  <ChatWidget />
</template>
