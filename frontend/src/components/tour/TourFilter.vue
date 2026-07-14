<script setup lang="ts"></script>

<template>
  <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <label for="tour-type" class="text-sm font-medium text-gray-700">관광 유형</label>
      <select
        id="tour-type"
        class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-sky-500"
      >
        <option value="all">전체</option>
        <option value="history">역사</option>
        <option value="nature">자연</option>
        <option value="shopping">쇼핑</option>
      </select>
    </div>
  </section>
</template>
