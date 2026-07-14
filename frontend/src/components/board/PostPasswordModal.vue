<script setup lang="ts">
import { ref, watch } from 'vue'
import BaseModal from '../common/BaseModal.vue'
import BaseInput from '../common/BaseInput.vue'
import BaseButton from '../common/BaseButton.vue'

interface Props {
  modelValue: boolean
  title: string
  confirmLabel: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', password: string): void
}>()

const password = ref('')

const close = () => {
  password.value = ''
  emit('update:modelValue', false)
}

const handleConfirm = () => {
  emit('confirm', password.value)
}

watch(
  () => props.modelValue,
  (value) => {
    if (!value) {
      password.value = ''
    }
  },
)
</script>

<template>
  <BaseModal :model-value="props.modelValue" :title="props.title" @update:modelValue="(value) => emit('update:modelValue', value)">
    <div class="space-y-4">
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">비밀번호</label>
        <BaseInput v-model="password" placeholder="비밀번호를 입력하세요." :disabled="props.loading" />
      </div>
      <div class="flex flex-wrap gap-3 justify-end">
        <BaseButton variant="secondary" size="md" :disabled="props.loading" @click="close">취소</BaseButton>
        <BaseButton size="md" :disabled="props.loading" @click="handleConfirm">{{ props.confirmLabel }}</BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
