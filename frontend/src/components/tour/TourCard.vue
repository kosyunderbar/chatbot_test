<script setup lang="ts">
import BaseButton from '../common/BaseButton.vue'
import BaseCard from '../common/BaseCard.vue'
import type { TourItem } from '../../types/tour'

interface Props {
  item: TourItem
}

const props = defineProps<Props>()
</script>

<template>
  <BaseCard>
    <img
      v-if="props.item.imageUrl"
      :src="props.item.imageUrl"
      :alt="props.item.title"
      class="h-40 w-full rounded-xl object-cover"
    />
    <div v-else class="flex h-40 items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-500">
      이미지 없음
    </div>

    <div class="mt-4">
      <h3 class="text-lg font-semibold text-gray-900">{{ props.item.title }}</h3>
      <p class="mt-1 text-sm text-gray-500">{{ props.item.category }}</p>
      <p class="mt-3 text-sm text-gray-600">{{ props.item.address || '주소 정보 없음' }}</p>
      <div class="mt-4">
        <BaseButton size="sm">자세히 보기</BaseButton>
      </div>
    </div>
  </BaseCard>
</template>
