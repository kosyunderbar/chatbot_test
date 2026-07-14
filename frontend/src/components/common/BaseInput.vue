<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <input
    :value="props.modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
    :class="disabled ? 'cursor-not-allowed bg-gray-100' : ''"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
