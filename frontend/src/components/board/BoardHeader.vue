<script setup lang="ts">
import BaseButton from '../common/BaseButton.vue'
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900">커뮤니티</h1>
        <p class="mt-1 text-sm text-gray-600">지역 정보와 경험을 나누는 공간입니다.</p>
      </div>
      <BaseButton>글 작성하기</BaseButton>
    </div>
  </section>
</template>
