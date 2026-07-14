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
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight
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
  <section class="mx-auto w-full max-w-5xl flex-1 px-4 py-4 sm:px-6 lg:px-8">
    <div class="flex h-full flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
      <div ref="messageList" class="flex-1 space-y-3 overflow-y-auto">
        <ChatMessageBubble v-for="message in messages" :key="message.id" :message="message" />
        <div v-if="isLoading" class="text-sm text-gray-500">답변을 작성하고 있습니다.</div>
      </div>
    </div>
  </section>
</template>
