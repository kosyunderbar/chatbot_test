<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const isOpen = ref(false)
const route = useRoute()
const { t } = useI18n()

const items = computed(() => [
  { label: t('nav.home'), to: '/' },
  { label: t('nav.map'), to: '/map' },
  { label: t('nav.tour'), to: '/tour' },
  { label: t('nav.community'), to: '/community' },
  { label: t('nav.chatbot'), to: '/chatbot' },
])

const closeMenu = () => {
  isOpen.value = false
}

const isActive = (path: string) => route.path === path
</script>

<template>
  <div class="md:hidden">
    <button
      type="button"
      class="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700"
      :aria-expanded="isOpen"
      aria-label="Toggle navigation menu"
      @click="isOpen = !isOpen"
    >
      <span v-if="!isOpen">Menu</span>
      <span v-else>Close</span>
    </button>

    <div v-if="isOpen" class="absolute left-0 right-0 top-16 z-40 border-b border-gray-200 bg-white shadow-md">
      <ul class="flex flex-col px-4 py-3">
        <li v-for="item in items" :key="item.to">
          <RouterLink
            :to="item.to"
            class="block rounded-md px-3 py-2 text-sm font-medium text-gray-700"
            :class="{
              'bg-gray-100 font-semibold text-gray-900': isActive(item.to),
            }"
            @click="closeMenu"
          >
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>
