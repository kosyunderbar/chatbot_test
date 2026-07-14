<script setup lang="ts">
import type { ChatSuggestion } from '../../types/chat'

interface Props {
  suggestions: ChatSuggestion[]
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', value: string): void
}>()
</script>

<template>
  <section class="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
    <div class="flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion.id"
        type="button"
        class="rounded-full border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700 transition hover:bg-sky-100"
        @click="emit('select', suggestion.text)"
      >
        {{ suggestion.text }}
      </button>
    </div>
  </section>
</template>
