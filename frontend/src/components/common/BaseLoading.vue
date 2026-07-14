<script setup lang="ts">
interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: '불러오는 중입니다.',
})
</script>

<template>
  <div class="flex flex-col items-center justify-center gap-3 py-10" role="status" aria-live="polite">
    <div class="h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"></div>
    <p class="text-sm text-gray-600">{{ message }}</p>
  </div>
</template>
