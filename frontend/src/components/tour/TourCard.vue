<script setup lang="ts">
import BaseButton from '../common/BaseButton.vue'
import BaseCard from '../common/BaseCard.vue'

interface Props {
  name: string
  region: string
  description: string
}

const props = defineProps<Props>()
</script>

<template>
  <BaseCard>
    <div class="h-40 rounded-xl bg-gray-200"></div>
    <div class="mt-4">
      <h3 class="text-lg font-semibold text-gray-900">{{ props.name }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ props.region }}</p>
      <p class="mt-3 text-sm text-gray-600">{{ props.description }}</p>
      <div class="mt-4">
        <BaseButton size="sm">자세히 보기</BaseButton>
      </div>
    </div>
  </BaseCard>
</template>
