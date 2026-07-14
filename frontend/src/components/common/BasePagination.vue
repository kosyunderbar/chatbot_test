<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'change', page: number): void
}>()

const goToPage = (page: number) => {
  if (page < 1 || page > props.totalPages) return
  emit('change', page)
}
</script>

<template>
  <div class="flex items-center justify-center gap-2 py-6">
    <button
      type="button"
      class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="currentPage <= 1"
      @click="goToPage(currentPage - 1)"
    >
      이전
    </button>
    <span class="text-sm font-medium text-gray-600">{{ currentPage }} / {{ totalPages }}</span>
    <button
      type="button"
      class="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
      :disabled="currentPage >= totalPages"
      @click="goToPage(currentPage + 1)"
    >
      다음
    </button>
  </div>
</template>
