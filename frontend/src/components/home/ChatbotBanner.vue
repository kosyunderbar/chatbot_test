<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="rounded-3xl border border-sky-100 bg-sky-50 px-6 py-8 text-center shadow-sm sm:px-8">
      <h2 class="text-2xl font-semibold text-gray-900">LocalHub 챗봇을 만나보세요</h2>
      <p class="mt-3 text-sm text-gray-600 sm:text-base">
        궁금한 정보를 빠르게 확인하고 여행 계획을 도와드려요.
      </p>
      <RouterLink
        to="/chatbot"
        class="mt-6 inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
      >
        챗봇 시작하기
      </RouterLink>
    </div>
  </section>
</template>
