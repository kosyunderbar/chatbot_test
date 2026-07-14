<script setup lang="ts">
import TourFilter from '../components/tour/TourFilter.vue'
import TourGrid from '../components/tour/TourGrid.vue'
import TourSearchBar from '../components/tour/TourSearchBar.vue'
</script>

<template>
  <main class="bg-gray-50 py-8">
    <div class="space-y-6">
      <TourSearchBar />
      <TourFilter />
      <TourGrid />
    </div>
  </main>
</template>
