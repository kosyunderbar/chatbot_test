<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const { t } = useI18n()

const items = computed(() => [
  { label: t('nav.home'), to: '/' },
  { label: t('nav.map'), to: '/map' },
  { label: t('nav.tour'), to: '/tour' },
  { label: t('nav.community'), to: '/community' },
])

const isActive = (path: string) => route.path === path
</script>

<template>
  <nav class="hidden md:block">
    <ul class="flex items-center gap-8">
      <li v-for="item in items" :key="item.to">
        <RouterLink
          :to="item.to"
          class="text-sm font-medium text-gray-600 transition hover:text-gray-900"
          :class="{
            'font-semibold text-gray-900': isActive(item.to),
            'text-gray-600': !isActive(item.to),
          }"
        >
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
