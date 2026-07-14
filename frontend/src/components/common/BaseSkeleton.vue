<script setup lang="ts">
interface Props {
  className?: string
  height?: string
  width?: string
}

withDefaults(defineProps<Props>(), {
  className: '',
  height: 'h-4',
  width: 'w-full',
})
</script>

<template>
  <div :class="['animate-pulse rounded-xl bg-gray-200', width, height, className]"></div>
</template>
