<script setup lang="ts">
import type { PostCategory } from '../../types/board'
const props = withDefaults(defineProps<{ modelValue?: PostCategory }>(), { modelValue: 'all' })
const emit = defineEmits<{ (e: 'update:modelValue', value: PostCategory): void }>()
const filters: Array<{ value: PostCategory; label: string }> = [{ value: 'all', label: '전체' }, { value: 'free', label: '자유' }, { value: 'question', label: '질문' }, { value: 'recommendation', label: '추천' }, { value: 'food', label: '맛집' }]
</script>
<template><section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div class="flex flex-wrap gap-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"><button v-for="filter in filters" :key="filter.value" type="button" class="rounded-full border px-3 py-2 text-sm font-medium transition" :class="props.modelValue === filter.value ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-300 text-gray-600 hover:border-sky-500 hover:text-sky-600'" @click="emit('update:modelValue', filter.value)">{{ filter.label }}</button></div></section></template>
