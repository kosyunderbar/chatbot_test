<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-gray-200 bg-gray-50">
    <div class="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-gray-600 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
      <p class="font-medium text-gray-800">LocalHub</p>
      <p>SSAFY 팀프로젝트</p>
      <p>© {{ year }} LocalHub</p>
    </div>
  </footer>
</template>
