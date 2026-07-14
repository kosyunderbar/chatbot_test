<script setup lang="ts">
import CategoryGrid from '../components/home/CategoryGrid.vue'
import ChatbotBanner from '../components/home/ChatbotBanner.vue'
import CommunityPreview from '../components/home/CommunityPreview.vue'
import HeroBanner from '../components/home/HeroBanner.vue'
import PopularTourSection from '../components/home/PopularTourSection.vue'
</script>

<template>
  <main class="bg-gray-50 py-8">
    <div class="space-y-6">
      <HeroBanner />
      <CategoryGrid />
      <PopularTourSection />
      <CommunityPreview />
      <ChatbotBanner />
    </div>
  </main>
</template>
