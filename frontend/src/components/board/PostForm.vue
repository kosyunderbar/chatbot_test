<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import BaseInput from '../common/BaseInput.vue'
import BaseButton from '../common/BaseButton.vue'
import type { PostFormData } from '../../types/board'
import { getTagSuggestions } from '../../repositories/boardRepository'

interface Props { initialData?: Partial<PostFormData>; submitLabel: string; loading?: boolean }
const props = withDefaults(defineProps<Props>(), { initialData: undefined, loading: false })
const emit = defineEmits<{ (e: 'submit', payload: PostFormData): void; (e: 'cancel'): void }>()
const tagInput = ref('')
const tagSuggestions = ref<string[]>([])
const form = reactive<PostFormData>({ title: '', content: '', password: '', region: '', category: 'free', tags: [], existingImages: [], newImages: [] })

watch(() => props.initialData, (value) => {
  const data = value ?? {}
  form.title = data.title ?? ''; form.content = data.content ?? ''; form.region = data.region ?? ''; form.category = data.category ?? 'free'; form.password = ''
  form.tags = data.tags ?? []; form.existingImages = data.existingImages ?? []; form.newImages = []
}, { immediate: true, deep: true })

const addTag = () => { const tag = tagInput.value.trim().replace(/^#/, ''); if (tag && !form.tags.includes(tag) && form.tags.length < 10) form.tags.push(tag); tagInput.value = ''; tagSuggestions.value = [] }
const loadTagSuggestions = async () => {
  const keyword = tagInput.value.trim()
  tagSuggestions.value = keyword ? (await getTagSuggestions(keyword)).map((tag) => tag.name) : []
}
const addImages = (event: Event) => { const files = Array.from((event.target as HTMLInputElement).files ?? []); form.newImages = [...form.newImages, ...files].slice(0, 5 - form.existingImages.length) }
const submit = () => { if (form.title.trim() && form.content.trim() && form.password.trim()) emit('submit', { ...form, title: form.title.trim(), content: form.content.trim(), region: form.region.trim() }) }
</script>

<template>
  <div class="mx-auto max-w-3xl space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
    <BaseInput v-model="form.title" placeholder="제목" :disabled="loading" />
    <textarea v-model="form.content" class="min-h-[220px] w-full rounded-xl border border-gray-300 p-3" placeholder="내용" :disabled="loading" />
    <div class="grid gap-4 sm:grid-cols-2"><BaseInput v-model="form.region" placeholder="지역" :disabled="loading" /><select v-model="form.category" class="rounded-xl border border-gray-300 p-3"><option value="free">자유</option><option value="question">질문</option><option value="recommendation">추천</option></select></div>
    <div><div class="flex gap-2"><BaseInput v-model="tagInput" placeholder="태그" @update:model-value="loadTagSuggestions" @keydown.enter.prevent="addTag" /><BaseButton type="button" variant="secondary" @click="addTag">태그 추가</BaseButton></div><div v-if="tagSuggestions.length" class="mt-1 flex flex-wrap gap-1"><button v-for="tag in tagSuggestions" :key="tag" type="button" class="rounded bg-gray-100 px-2 py-1 text-xs" @click="tagInput = tag; addTag()">#{{ tag }}</button></div><div class="mt-2 flex flex-wrap gap-2"><button v-for="tag in form.tags" :key="tag" type="button" class="rounded-full bg-sky-50 px-2 py-1 text-sm" @click="form.tags = form.tags.filter((item) => item !== tag)">#{{ tag }} ×</button></div></div>
    <div><label class="block text-sm">이미지 (JPEG/PNG/WebP, 최대 5장)</label><input type="file" accept="image/jpeg,image/png,image/webp" multiple :disabled="loading" @change="addImages" /><div class="mt-2 flex flex-wrap gap-2"><button v-for="image in form.existingImages" :key="image.id" type="button" @click="form.existingImages = form.existingImages.filter((item) => item.id !== image.id)"><img :src="image.url" :alt="image.original_name" class="h-16 w-16 rounded object-cover" /></button><span v-for="file in form.newImages" :key="file.name" class="rounded bg-gray-100 px-2 py-1 text-xs">{{ file.name }}</span></div></div>
    <BaseInput v-model="form.password" type="password" placeholder="비밀번호" :disabled="loading" />
    <div class="flex justify-end gap-3"><BaseButton variant="secondary" @click="emit('cancel')">취소</BaseButton><BaseButton :disabled="loading" @click="submit">{{ submitLabel }}</BaseButton></div>
  </div>
</template>
