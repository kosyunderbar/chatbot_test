<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const languages = computed(() => [
  { value: 'ko', label: t('lang.ko') },
  { value: 'en', label: t('lang.en') },
  { value: 'ja', label: t('lang.ja') },
  { value: 'zh', label: t('lang.zh') },
])
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
