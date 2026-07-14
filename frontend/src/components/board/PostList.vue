<script setup lang="ts">
import PostListItem from './PostListItem.vue'

const posts = [
  { title: '서울 근교 여행지 추천', category: '자유', author: '민지', date: '2026-07-10', views: 128, comments: 5 },
  { title: '주말에 가기 좋은 맛집', category: '추천', author: '준호', date: '2026-07-09', views: 96, comments: 3 },
  { title: '문화 행사 일정 알려주세요', category: '질문', author: '서연', date: '2026-07-08', views: 74, comments: 2 },
  { title: '역사 명소 투어 코스 공유', category: '자유', author: '유진', date: '2026-07-07', views: 88, comments: 4 },
  { title: '한강 산책하기 좋은 시간대', category: '추천', author: '도윤', date: '2026-07-06', views: 67, comments: 1 },
  { title: '쇼핑 동선 짧게 추천해주세요', category: '질문', author: '하린', date: '2026-07-05', views: 54, comments: 2 },
  { title: '숨은 맛집 발견했어요', category: '자유', author: '태현', date: '2026-07-04', views: 45, comments: 3 },
  { title: '가족과 가기 좋은 장소', category: '추천', author: '소희', date: '2026-07-03', views: 39, comments: 1 },
]
</script>

<template>
  <section class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
    <div class="space-y-4">
      <PostListItem
        v-for="post in posts"
        :key="post.title"
        :title="post.title"
        :category="post.category"
        :author="post.author"
        :date="post.date"
        :views="post.views"
        :comments="post.comments"
      />
    </div>
  </section>
</template>
