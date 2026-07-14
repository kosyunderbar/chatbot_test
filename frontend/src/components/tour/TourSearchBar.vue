<script setup lang="ts">
import BaseButton from '../common/BaseButton.vue'
import BaseInput from '../common/BaseInput.vue'

interface Props {
  modelValue: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search'): void
}>()
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
      <BaseInput :model-value="props.modelValue" placeholder="관광지를 검색해보세요" class="flex-1" @update:model-value="emit('update:modelValue', $event)" />
      <BaseButton @click="emit('search')">검색</BaseButton>
    </div>
  </section>
</template>
