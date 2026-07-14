<script setup lang="ts">
import TourCard from './TourCard.vue'

const tours = [
  { name: '경복궁', region: '종로구', description: '조선 시대의 대표 궁궐로 역사와 아름다움을 함께 느낄 수 있습니다.' },
  { name: '북촌 한옥마을', region: '종로구', description: '전통 한옥과 분위기 있는 골목을 둘러볼 수 있는 장소입니다.' },
  { name: '남산타워', region: '중구', description: '서울의 야경을 한눈에 감상할 수 있는 인기 명소입니다.' },
  { name: '청계천', region: '종로구', description: '도심 속 산책 코스로 자연과 휴식을 즐길 수 있습니다.' },
  { name: '서울숲', region: '성동구', description: '도심 속 녹지 공간으로 여유로운 시간을 보낼 수 있습니다.' },
  { name: '이태원', region: '용산구', description: '다양한 맛집과 문화가 공존하는 활기찬 지역입니다.' },
]
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <TourCard
        v-for="tour in tours"
        :key="tour.name"
        :name="tour.name"
        :region="tour.region"
        :description="tour.description"
      />
    </div>
  </section>
</template>
