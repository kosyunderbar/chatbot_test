<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})
</script>

<template>
  <button
    :class="[
      'rounded-xl font-semibold transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2',
      variant === 'primary'
        ? 'bg-sky-600 text-white hover:bg-sky-700'
        : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      size === 'sm' ? 'px-3 py-2 text-sm' : size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-2.5 text-sm',
      disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
    ]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>
