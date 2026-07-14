<script setup lang="ts">
import type { TourCategory } from '../../types/tour'

interface Props {
  modelValue: TourCategory | 'all'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: TourCategory | 'all'): void
}>()

const options: Array<{ value: TourCategory | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'attraction', label: '관광지' },
  { value: 'food', label: '맛집' },
  { value: 'leisure', label: '레저·스포츠' },
  { value: 'culture', label: '문화시설' },
  { value: 'shopping', label: '쇼핑' },
  { value: 'accommodation', label: '숙박' },
  { value: 'course', label: '여행 코스' },
  { value: 'festival', label: '축제·공연·행사' },
]
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <label for="tour-type" class="text-sm font-medium text-gray-700">관광 유형</label>
      <select
        id="tour-type"
        :value="props.modelValue"
        class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-sky-500"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value as TourCategory | 'all')"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">{{ option.label }}</option>
      </select>
    </div>
  </section>
</template>
