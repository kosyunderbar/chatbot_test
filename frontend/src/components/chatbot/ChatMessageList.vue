<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import type { ChatMessage } from '../../types/chat'
import ChatMessageBubble from './ChatMessageBubble.vue'

interface Props {
  messages: ChatMessage[]
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const messageList = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  const scrollContainer = messageList.value?.parentElement
  if (scrollContainer) {
    scrollContainer.scrollTop = scrollContainer.scrollHeight
  }
}

watch(
  () => props.messages.length,
  () => {
    void scrollToBottom()
  },
)
</script>

<template>
  <section class="flex w-full flex-1 min-h-0 flex-col px-4 py-3 sm:px-6 lg:px-8">
    <div class="flex min-h-0 flex-1 flex-col rounded-2xl border border-gray-200 bg-gray-50 p-3 shadow-sm overflow-y-auto">
      <div ref="messageList" class="space-y-3 overflow-wrap-break word-break-break-word whitespace-pre-wrap">
        <ChatMessageBubble v-for="message in messages" :key="message.id" :message="message" />
        <div v-if="isLoading" class="text-sm text-gray-500">답변을 작성하고 있습니다.</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Ensure proper text wrapping and scrolling */
.overflow-wrap-break {
  overflow-wrap: break-word;
}

.word-break-break-word {
  word-break: break-word;
}

.whitespace-pre-wrap {
  white-space: pre-wrap;
}
</style>
