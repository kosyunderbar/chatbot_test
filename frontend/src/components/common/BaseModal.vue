<script setup lang="ts">
import { onBeforeUnmount, onMounted, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '알림',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const close = () => emit('update:modelValue', false)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    close()
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
      <div class="absolute inset-0" @click="close"></div>
      <div
        role="dialog"
        aria-modal="true"
        class="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        @click.stop
      >
        <div class="flex items-start justify-between gap-3">
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
          <button type="button" class="text-gray-400 hover:text-gray-600" @click="close">✕</button>
        </div>

        <div class="mt-4 text-sm text-gray-600">
          <slot />
        </div>

        <div v-if="$slots.footer" class="mt-6 flex justify-end gap-2">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
