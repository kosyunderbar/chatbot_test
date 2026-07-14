<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '../common/BaseButton.vue'
import BaseInput from '../common/BaseInput.vue'

interface Props {
  modelValue?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  loading: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit'): void
}>()

const canSubmit = computed(() => props.modelValue.trim().length > 0 && !props.loading)

const handleSubmit = (event: Event) => {
  event.preventDefault()
  if (canSubmit.value) {
    emit('submit')
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    if (canSubmit.value) {
      emit('submit')
    }
  }
}
</script>

<template>
  <section class="mx-auto w-full max-w-5xl px-4 pb-6 sm:px-6 lg:px-8">
    <form class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row" @submit="handleSubmit">
      <BaseInput
        :model-value="modelValue"
        placeholder="메시지를 입력하세요"
        class="flex-1"
        :disabled="loading"
        @update:model-value="emit('update:modelValue', $event)"
        @keydown="handleKeydown"
      />
      <BaseButton type="submit" :disabled="!canSubmit">전송</BaseButton>
    </form>
  </section>
</template>
