<script setup lang="ts">
interface Props {
  role: 'user' | 'assistant'
  text: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex" :class="props.role === 'user' ? 'justify-end' : 'justify-start'">
    <div
      class="max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm"
      :class="props.role === 'user' ? 'bg-sky-600 text-white' : 'bg-white text-gray-700 border border-gray-200'"
    >
      {{ props.text }}
    </div>
  </div>
</template>
