<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import AppLayout from './components/layout/AppLayout.vue'
import ChatWidget from './components/chatbot/ChatWidget.vue'
import { startPresence, stopPresence } from './composables/usePresence'

onMounted(startPresence)
onBeforeUnmount(stopPresence)
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>

  <ChatWidget />
</template>
