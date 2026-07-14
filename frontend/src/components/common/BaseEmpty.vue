<script setup lang="ts">
interface Props {
  title?: string
  description?: string
}

withDefaults(defineProps<Props>(), {
  title: '표시할 내용이 없습니다.',
  description: '잠시 후 다시 확인해 주세요.',
})
</script>

<template>
  <div class="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-10 text-center">
    <h3 class="text-lg font-semibold text-gray-800">{{ title }}</h3>
    <p class="mt-2 text-sm text-gray-500">{{ description }}</p>
    <div class="mt-4">
      <slot />
    </div>
  </div>
</template>
