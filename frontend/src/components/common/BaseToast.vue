<script setup lang="ts">
interface Props {
  message: string
  type?: 'success' | 'error' | 'info'
  show: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'info',
  show: false,
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

const typeStyles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
}
</script>

<template>
  <div v-if="show" class="fixed right-4 top-4 z-[120] w-[min(92vw,24rem)] rounded-xl border p-4 shadow-lg" :class="typeStyles[type]">
    <div class="flex items-start justify-between gap-3">
      <div class="flex-1">
        <p class="text-sm font-medium">{{ message }}</p>
      </div>
      <button type="button" class="text-sm font-semibold hover:opacity-80" @click="emit('close')">
        ✕
      </button>
    </div>
  </div>
</template>
