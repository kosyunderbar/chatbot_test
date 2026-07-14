<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const languages = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
]
</script>

<template>
  <label class="sr-only" for="language-selector">Language</label>
  <select
    id="language-selector"
    v-model="locale"
    class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
    aria-label="Language selector"
  >
    <option v-for="language in languages" :key="language.value" :value="language.value">
      {{ language.label }}
    </option>
  </select>
</template>
