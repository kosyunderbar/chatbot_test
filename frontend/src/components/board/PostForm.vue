<script setup lang="ts">
import { reactive, watch } from 'vue'
import BaseInput from '../common/BaseInput.vue'
import BaseButton from '../common/BaseButton.vue'
import type { PostFormData } from '../../types/board'

interface Props {
  initialData?: Partial<PostFormData>
  submitLabel: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialData: undefined,
  loading: false,
})

const emit = defineEmits<{
  (e: 'submit', payload: PostFormData): void
  (e: 'cancel'): void
}>()

const initialData = props.initialData ?? {}

const form = reactive<PostFormData>({
  title: initialData.title ?? '',
  content: initialData.content ?? '',
  password: '',
  region: initialData.region ?? '',
  category: initialData.category ?? 'free',
})

watch(
  () => props.initialData,
  (value) => {
    const nextData = value ?? {}
    form.title = nextData.title ?? ''
    form.content = nextData.content ?? ''
    form.region = nextData.region ?? ''
    form.category = nextData.category ?? 'free'
    form.password = ''
  },
  { deep: true, immediate: true },
)

const errors = reactive<{ title?: string; content?: string; password?: string }>({})

const validate = (): boolean => {
  errors.title = form.title.trim() ? undefined : '제목을 입력해주세요.'

  if (form.title.length > 200) {
    errors.title = '제목은 200자 이내여야 합니다.'
  }

  errors.content = form.content.trim() ? undefined : '내용을 입력해주세요.'
  errors.password = form.password.trim() ? undefined : '비밀번호를 입력해주세요.'

  return !errors.title && !errors.content && !errors.password
}

const handleSubmit = () => {
  if (!validate()) {
    return
  }

  emit('submit', {
    title: form.title.trim(),
    content: form.content.trim(),
    password: form.password,
    region: form.region.trim(),
    category: form.category,
  })
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <div class="grid gap-5">
      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">제목</label>
        <BaseInput v-model="form.title" placeholder="게시글 제목을 입력하세요." :disabled="props.loading" />
        <p v-if="errors.title" class="mt-2 text-sm text-red-500">{{ errors.title }}</p>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">내용</label>
        <textarea
          v-model="form.content"
          class="w-full min-h-[220px] rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          placeholder="게시글 내용을 입력하세요."
          :disabled="props.loading"
        ></textarea>
        <p v-if="errors.content" class="mt-2 text-sm text-red-500">{{ errors.content }}</p>
      </div>

      <div class="grid gap-5 sm:grid-cols-2">
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">지역</label>
          <BaseInput v-model="form.region" placeholder="지역을 입력하세요." :disabled="props.loading" />
        </div>
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-700">카테고리</label>
          <select
            v-model="form.category"
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
            :disabled="props.loading"
          >
            <option value="free">free</option>
            <option value="question">question</option>
            <option value="recommendation">recommendation</option>
            <option value="food">food</option>
          </select>
        </div>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-gray-700">비밀번호</label>
        <BaseInput v-model="form.password" placeholder="삭제/수정을 위한 비밀번호" :disabled="props.loading" />
        <p v-if="errors.password" class="mt-2 text-sm text-red-500">{{ errors.password }}</p>
      </div>
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:justify-end">
      <BaseButton variant="secondary" size="md" :disabled="props.loading" @click="handleCancel">취소</BaseButton>
      <BaseButton size="md" :disabled="props.loading" @click="handleSubmit">{{ props.submitLabel }}</BaseButton>
    </div>
  </div>
</template>
