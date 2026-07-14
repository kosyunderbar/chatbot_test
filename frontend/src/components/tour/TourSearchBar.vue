<script setup lang="ts"></script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <input
        type="text"
        placeholder="관광지를 검색해보세요"
        class="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-sky-500"
      />
      <button
        type="button"
        class="rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
      >
        검색
      </button>
    </div>
  </section>
</template>
