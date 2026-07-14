<script setup lang="ts">
import BaseButton from '../common/BaseButton.vue'
import BaseInput from '../common/BaseInput.vue'

interface Props {
  modelValue?: string
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>()

const handleSearch = () => {
  emit('search')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    emit('search')
  }
}
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <BaseInput
        :model-value="modelValue"
        placeholder="게시글 검색"
        class="flex-1"
        @update:model-value="emit('update:modelValue', $event)"
        @keydown="handleKeydown"
      />
      <BaseButton type="button" @click="handleSearch">검색</BaseButton>
    </div>
  </section>
</template>
