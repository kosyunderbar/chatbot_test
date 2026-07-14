<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import ChatHeader from './ChatHeader.vue'
import ChatInput from './ChatInput.vue'
import ChatMessageList from './ChatMessageList.vue'
import ChatSuggestionList from './ChatSuggestionList.vue'
import { useChatStore } from '../../stores/chatStore'

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'toggle-fullscreen'): void
  (e: 'resize-start', value: PointerEvent): void
}>()

interface Props {
  isFullscreen?: boolean
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  isFullscreen: false,
  width: 420,
  height: 650,
})

const chatStore = useChatStore()
const { messages, suggestions, inputMessage, isLoading } = storeToRefs(chatStore)

onMounted(async () => {
  await chatStore.initializeChat()
})

const containerStyle = computed(() => ({
  width: '100%',
  height: '100%',
}))
</script>

<template>
  <div class="chat-window relative h-full w-full bg-white" :style="containerStyle">
    <!-- Header -->
    <div class="flex-shrink-0">
      <ChatHeader compact @close="emit('close')" @toggle-fullscreen="emit('toggle-fullscreen')" />
    </div>

    <!-- Message Area with Scrolling -->
    <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ChatSuggestionList :suggestions="suggestions" @select="chatStore.selectSuggestion($event)" />
      <ChatMessageList :messages="messages" :is-loading="isLoading" />
    </div>

    <!-- Input Area -->
    <div class="flex-shrink-0 border-t border-gray-200">
      <ChatInput
        :model-value="inputMessage"
        :loading="isLoading"
        @update:model-value="chatStore.setInputMessage($event)"
        @submit="chatStore.sendMessage()"
      />
    </div>

    <!-- Resize Handle -->
    <div v-if="!props.isFullscreen" class="absolute bottom-2 right-2 h-4 w-4 cursor-nwse-resize rounded-full border border-gray-300 bg-white/90 shadow-sm" title="창 크기 조절" @pointerdown="emit('resize-start', $event)" />
  </div>
</template>

<style scoped>
.chat-window {
  display: flex;
  flex-direction: column;
}
</style>
