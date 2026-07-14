<script setup lang="ts">
import ChatMessageBubble from './ChatMessageBubble.vue'

const messages: Array<{ role: 'user' | 'assistant'; text: string }> = [
  { role: 'assistant', text: '안녕하세요! 어떤 여행 정보를 찾고 계신가요?' },
  { role: 'user', text: '서울 야경 명소 추천해줘' },
  { role: 'assistant', text: '남산타워, 한강공원, 청계천 야경이 인기가 많습니다.' },
]
</script>

<template>
  <section class="mx-auto w-full max-w-5xl flex-1 px-4 py-4 sm:px-6 lg:px-8">
    <div class="flex h-full flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm">
      <div class="flex-1 space-y-3 overflow-y-auto">
        <ChatMessageBubble v-for="(message, index) in messages" :key="index" :role="message.role" :text="message.text" />
      </div>
    </div>
  </section>
</template>
