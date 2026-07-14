<script setup lang="ts">
interface Props {
  name: string
  region: string
  description: string
}

const props = defineProps<Props>()
</script>

<template>
  <article class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <div class="h-40 bg-gray-200"></div>
    <div class="p-5">
      <h3 class="text-lg font-semibold text-gray-900">{{ props.name }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ props.region }}</p>
      <p class="mt-3 text-sm text-gray-600">{{ props.description }}</p>
    </div>
  </article>
</template>
