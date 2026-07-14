<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppFooter from './AppFooter.vue'
import AppHeader from './AppHeader.vue'
import AppNavigation from './AppNavigation.vue'
import LanguageSelector from './LanguageSelector.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col bg-white">
    <AppHeader>
      <div class="flex flex-1 items-center justify-between gap-4">
        <RouterLink to="/" class="text-lg font-semibold text-gray-900">
          LocalHub
        </RouterLink>

        <AppNavigation />

        <LanguageSelector />
      </div>
    </AppHeader>

    <main class="flex-1">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
