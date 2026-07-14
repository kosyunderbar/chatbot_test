<script setup lang="ts">
const filters = ['전체', '자유', '질문', '추천']
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        class="rounded-full border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-sky-500 hover:text-sky-600"
      >
        {{ filter }}
      </button>
    </div>
  </section>
</template>
