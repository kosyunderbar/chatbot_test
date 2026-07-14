<script setup lang="ts">
import type { ChatMessage } from '../../types/chat'

interface Props {
  message: ChatMessage
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex" :class="props.message.role === 'user' ? 'justify-end' : 'justify-start'">
    <div class="max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm break-words whitespace-pre-wrap" :class="props.message.role === 'user' ? 'bg-sky-600 text-white' : 'bg-white text-gray-700 border border-gray-200'">
      <div>{{ props.message.content }}</div>
      <div class="mt-2 text-[11px] opacity-70">{{ props.message.createdAt }}</div>
    </div>
  </div>
</template>
