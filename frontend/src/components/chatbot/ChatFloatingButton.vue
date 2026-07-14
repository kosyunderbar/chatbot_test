<script setup lang="ts">
interface Props {
  isOpen?: boolean
}

withDefaults(defineProps<Props>(), {
  isOpen: false,
})

const emit = defineEmits<{
  (e: 'open'): void
}>()
</script>

<template>
  <button
    type="button"
    class="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-lg transition duration-200 hover:scale-105 hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
    :class="isOpen ? 'scale-95 opacity-80' : 'scale-100 opacity-100'"
    :title="isOpen ? '챗봇 닫기' : '챗봇 열기'"
    @click="emit('open')"
  >
    <span class="text-xl">💬</span>
  </button>
</template>
