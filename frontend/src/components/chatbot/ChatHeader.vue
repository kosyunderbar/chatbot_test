<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'toggle-fullscreen'): void
}>()

withDefaults(defineProps<{ compact?: boolean }>(), {
  compact: false,
})
</script>

<template>
  <section class="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8" :class="compact ? 'py-2' : 'pt-4'">
    <div class="rounded-2xl border border-sky-100 bg-sky-50 shadow-sm" :class="compact ? 'p-3' : 'p-4'">
      <div class="flex items-start justify-between gap-3">
        <div :class="compact ? '[&>p]:hidden' : ''">
          <h1 class="text-xl font-semibold text-gray-900">LocalHub AI 가이드</h1>
          <p class="mt-2 text-sm text-gray-600">여행 준비와 지역 정보 탐색을 도와주는 AI 가이드입니다.</p>
          <p class="mt-1 text-sm text-gray-500">제공되는 정보는 참고용이며, 실제 일정은 확인 후 결정해 주세요.</p>
        </div>
        <div class="-mt-1 flex flex-shrink-0 gap-2">
          <button type="button" class="rounded-lg border border-sky-200 bg-white px-2.5 py-1.5 text-sm text-sky-700" title="전체화면" @click="emit('toggle-fullscreen')">⤢</button>
          <button type="button" class="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700" title="챗봇 닫기" @click="emit('close')">✕</button>
        </div>
      </div>
    </div>
  </section>
</template>
