<script setup lang="ts">
const suggestions = [
  '서울 야경 명소 추천해줘',
  '비 오는 날 갈 만한 곳은?',
  '홍대 근처 맛집 알려줘',
  '가족과 가기 좋은 관광지는?',
]
</script>

<template>
  <section class="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
    <div class="flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion"
        type="button"
        class="rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700 transition hover:bg-sky-100"
      >
        {{ suggestion }}
      </button>
    </div>
  </section>
</template>
