<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="rounded-3xl bg-gradient-to-r from-sky-600 to-indigo-700 px-6 py-12 text-white shadow-sm sm:px-8 lg:px-10 lg:py-16">
    <div class="mx-auto flex max-w-7xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
      <div class="max-w-2xl">
        <p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">LocalHub</p>
        <h1 class="text-3xl font-bold sm:text-4xl lg:text-5xl">서울을 더 가깝게, LocalHub</h1>
        <p class="mt-4 text-base text-sky-100 sm:text-lg">
          관광 정보와 지역 커뮤니티를 한곳에서 만나보세요.
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
        <RouterLink
          to="/tour"
          class="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
        >
          관광 둘러보기
        </RouterLink>
        <RouterLink
          to="/community"
          class="rounded-full border border-white/70 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10"
        >
          커뮤니티 바로가기
        </RouterLink>
      </div>
    </div>
  </section>
</template>
